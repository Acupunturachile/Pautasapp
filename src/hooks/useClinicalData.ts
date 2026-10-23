import { useState, useEffect, useRef } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { Exercise, ClinicalPlan, TrackingSession, CustomTemplate, AppUser } from '../types/clinical';
import { SEED_EXERCISES } from '../data/seedExercises';
import { uid, isAuthorizedEmail } from '../utils/clinicalUtils';
import {
  db,
  auth,
  subscribeAuth,
  loginWithGoogle,
  logout,
  handleFirestoreError,
  OperationType
} from '../firebase';

function localGet<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch (e) {
    return fallback;
  }
}

function localSet<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    // quota exceeded or blocked
  }
}

export function useClinicalData() {
  const [currentUser, setCurrentUser] = useState<AppUser | User | null>(() => {
    if (auth.currentUser) return auth.currentUser;
    const stored = localGet<AppUser | null>('pautas_clinical_user', null);
    if (stored && stored.email && isAuthorizedEmail(stored.email)) {
      return stored;
    }
    return null;
  });
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [cloudConnected, setCloudConnected] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleLogin = async () => {
    setAuthError(null);
    try {
      const user = await loginWithGoogle();
      if (user && user.email) {
        const appUser: AppUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          photoURL: user.photoURL,
          isFirebaseUser: true
        };
        localSet('pautas_clinical_user', appUser);
        setCurrentUser(user);
      }
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      if (e?.code === 'auth/unauthorized-domain') {
        const host = typeof window !== 'undefined' ? window.location.hostname : 'run.app';
        setAuthError(
          `Firebase bloqueó la ventana de Google porque el dominio "${host}" no está en los Dominios Autorizados de tu proyecto en Firebase Console. Puedes autorizarlo en Firebase Console o usar el "Acceso Rápido del Equipo Clínico" para ingresar de inmediato.`
        );
      } else if (e?.code === 'auth/popup-closed-by-user') {
        // user closed popup
      } else {
        setAuthError(e?.message || 'Error al iniciar sesión con Google.');
      }
    }
  };

  const loginAsClinicalUser = (email: string) => {
    const trimmed = email.trim().toLowerCase();
    if (!isAuthorizedEmail(trimmed)) {
      setAuthError(`El correo ${trimmed} no figura en la nómina de profesionales autorizados.`);
      return;
    }
    const appUser: AppUser = {
      uid: 'cli_' + trimmed.replace(/[^a-z0-9]/g, '_'),
      email: trimmed,
      displayName: trimmed.split('@')[0],
      isFirebaseUser: false
    };
    localSet('pautas_clinical_user', appUser);
    setCurrentUser(appUser);
    setAuthError(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      // ignore
    }
    try {
      localStorage.removeItem('pautas_clinical_user');
    } catch (e) {
      // ignore
    }
    setCurrentUser(null);
    setCloudConnected(false);
    setIsSyncing(false);
  };

  // Local state with localStorage as resilient initial cache
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const saved = localGet<Exercise[] | null>('pautas_exercises_v3', null);
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
    const initial = SEED_EXERCISES.map(e => ({ ...e, id: uid(), createdAt: Date.now() }));
    localSet('pautas_exercises_v3', initial);
    return initial;
  });

  const [plans, setPlans] = useState<ClinicalPlan[]>(() => {
    return localGet<ClinicalPlan[]>('pautas_plans', []);
  });

  const [puntoFotos, setPuntoFotos] = useState<Record<string, string>>(() => {
    return localGet<Record<string, string>>('pautas_puntofotos', {});
  });

  const [sesiones, setSesiones] = useState<TrackingSession[]>(() => {
    return localGet<TrackingSession[]>('pautas_sesiones', []);
  });

  const [misPlantillas, setMisPlantillas] = useState<CustomTemplate[]>(() => {
    return localGet<CustomTemplate[]>('pautas_plantillas', []);
  });

  const exercisesSeededRef = useRef(false);

  // Subscribe to Auth changes
  useEffect(() => {
    const unsubAuth = subscribeAuth(user => {
      if (user) {
        setCurrentUser(user);
      } else {
        const stored = localGet<AppUser | null>('pautas_clinical_user', null);
        if (stored && stored.email && isAuthorizedEmail(stored.email)) {
          setCurrentUser(stored);
        } else {
          setCurrentUser(null);
        }
      }
      setAuthLoading(false);
    });
    return () => unsubAuth();
  }, []);

  // Sync state to local storage backups
  useEffect(() => {
    localSet('pautas_exercises_v3', exercises);
  }, [exercises]);

  useEffect(() => {
    localSet('pautas_plans', plans);
  }, [plans]);

  useEffect(() => {
    localSet('pautas_puntofotos', puntoFotos);
  }, [puntoFotos]);

  useEffect(() => {
    localSet('pautas_sesiones', sesiones);
  }, [sesiones]);

  useEffect(() => {
    localSet('pautas_plantillas', misPlantillas);
  }, [misPlantillas]);

  const [permissionNotice, setPermissionNotice] = useState<boolean>(false);

  const reportIssue = (err: unknown, op: OperationType, path: string | null) => {
    setCloudConnected(false);
    setIsSyncing(false);
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('Missing or insufficient permissions') || msg.includes('permission-denied')) {
      setPermissionNotice(true);
    }
    try {
      handleFirestoreError(err, op, path);
    } catch (e) {
      // Formatted error recorded as required by Firebase diagnostics without throwing uncaught
    }
  };

  // Real-time Firestore Subscriptions (active only when authenticated in Firebase Auth)
  useEffect(() => {
    if (!auth.currentUser) {
      setIsSyncing(false);
      setCloudConnected(false);
      return;
    }

    setIsSyncing(true);

    // 1. Plans Collection
    const plansCol = collection(db, 'plans');
    const unsubPlans = onSnapshot(
      plansCol,
      snapshot => {
        const remotePlans: ClinicalPlan[] = [];
        snapshot.forEach(docSnap => {
          remotePlans.push({ ...(docSnap.data() as ClinicalPlan), id: docSnap.id });
        });

        // Sort by createdAt or date descending
        remotePlans.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        if (remotePlans.length > 0) {
          setPlans(remotePlans);
        } else if (plans.length > 0) {
          plans.forEach(p => {
            setDoc(doc(db, 'plans', p.id), p).catch(err => {
              reportIssue(err, OperationType.WRITE, `plans/${p.id}`);
            });
          });
        }
        setCloudConnected(true);
        setIsSyncing(false);
        setPermissionNotice(false);
      },
      error => {
        reportIssue(error, OperationType.LIST, 'plans');
      }
    );

    // 2. Sesiones Collection
    const sesionesCol = collection(db, 'sesiones');
    const unsubSesiones = onSnapshot(
      sesionesCol,
      snapshot => {
        const remoteSes: TrackingSession[] = [];
        snapshot.forEach(docSnap => {
          remoteSes.push({ ...(docSnap.data() as TrackingSession), id: docSnap.id });
        });

        if (remoteSes.length > 0) {
          setSesiones(remoteSes);
        } else if (sesiones.length > 0) {
          sesiones.forEach(s => {
            const sid = s.id || uid();
            setDoc(doc(db, 'sesiones', sid), { ...s, id: sid }).catch(() => {});
          });
        }
      },
      error => {
        reportIssue(error, OperationType.LIST, 'sesiones');
      }
    );

    // 3. Exercises Collection
    const exercisesCol = collection(db, 'exercises');
    const unsubExercises = onSnapshot(
      exercisesCol,
      snapshot => {
        const remoteEx: Exercise[] = [];
        snapshot.forEach(docSnap => {
          remoteEx.push({ ...(docSnap.data() as Exercise), id: docSnap.id });
        });

        if (remoteEx.length > 0) {
          setExercises(remoteEx);
        } else if (!exercisesSeededRef.current) {
          exercisesSeededRef.current = true;
          // Seed the catalog to Firestore
          exercises.forEach(ex => {
            setDoc(doc(db, 'exercises', ex.id), ex).catch(err => {
              reportIssue(err, OperationType.WRITE, `exercises/${ex.id}`);
            });
          });
        }
      },
      error => {
        reportIssue(error, OperationType.LIST, 'exercises');
      }
    );

    // 4. Plantillas Collection
    const plantillasCol = collection(db, 'plantillas');
    const unsubPlantillas = onSnapshot(
      plantillasCol,
      snapshot => {
        const remotePlt: CustomTemplate[] = [];
        snapshot.forEach(docSnap => {
          remotePlt.push({ ...(docSnap.data() as CustomTemplate), id: docSnap.id });
        });
        if (remotePlt.length > 0) {
          setMisPlantillas(remotePlt);
        }
      },
      error => {
        reportIssue(error, OperationType.LIST, 'plantillas');
      }
    );

    // 5. Punto Fotos Collection
    const puntoFotosCol = collection(db, 'puntofotos');
    const unsubFotos = onSnapshot(
      puntoFotosCol,
      snapshot => {
        const map: Record<string, string> = {};
        snapshot.forEach(docSnap => {
          const d = docSnap.data() as { cod: string; dataUrl: string };
          if (d.cod && d.dataUrl) {
            map[d.cod] = d.dataUrl;
          }
        });
        if (Object.keys(map).length > 0) {
          setPuntoFotos(map);
        }
      },
      error => {
        reportIssue(error, OperationType.LIST, 'puntofotos');
      }
    );

    return () => {
      unsubPlans();
      unsubSesiones();
      unsubExercises();
      unsubPlantillas();
      unsubFotos();
    };
  }, [currentUser]);

  // CRUD Operations with Firestore + Optimistic Local UI
  const savePlan = (plan: Omit<ClinicalPlan, 'id'> & { id?: string }) => {
    const finalId = plan.id || uid();
    const newPlan: ClinicalPlan = {
      ...plan,
      id: finalId,
      createdAt: plan.createdAt || Date.now()
    };

    // Optimistic local update
    setPlans(prev => {
      const idx = prev.findIndex(p => p.id === finalId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newPlan;
        return copy;
      }
      return [newPlan, ...prev];
    });

    // Firestore async persist if real Firebase user is authenticated
    if (auth.currentUser) {
      setDoc(doc(db, 'plans', finalId), newPlan).catch(err => {
        reportIssue(err, OperationType.WRITE, `plans/${finalId}`);
      });
    }

    return newPlan;
  };

  const deletePlan = (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id));
    if (auth.currentUser) {
      deleteDoc(doc(db, 'plans', id)).catch(err => {
        reportIssue(err, OperationType.DELETE, `plans/${id}`);
      });
    }
  };

  const saveSesion = (ses: Omit<TrackingSession, 'id'> & { id?: string }) => {
    const finalId = ses.id || uid();
    const newSes: TrackingSession = {
      ...ses,
      id: finalId,
      createdAt: ses.createdAt || Date.now()
    };

    setSesiones(prev => {
      const idx = prev.findIndex(s => s.id === finalId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newSes;
        return copy;
      }
      return [...prev, newSes];
    });

    if (auth.currentUser) {
      setDoc(doc(db, 'sesiones', finalId), newSes).catch(err => {
        reportIssue(err, OperationType.WRITE, `sesiones/${finalId}`);
      });
    }

    return newSes;
  };

  const deleteSesion = (id: string) => {
    setSesiones(prev => prev.filter(s => s.id !== id));
    if (auth.currentUser) {
      deleteDoc(doc(db, 'sesiones', id)).catch(err => {
        reportIssue(err, OperationType.DELETE, `sesiones/${id}`);
      });
    }
  };

  const saveExercise = (ex: Omit<Exercise, 'id'> & { id?: string }) => {
    const finalId = ex.id || uid();
    const newEx: Exercise = {
      ...ex,
      id: finalId,
      createdAt: ex.createdAt || Date.now()
    };

    setExercises(prev => {
      const idx = prev.findIndex(e => e.id === finalId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newEx;
        return copy;
      }
      return [newEx, ...prev];
    });

    if (auth.currentUser) {
      setDoc(doc(db, 'exercises', finalId), newEx).catch(err => {
        reportIssue(err, OperationType.WRITE, `exercises/${finalId}`);
      });
    }

    return newEx;
  };

  const deleteExercise = (id: string) => {
    setExercises(prev => prev.filter(e => e.id !== id));
    if (auth.currentUser) {
      deleteDoc(doc(db, 'exercises', id)).catch(err => {
        reportIssue(err, OperationType.DELETE, `exercises/${id}`);
      });
    }
  };

  const savePlantilla = (plt: CustomTemplate) => {
    setMisPlantillas(prev => {
      const idx = prev.findIndex(p => p.id === plt.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = plt;
        return copy;
      }
      return [...prev, plt];
    });

    if (auth.currentUser) {
      setDoc(doc(db, 'plantillas', plt.id), plt).catch(err => {
        reportIssue(err, OperationType.WRITE, `plantillas/${plt.id}`);
      });
    }
  };

  const deletePlantilla = (id: string) => {
    setMisPlantillas(prev => prev.filter(p => p.id !== id));
    if (auth.currentUser) {
      deleteDoc(doc(db, 'plantillas', id)).catch(err => {
        reportIssue(err, OperationType.DELETE, `plantillas/${id}`);
      });
    }
  };

  const savePuntoFoto = (cod: string, dataUrl: string) => {
    setPuntoFotos(prev => ({ ...prev, [cod]: dataUrl }));
    if (auth.currentUser) {
      setDoc(doc(db, 'puntofotos', cod), { cod, dataUrl }).catch(err => {
        reportIssue(err, OperationType.WRITE, `puntofotos/${cod}`);
      });
    }
  };

  const deletePuntoFoto = (cod: string) => {
    setPuntoFotos(prev => {
      const copy = { ...prev };
      delete copy[cod];
      return copy;
    });
    if (auth.currentUser) {
      deleteDoc(doc(db, 'puntofotos', cod)).catch(err => {
        reportIssue(err, OperationType.DELETE, `puntofotos/${cod}`);
      });
    }
  };

  return {
    currentUser,
    authLoading,
    cloudConnected,
    isSyncing,
    permissionNotice,
    dismissPermissionNotice: () => setPermissionNotice(false),
    authError,
    dismissAuthError: () => setAuthError(null),
    loginWithGoogle: handleLogin,
    loginAsClinicalUser,
    logout: handleLogout,
    exercises,
    plans,
    puntoFotos,
    sesiones,
    misPlantillas,
    saveExercise,
    deleteExercise,
    savePlan,
    deletePlan,
    savePuntoFoto,
    deletePuntoFoto,
    saveSesion,
    deleteSesion,
    savePlantilla,
    deletePlantilla
  };
}
