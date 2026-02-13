import { useState, useEffect } from 'react';
import { WorkoutSchema } from '../schemas/workoutSchemas';
import { z } from 'zod';

export function useWorkoutHistory() {
    const [history, setHistory] = useState(() => {
        try {
            const stored = JSON.parse(localStorage.getItem('rabago_workouts_history'));
            if (!stored || !Array.isArray(stored)) return [];

            // Validate loaded history (filter out corrupt entries if critical)
            // For now, we just map and try to parse, or keep valid ones
            const validWorkouts = stored.filter(w => {
                const result = WorkoutSchema.safeParse(w);
                return result.success;
            });

            if (validWorkouts.length < stored.length) {
                console.warn(`Removed ${stored.length - validWorkouts.length} invalid workouts from history during load.`);
            }

            return validWorkouts.length > 0 ? validWorkouts : getSeedData();
        } catch (e) {
            console.error("Error loading history", e);
            return getSeedData();
        }
    });

    useEffect(() => {
        localStorage.setItem('rabago_workouts_history', JSON.stringify(history));
    }, [history]);

    const saveWorkout = (workout) => {
        const result = WorkoutSchema.safeParse(workout);
        if (!result.success) {
            console.error("Cannot save invalid workout:", result.error);
            alert("Error al guardar: Datos corruptos. Revisa la consola.");
            return;
        }

        const validWorkout = result.data;

        // Prevent duplicates (simple ID check)
        setHistory(prev => {
            if (prev.some(w => w.id === validWorkout.id)) {
                return prev.map(w => w.id === validWorkout.id ? validWorkout : w);
            }
            return [validWorkout, ...prev];
        });
    };

    const deleteWorkout = (id) => {
        setHistory(prev => prev.filter(w => w.id !== id));
    };

    const clearHistory = () => {
        if (confirm("¿Borrar todo el historial?")) {
            setHistory([]);
        }
    };

    return {
        history,
        saveWorkout,
        deleteWorkout,
        clearHistory
    };
}

// Helper for seed data (moved from WorkoutContext)
function getSeedData() {
    return [
        {
            id: Date.now() - 500000000,
            name: "Pierna Hipertrofia",
            startTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
            endTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
            durationSeconds: 3600,
            finished: true,
            exercises: [
                { name: "Sentadilla", sets: [{ weight: 100, reps: 5, completed: true }, { weight: 100, reps: 5, completed: true }] },
                { name: "Prensa", sets: [{ weight: 200, reps: 10, completed: true }, { weight: 200, reps: 10, completed: true }] }
            ]
        },
        // ... (can add more seed data if needed, keeping it minimal for now)
    ];
}
