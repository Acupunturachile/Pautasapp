import { useState, useEffect, useRef } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { User } from 'firebase/auth';
import { Exercise, ClinicalPlan, TrackingSession, CustomTemplate } from '../types/clinical';
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
  } catch {
    return fallback;
  }
}

function localSet<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // quota exceeded or blocked
  }
}

/**
 * Recursively removes keys with `undefined` values because Firestore `setDoc`
 * rejects payloads containing `undefined`.
 */
function sanitizeForFirestore<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(item => sanitizeForFirestore(item)) as unknown as T;
  }
  if (value !== null && typeof value === 'object') {
    const clean: Record<string, unknown> = {};
    Object.entries(value as Record<string, unknown>).forEach(([key, val]) => {
      if (val !== undefined) {
        clean[key] = sanitizeForFirestore(val);
      }
    });
    return clean as T;
  }
  return value;
}

export function useClinicalData() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => auth.currentUser);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [cloudConnected, setCloudConnected] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [permissionNotice, setPermissionNotice] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const handleLogin = async () => {
    setAuthError(null);
    try {
      const user = await loginWithGoogle();
      if (user) {
        setCurrentUser(user);
      }
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      if (e?.code === 'auth/unauthorized-domain' || e?.message?.includes('unauthorized-domain')) {
        const host = typeof window !== 'undefined' ? window.location.hostname : 'apppautas.vercel.app';
        setAuthError(
          `Firebase bloqueó el inicio de sesión porque el dominio "${host}" no está en los Dominios Autorizados de tu proyecto en Firebase Console. Agrégalo en Firebase Console > Authentication > Settings.`
        );
      } else if (e?.code === 'auth/popup-blocked') {
        setAuthError(
          'El navegador bloqueó la ventana emergente de Google. Permite las ventanas emergentes (pop-ups) para este sitio e intenta nuevamente.'
        );
      } else if (e?.code === 'auth/popup-closed-by-user' || e?.code === 'auth/cancelled-popup-request') {
        // user closed popup
      } else {
        setAuthError(e?.message || 'Error al iniciar sesión con Google.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // ignore
    }
    try {
      localStorage.removeItem('pautas_clinical_user');
    } catch {
      // ignore
    }
    setCurrentUser(null);
    setCloudConnected(false);
    setIsSyncing(false);
    setPermissionNotice(false);
    setSyncError(null);
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

  // Refs to access current state cleanly inside snapshot callbacks without stale closures
  const exercisesRef = useRef(exercises);
  exercisesRef.current = exercises;
  const plansRef = useRef(plans);
  plansRef.current = plans;
  const sesionesRef = useRef(sesiones);
  sesionesRef.current = sesiones;

  const exercisesSeededRef = useRef(false);
  const plansSyncedOnceRef = useRef(false);
  const sesionesSyncedOnceRef = useRef(false);

  // Subscribe to Auth changes
  useEffect(() => {
    const unsubAuth = subscribeAuth(user => {
      setCurrentUser(user);
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

  const reportIssue = (err: unknown, op: OperationType, path: string | null) => {
    setIsSyncing(false);
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('Missing or insufficient permissions') || msg.includes('permission-denied')) {
      setCloudConnected(false);
      setPermissionNotice(true);
    } else if (msg.includes('Quota exceeded')) {
      setSyncError('Se alcanzó el límite diario gratuito de Firestore. Los cambios permanecen guardados localmente.');
    } else {
      setSyncError(`Error de sincronización en Firestore (${path || op}): ${msg}`);
    }
    try {
      handleFirestoreError(err, op, path);
    } catch {
      // Formatted error logged by handleFirestoreError without crashing the UI
    }
  };

  // Real-time Firestore Subscriptions (active only when an authorized clinical user is signed in)
  useEffect(() => {
    if (!currentUser || !isAuthorizedEmail(currentUser.email)) {
      setIsSyncing(false);
      setCloudConnected(false);
      plansSyncedOnceRef.current = false;
      sesionesSyncedOnceRef.current = false;
      return;
    }

    setIsSyncing(true);
    setPermissionNotice(false);
    setSyncError(null);

    const alreadyMigrated = localGet<string>('pautas_cloud_migrated', '') === '1';

    // 1. Plans Collection
    const plansCol = collection(db, 'plans');
    const unsubPlans = onSnapshot(
      plansCol,
      snapshot => {
        const remotePlans: ClinicalPlan[] = [];
        snapshot.forEach(docSnap => {
          remotePlans.push({ ...(docSnap.data() as ClinicalPlan), id: docSnap.id });
        });
        remotePlans.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        if (
          !plansSyncedOnceRef.current &&
          remotePlans.length === 0 &&
          plansRef.current.length > 0 &&
          !alreadyMigrated &&
          !snapshot.metadata.fromCache
        ) {
          plansSyncedOnceRef.current = true;
          plansRef.current.forEach(p => {
            const pid = p.id || uid();
            const clean = sanitizeForFirestore({ ...p, id: pid });
            setDoc(doc(db, 'plans', pid), clean).catch(err => {
              reportIssue(err, OperationType.WRITE, `plans/${pid}`);
            });
          });
        } else {
          plansSyncedOnceRef.current = true;
          setPlans(remotePlans);
        }

        if (!snapshot.metadata.fromCache) {
          localSet('pautas_cloud_migrated', '1');
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

        if (
          !sesionesSyncedOnceRef.current &&
          remoteSes.length === 0 &&
          sesionesRef.current.length > 0 &&
          !alreadyMigrated &&
          !snapshot.metadata.fromCache
        ) {
          sesionesSyncedOnceRef.current = true;
          sesionesRef.current.forEach(s => {
            const sid = s.id || uid();
            const clean = sanitizeForFirestore({ ...s, id: sid });
            setDoc(doc(db, 'sesiones', sid), clean).catch(err => {
              reportIssue(err, OperationType.WRITE, `sesiones/${sid}`);
            });
          });
        } else {
          sesionesSyncedOnceRef.current = true;
          setSesiones(remoteSes);
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
          exercisesSeededRef.current = true;
          setExercises(remoteEx);
        } else if (!exercisesSeededRef.current && !snapshot.metadata.fromCache) {
          exercisesSeededRef.current = true;
          const seedList =
            exercisesRef.current.length > 0
              ? exercisesRef.current
              : SEED_EXERCISES.map(e => ({ ...e, id: uid(), createdAt: Date.now() }));
          seedList.forEach(ex => {
            const eid = ex.id || uid();
            const clean = sanitizeForFirestore({ ...ex, id: eid });
            setDoc(doc(db, 'exercises', eid), clean).catch(err => {
              reportIssue(err, OperationType.WRITE, `exercises/${eid}`);
            });
          });
        } else if (exercisesSeededRef.current) {
          setExercises(remoteEx);
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
        setMisPlantillas(remotePlt);
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
        setPuntoFotos(map);
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

  const canWriteCloud = () =>
    Boolean(auth.currentUser && isAuthorizedEmail(auth.currentUser.email));

  // CRUD Operations with Firestore + Optimistic Local UI
  const savePlan = (plan: Omit<ClinicalPlan, 'id'> & { id?: string }) => {
    const finalId = plan.id || uid();
    const newPlan: ClinicalPlan = sanitizeForFirestore({
      ...plan,
      id: finalId,
      createdAt: plan.createdAt || Date.now()
    });

    setPlans(prev => {
      const idx = prev.findIndex(p => p.id === finalId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newPlan;
        return copy;
      }
      return [newPlan, ...prev];
    });

    if (canWriteCloud()) {
      setDoc(doc(db, 'plans', finalId), newPlan).catch(err => {
        reportIssue(err, OperationType.WRITE, `plans/${finalId}`);
      });
    }

    return newPlan;
  };

  const deletePlan = (id: string) => {
    setPlans(prev => prev.filter(p => p.id !== id));
    if (canWriteCloud()) {
      deleteDoc(doc(db, 'plans', id)).catch(err => {
        reportIssue(err, OperationType.DELETE, `plans/${id}`);
      });
    }
  };

  const saveSesion = (ses: Omit<TrackingSession, 'id'> & { id?: string }) => {
    const finalId = ses.id || uid();
    const newSes: TrackingSession = sanitizeForFirestore({
      ...ses,
      id: finalId,
      createdAt: ses.createdAt || Date.now()
    });

    setSesiones(prev => {
      const idx = prev.findIndex(s => s.id === finalId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newSes;
        return copy;
      }
      return [...prev, newSes];
    });

    if (canWriteCloud()) {
      setDoc(doc(db, 'sesiones', finalId), newSes).catch(err => {
        reportIssue(err, OperationType.WRITE, `sesiones/${finalId}`);
      });
    }

    return newSes;
  };

  const deleteSesion = (id: string) => {
    setSesiones(prev => prev.filter(s => s.id !== id));
    if (canWriteCloud()) {
      deleteDoc(doc(db, 'sesiones', id)).catch(err => {
        reportIssue(err, OperationType.DELETE, `sesiones/${id}`);
      });
    }
  };

  const saveExercise = (ex: Omit<Exercise, 'id'> & { id?: string }) => {
    const finalId = ex.id || uid();
    const newEx: Exercise = sanitizeForFirestore({
      ...ex,
      id: finalId,
      createdAt: ex.createdAt || Date.now()
    });

    setExercises(prev => {
      const idx = prev.findIndex(e => e.id === finalId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newEx;
        return copy;
      }
      return [newEx, ...prev];
    });

    if (canWriteCloud()) {
      setDoc(doc(db, 'exercises', finalId), newEx).catch(err => {
        reportIssue(err, OperationType.WRITE, `exercises/${finalId}`);
      });
    }

    return newEx;
  };

  const deleteExercise = (id: string) => {
    setExercises(prev => prev.filter(e => e.id !== id));
    if (canWriteCloud()) {
      deleteDoc(doc(db, 'exercises', id)).catch(err => {
        reportIssue(err, OperationType.DELETE, `exercises/${id}`);
      });
    }
  };

  const savePlantilla = (plt: CustomTemplate) => {
    const cleanPlt = sanitizeForFirestore(plt);
    setMisPlantillas(prev => {
      const idx = prev.findIndex(p => p.id === cleanPlt.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = cleanPlt;
        return copy;
      }
      return [...prev, cleanPlt];
    });

    if (canWriteCloud()) {
      setDoc(doc(db, 'plantillas', cleanPlt.id), cleanPlt).catch(err => {
        reportIssue(err, OperationType.WRITE, `plantillas/${cleanPlt.id}`);
      });
    }
  };

  const deletePlantilla = (id: string) => {
    setMisPlantillas(prev => prev.filter(p => p.id !== id));
    if (canWriteCloud()) {
      deleteDoc(doc(db, 'plantillas', id)).catch(err => {
        reportIssue(err, OperationType.DELETE, `plantillas/${id}`);
      });
    }
  };

  const savePuntoFoto = (cod: string, dataUrl: string) => {
    setPuntoFotos(prev => ({ ...prev, [cod]: dataUrl }));
    if (canWriteCloud()) {
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
    if (canWriteCloud()) {
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
    syncError,
    dismissSyncError: () => setSyncError(null),
    authError,
    dismissAuthError: () => setAuthError(null),
    loginWithGoogle: handleLogin,
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
