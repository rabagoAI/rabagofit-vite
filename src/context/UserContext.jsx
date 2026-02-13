import React, { createContext, useContext, useState, useEffect } from 'react';
import { z } from 'zod';

const UserContext = createContext();

// --- Zod Schemas ---
const BodyStatSchema = z.object({
    date: z.string(), // ISO string
    weight: z.number().optional(),
    bodyFat: z.number().optional(),
    muscleMass: z.number().optional()
});

const UserProfileSchema = z.object({
    name: z.string(),
    email: z.string().email().optional(),
    height: z.number().optional(),
    gender: z.enum(['male', 'female', 'other']).optional(),
    birthDate: z.string().optional(),
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    onboardingCompleted: z.boolean().default(false),
    createdAt: z.string().default(() => new Date().toISOString())
});

const FullUserDataSchema = z.object({
    profile: UserProfileSchema,
    bodyStats: z.array(BodyStatSchema),
    version: z.number()
});

export function UserProvider({ children }) {
    // --- State ---
    const [userProfile, setUserProfile] = useState(() => {
        try {
            const saved = localStorage.getItem('rabago_user_profile');
            const parsed = saved ? JSON.parse(saved) : { name: 'Campeón' };
            // Auto-migrate/validate on load
            const result = UserProfileSchema.safeParse(parsed);
            return result.success ? result.data : { ...parsed, ...UserProfileSchema.parse({ name: parsed.name || 'User' }) };
        } catch {
            return UserProfileSchema.parse({ name: 'Campeón' });
        }
    });

    const [bodyStats, setBodyStats] = useState(() => {
        try {
            const saved = localStorage.getItem('rabago_body_stats');
            const parsed = saved ? JSON.parse(saved) : [];
            const result = z.array(BodyStatSchema).safeParse(parsed);
            return result.success ? result.data : [];
        } catch {
            return [];
        }
    });

    const [cloudSyncStatus, setCloudSyncStatus] = useState('idle'); // 'idle', 'syncing', 'error', 'success'

    // --- Persistence ---
    useEffect(() => {
        localStorage.setItem('rabago_user_profile', JSON.stringify(userProfile));
    }, [userProfile]);

    useEffect(() => {
        localStorage.setItem('rabago_body_stats', JSON.stringify(bodyStats));
    }, [bodyStats]);

    // --- Actions ---

    const updateProfile = (data) => {
        // Validate partial update
        const updated = { ...userProfile, ...data };
        const result = UserProfileSchema.safeParse(updated);

        if (result.success) {
            setUserProfile(result.data);
        } else {
            console.error("Profile validation failed", result.error);
            // Optionally set valid part or throw error
            setUserProfile(updated); // Allow for now but log error
        }
    };

    const addBodyStat = (stat) => {
        const result = BodyStatSchema.safeParse(stat);
        if (result.success) {
            setBodyStats(prev => [...prev, result.data].sort((a, b) => new Date(a.date) - new Date(b.date)));
        } else {
            console.error("Body stat validation failed", result.error);
        }
    };

    // --- Routines Management ---
    const [myRoutines, setMyRoutines] = useState(() => {
        try {
            const saved = localStorage.getItem('rabago_my_routines');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('rabago_my_routines', JSON.stringify(myRoutines));
    }, [myRoutines]);

    const saveRoutine = (routine) => {
        setMyRoutines(prev => {
            const index = prev.findIndex(r => r.id === routine.id);
            if (index >= 0) {
                // Update
                const newRoutines = [...prev];
                newRoutines[index] = routine;
                return newRoutines;
            } else {
                // Add
                return [...prev, routine];
            }
        });
    };

    const deleteRoutine = (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta rutina?')) {
            setMyRoutines(prev => prev.filter(r => r.id !== id));
        }
    };

    const getLatestStat = () => {
        if (bodyStats.length === 0) return null;
        return bodyStats[bodyStats.length - 1];
    };

    // --- Data Management Tools ---

    const exportUserData = () => {
        const fullData = {
            profile: userProfile,
            bodyStats: bodyStats,
            // Could include workoutHistory here too if provided/fetched
            version: 1,
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rabago_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const importUserData = async (file) => {
        try {
            const text = await file.text();
            const json = JSON.parse(text);

            // Validate structure
            const result = FullUserDataSchema.safeParse(json);

            if (!result.success) {
                // Try looser validation or partial import
                alert('Archivo de backup inválido o corrupto.');
                console.error(result.error);
                return false;
            }

            const { profile, bodyStats: stats } = result.data;
            if (confirm(`¿Restaurar backup de ${profile.name}? Esto sobrescribirá tus datos actuales.`)) {
                setUserProfile(profile);
                setBodyStats(stats);
                return true;
            }
        } catch (e) {
            console.error(e);
            alert('Error al leer el archivo.');
            console.error(result.error);
            return false;
        }
    };

    // --- Dashboard & Gamification ---
    const DEFAULT_LAYOUT = ['stats', 'featured_workout', 'consistency', 'quick_actions', 'achievements', 'recommendations'];

    const [dashboardConfig, setDashboardConfig] = useState(() => {
        try {
            const saved = localStorage.getItem('rabago_dashboard_config');
            return saved ? JSON.parse(saved) : { layout: DEFAULT_LAYOUT, hidden: [] };
        } catch {
            return { layout: DEFAULT_LAYOUT, hidden: [] };
        }
    });

    const [achievements, setAchievements] = useState(() => {
        try {
            const saved = localStorage.getItem('rabago_achievements');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('rabago_dashboard_config', JSON.stringify(dashboardConfig));
    }, [dashboardConfig]);

    useEffect(() => {
        localStorage.setItem('rabago_achievements', JSON.stringify(achievements));
    }, [achievements]);

    const updateDashboardConfig = (newConfig) => {
        setDashboardConfig(prev => ({ ...prev, ...newConfig }));
    };

    const checkAchievements = (history) => {
        const newUnlocked = [];
        const currentIds = new Set(achievements.map(a => a.id));

        // 1. First Workout
        if (history.length > 0 && !currentIds.has('first_workout')) {
            newUnlocked.push({ id: 'first_workout', name: 'Primer Paso', desc: 'Completaste tu primer entrenamiento', icon: 'Trophy', date: new Date().toISOString() });
        }

        // 2. Consistency (3 workouts)
        if (history.length >= 3 && !currentIds.has('consistency_starter')) {
            newUnlocked.push({ id: 'consistency_starter', name: 'Constante', desc: 'Completaste 3 entrenamientos', icon: 'Flame', date: new Date().toISOString() });
        }

        // 3. Volume Master (Total volume > 10000kg)
        // Simplified check just for demo
        const totalVolume = history.reduce((acc, w) => acc + (w.volume || 0), 0); // Assuming volume is saved on workout
        if (totalVolume > 10000 && !currentIds.has('volume_master')) {
            newUnlocked.push({ id: 'volume_master', name: 'Levantador Pesado', desc: 'Acumulaste 10,000kg de volumen', icon: 'Dumbbell', date: new Date().toISOString() });
        }

        if (newUnlocked.length > 0) {
            setAchievements(prev => [...prev, ...newUnlocked]);
            // alert(`¡Logro Desbloqueado: ${newUnlocked[0].name}!`); // Could trigger a toast here
        }
    };

    const resetUserData = () => {
        if (confirm('PELIGRO: ¿Estás seguro de que quieres borrar TODOS tus datos locales? Esta acción no se puede deshacer.')) {
            localStorage.clear();
            setUserProfile(UserProfileSchema.parse({ name: 'Nuevo Usuario' }));
            setBodyStats([]);
            window.location.reload();
        }
    };

    const clearBodyStats = () => {
        if (confirm('¿Estás seguro de que quieres borrar todas tus estadísticas de peso? Esta acción no se puede deshacer.')) {
            setBodyStats([]);
        }
    };

    const syncToCloud = async () => {
        // Mock implementation
        setCloudSyncStatus('syncing');
        setTimeout(() => {
            if (Math.random() > 0.2) {
                setCloudSyncStatus('success');
                setTimeout(() => setCloudSyncStatus('idle'), 3000);
            } else {
                setCloudSyncStatus('error');
            }
        }, 1500);
    };

    return (
        <UserContext.Provider value={{
            userProfile,
            updateProfile,
            bodyStats,
            addBodyStat,
            getLatestStat,
            clearBodyStats,
            // Tools
            exportUserData,
            importUserData,
            resetUserData,
            // Cloud
            syncToCloud,
            cloudSyncStatus,
            // Routines
            myRoutines,
            saveRoutine,
            deleteRoutine,
            // Dashboard & Gamification
            dashboardConfig,
            updateDashboardConfig,
            achievements,
            checkAchievements
        }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);
