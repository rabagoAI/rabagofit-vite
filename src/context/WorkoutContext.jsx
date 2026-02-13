import React, { createContext, useContext, useEffect } from 'react';
import { useTimer } from '../hooks/useTimer';
import { useWorkoutHistory } from '../hooks/useWorkoutHistory';
import { useActiveWorkout } from '../hooks/useActiveWorkout';

const WorkoutContext = createContext();

export function WorkoutProvider({ children }) {
    const timer = useTimer();
    const historyManager = useWorkoutHistory();
    const activeSession = useActiveWorkout(timer);

    // Sync Timer persistence (optional, if useActiveWorkout doesn't fully cover it)
    useEffect(() => {
        const saved = localStorage.getItem('rabago_active_workout');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.currentTimer && timer.seconds === 0) {
                    // Check if this restore logic conflicts with useActiveWorkout's simple timer handling
                    // It's safer to let ActiveView handle mounting logic or just rely on 'currentTimer' prop
                    // But we want the timer hook to actually update.
                    // The useActiveWorkout hook assumes timer is passed in.
                    // We can restore it here:
                    // timer.setSeconds(parsed.currentTimer); // If useTimer had setSeconds exposed...
                    // For now simple reset is handled by start()
                }
            } catch { }
        }
    }, []);

    // Bridge functions (Adapting old API to new Hooks)
    const finishWorkout = () => {
        const result = activeSession.finish();
        if (result) {
            historyManager.saveWorkout(result);
        }
    };

    return (
        <WorkoutContext.Provider value={{
            // Active Session State & Actions
            activeWorkout: activeSession.activeWorkout,
            startWorkout: activeSession.start,
            cancelWorkout: activeSession.cancel,
            finishWorkout, // Bridged

            // Editor Actions
            addExercise: activeSession.addExercise,
            removeExercise: activeSession.removeExercise,
            addSet: activeSession.addSet,
            removeSet: activeSession.removeSet,
            updateSet: activeSession.updateSet,
            updateMetadata: activeSession.updateMetadata,

            // Undo / Redo
            undo: activeSession.undo,
            redo: activeSession.redo,
            canUndo: activeSession.canUndo,
            canRedo: activeSession.canRedo,

            // History
            workoutHistory: historyManager.history,
            deleteWorkout: historyManager.deleteWorkout,
            clearHistory: historyManager.clearHistory,

            // Timer
            timer
        }}>
            {children}
        </WorkoutContext.Provider>
    );
}

export const useWorkout = () => useContext(WorkoutContext);
