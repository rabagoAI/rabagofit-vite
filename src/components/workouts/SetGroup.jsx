import React, { useMemo } from 'react';
import { Trash2, Check, X, History, TrendingUp, Volume2 } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';

// Simple beep sound (Base64 MP3 - 0.1s beep)
const BEEP_SOUND = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//oeAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAFAAAAZQAJCQkJCQkJQUFBQUFBQUZmZmZmZmZmkwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABMYXZjNTguNTQuMTAwAAAAAAAAAAAA//oeBkAAACm7AAAACQAAAAA";

export default function SetGroup({ exercise, exerciseIndex, updateSet, addSet, removeSet, removeExercise }) {
    const { workoutHistory } = useWorkout();

    // Calculate Estimated 1RM (Epley Formula)
    const calculate1RM = (weight, reps) => {
        if (!weight || !reps) return 0;
        return Math.round(weight * (1 + reps / 30));
    };

    // Find Previous Session Data
    const previousSession = useMemo(() => {
        if (!workoutHistory || workoutHistory.length === 0) return null;

        // Find most recent workout containing this exercise
        const prev = workoutHistory
            .filter(w => w.name && w.exercises.some(e => e.name === exercise.name)) // Match by exercise name
            .sort((a, b) => new Date(b.endTime) - new Date(a.endTime))[0];

        if (!prev) return null;

        const prevExercise = prev.exercises.find(e => e.name === exercise.name);
        // Find best set (highest weight)
        const bestSet = prevExercise.sets.reduce((max, curr) =>
            curr.weight > max.weight ? curr : max
            , { weight: 0, reps: 0 });

        return {
            date: new Date(prev.endTime).toLocaleDateString(),
            bestSet
        };
    }, [workoutHistory, exercise.name]);

    const playSound = () => {
        try {
            const audio = new Audio(BEEP_SOUND);
            audio.volume = 0.5;
            audio.play().catch(() => { }); // Ignore auto-play blocks
        } catch (e) {
            console.error("Audio error", e);
        }
    };

    const handleComplete = (setIndex, currentValue) => {
        if (!currentValue) playSound(); // Only play sound when toggling ON
        updateSet(exerciseIndex, setIndex, 'completed', !currentValue);
    };

    return (
        <div className="mb-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm relative group overflow-hidden">
            {/* Header info */}
            <div className="flex flex-col mb-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate pr-4">{exercise.name}</h3>
                    <button
                        onClick={() => {
                            if (confirm('¿Eliminar ejercicio?')) removeExercise(exerciseIndex);
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
                        title="Eliminar ejercicio"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {previousSession && previousSession.bestSet.weight > 0 && (
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 w-fit px-3 py-1.5 rounded-lg animate-in fade-in slide-in-from-left-2">
                        <History className="w-3.5 h-3.5 text-blue-500" />
                        <span>Anterior ({previousSession.date}): <strong className="text-gray-900 dark:text-white">{previousSession.bestSet.weight}kg x {previousSession.bestSet.reps}</strong></span>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center mb-2 px-1">
                    <div className="w-8">#</div>
                    <div>KG</div>
                    <div>Reps</div>
                    <div className="w-12"><Check className="w-4 h-4 mx-auto" /></div>
                </div>

                {exercise.sets.map((set, setIndex) => {
                    const isCompleted = set.completed;
                    const oneRM = calculate1RM(set.weight, set.reps);

                    return (
                        <div key={setIndex} className={`relative transition-all duration-300 ${isCompleted ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                            <div className={`grid grid-cols-[auto_1fr_1fr_auto] gap-4 items-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-2 border ${isCompleted ? 'border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-transparent'}`}>
                                {/* Set Number */}
                                <div className="w-8 flex justify-center">
                                    <div className="w-6 h-6 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-400 shadow-sm border border-gray-100 dark:border-gray-600">
                                        {setIndex + 1}
                                    </div>
                                </div>

                                {/* Weight Input */}
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        value={set.weight || ''}
                                        onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', parseFloat(e.target.value))}
                                        className="w-full bg-white dark:bg-gray-900 border-2 border-transparent focus:border-emerald-500 rounded-xl py-3 text-center font-bold text-xl text-gray-900 dark:text-white shadow-sm focus:outline-none transition-all placeholder:text-gray-200 dark:placeholder:text-gray-700"
                                    />
                                    {oneRM > 0 && !isCompleted && (
                                        <div className="absolute -bottom-5 left-0 right-0 text-[10px] text-center text-gray-400 font-medium">
                                            1RM: {oneRM}
                                        </div>
                                    )}
                                </div>

                                {/* Reps Input */}
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        value={set.reps || ''}
                                        onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', parseFloat(e.target.value))}
                                        className="w-full bg-white dark:bg-gray-900 border-2 border-transparent focus:border-emerald-500 rounded-xl py-3 text-center font-bold text-xl text-gray-900 dark:text-white shadow-sm focus:outline-none transition-all placeholder:text-gray-200 dark:placeholder:text-gray-700"
                                    />
                                </div>

                                {/* Check Button */}
                                <div className="w-12 flex justify-center">
                                    <button
                                        onClick={() => handleComplete(setIndex, isCompleted)}
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-sm active:scale-90 ${isCompleted
                                            ? 'bg-emerald-500 text-white shadow-emerald-500/30 ring-2 ring-emerald-500 ring-offset-2 ring-offset-white dark:ring-offset-gray-900'
                                            : 'bg-white dark:bg-gray-700 text-gray-300 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-gray-600'
                                            }`}
                                    >
                                        <Check className={`w-6 h-6 ${isCompleted ? 'stroke-[3]' : ''}`} />
                                    </button>
                                </div>
                            </div>

                            {/* Delete Set Button (Contextual, visible on hover only on desktop, always visible if needed on mobile via swipe but kept simple here) */}
                            {exercise.sets.length > 1 && !isCompleted && (
                                <button
                                    onClick={() => removeSet(exerciseIndex, setIndex)}
                                    className="absolute -right-3 top-1/2 -translate-y-1/2 p-1.5 bg-white dark:bg-gray-800 text-red-400 rounded-full shadow-sm border border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all z-10 hidden sm:block"
                                    title="Borrar serie"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            <button
                onClick={() => addSet(exerciseIndex)}
                className="w-full mt-6 py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-400 hover:text-emerald-500 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-all flex items-center justify-center gap-2"
            >
                <TrendingUp className="w-4 h-4" /> Agregar Serie
            </button>
        </div>
    );
}

function PlusIcon({ className }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
    )
}
