import { useState, useEffect, useCallback, useRef } from 'react';
import { WorkoutSchema } from '../schemas/workoutSchemas';

export function useActiveWorkout(timer) {
    // --- State ---
    const [activeWorkout, setActiveWorkout] = useState(null);
    const [past, setPast] = useState([]);   // Undo stack
    const [future, setFuture] = useState([]); // Redo stack

    // --- Persistence ---
    useEffect(() => {
        const saved = localStorage.getItem('rabago_active_workout');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Validate structure roughly or use schema if strict
                setActiveWorkout(parsed);
                // We don't verify schema strictly on load to avoid blocking user if schema changed slightly,
                // but ideally we should migrate.
                if (parsed.currentTimer) {
                    // Logic to restore timer would be here or in context
                    // For now, context handles timer restoration mostly
                }
            } catch (e) {
                console.error("Error loading active workout", e);
            }
        }
    }, []);

    useEffect(() => {
        if (activeWorkout) {
            localStorage.setItem('rabago_active_workout', JSON.stringify({
                ...activeWorkout,
                currentTimer: timer.seconds // We save timer ref here for persistence sake
            }));
        } else {
            localStorage.removeItem('rabago_active_workout');
        }
    }, [activeWorkout, timer.seconds]);

    // --- Actions ---

    // Internal helper to update state with history
    const _update = useCallback((newWorkoutState, addToHistory = true) => {
        if (addToHistory && activeWorkout) {
            setPast(prev => [...prev, activeWorkout]);
            setFuture([]); // Clear redo stack on new change
        }
        setActiveWorkout(newWorkoutState);
    }, [activeWorkout]);

    const start = (name, exercises = []) => {
        const newWorkout = {
            id: Date.now(),
            name,
            startTime: new Date().toISOString(),
            exercises: exercises.map(ex => ({
                ...ex,
                id: ex.id || Date.now() + Math.random(),
                sets: ex.sets || [{ id: 1, weight: 0, reps: 0, completed: false }]
            })),
            finished: false
        };
        setActiveWorkout(newWorkout);
        setPast([]);
        setFuture([]);
        timer.reset();
        timer.start();
    };

    const undo = () => {
        if (past.length === 0) return;
        const previous = past[past.length - 1];
        const newPast = past.slice(0, -1);

        setFuture(prev => [activeWorkout, ...prev]);
        setActiveWorkout(previous);
        setPast(newPast);
    };

    const redo = () => {
        if (future.length === 0) return;
        const next = future[0];
        const newFuture = future.slice(1);

        setPast(prev => [...prev, activeWorkout]);
        setActiveWorkout(next);
        setFuture(newFuture);
    };

    // Specific updaters (using _update for history)

    const addExercise = (exercise) => {
        if (!activeWorkout) return;
        const newEx = {
            ...exercise,
            id: Date.now(),
            sets: [{ id: 1, weight: 0, reps: 0, completed: false }]
        };
        _update({
            ...activeWorkout,
            exercises: [...activeWorkout.exercises, newEx]
        });
    };

    const removeExercise = (index) => {
        if (!activeWorkout) return;
        const newExercises = [...activeWorkout.exercises];
        newExercises.splice(index, 1);
        _update({ ...activeWorkout, exercises: newExercises });
    };

    const addSet = (exerciseIndex) => {
        if (!activeWorkout) return;
        const newExercises = structuredClone(activeWorkout.exercises);
        const exercise = newExercises[exerciseIndex];
        const previousSet = exercise.sets[exercise.sets.length - 1];

        exercise.sets.push({
            id: Date.now(),
            weight: previousSet ? previousSet.weight : 0,
            reps: previousSet ? previousSet.reps : 0,
            completed: false
        });

        _update({ ...activeWorkout, exercises: newExercises });
    };

    const removeSet = (exerciseIndex, setIndex) => {
        if (!activeWorkout) return;
        const newExercises = structuredClone(activeWorkout.exercises);
        newExercises[exerciseIndex].sets.splice(setIndex, 1);
        _update({ ...activeWorkout, exercises: newExercises });
    };

    const updateSet = (exerciseIndex, setIndex, field, value) => {
        if (!activeWorkout) return;
        // Optimization: Don't add to history for every keystroke on weight/reps
        // Only if 'completed' changes or if it's a distinct action?
        // For simplicity, we add history for everything now, but use debounce in UI if needed.
        // Actually, for text inputs, "Undo" is handled by browser usually.
        // Let's decide: 'completed' toggles -> History. 'weight' updates -> No History?
        // Better: History only on 'Blur' or infrequent updates. 
        // For now: Add history for EVERYTHING to be safe. User can undo typos.

        // Slight optimization: If value is same, ignore
        const currentSet = activeWorkout.exercises[exerciseIndex].sets[setIndex];
        if (currentSet[field] === value) return;

        const newExercises = structuredClone(activeWorkout.exercises);
        newExercises[exerciseIndex].sets[setIndex][field] = value;

        // If typing, maybe don't flood history? 
        // We'll pass a flag to _update if we want to skip history.
        // For now, allow history.
        _update({ ...activeWorkout, exercises: newExercises });
    };

    const finish = () => {
        if (!activeWorkout) return null;
        const finishedWorkout = {
            ...activeWorkout,
            endTime: new Date().toISOString(),
            durationSeconds: timer.seconds,
            finished: true
        };

        // Validate before returning
        const result = WorkoutSchema.safeParse(finishedWorkout);
        if (!result.success) {
            console.error("Validation error finalizing workout:", result.error);
            alert("Error de validación al finalizar. Revisa los datos.");
            return null;
        }

        setActiveWorkout(null);
        setPast([]);
        setFuture([]);
        timer.reset();
        return result.data;
    };

    const cancel = () => {
        setActiveWorkout(null);
        setPast([]);
        setFuture([]);
        timer.reset();
    };

    const updateMetadata = (field, value) => {
        if (!activeWorkout) return;
        _update({
            ...activeWorkout,
            [field]: value
        });
    };

    return {
        activeWorkout,
        start,
        finish,
        cancel,
        addExercise,
        removeExercise,
        addSet,
        removeSet,
        updateSet,
        updateMetadata,
        undo,
        redo,
        canUndo: past.length > 0,
        canRedo: future.length > 0
    };
}
