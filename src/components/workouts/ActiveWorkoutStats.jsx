import React, { useMemo } from 'react';
import { useWorkout } from '../../context/WorkoutContext';
import { Activity, BarChart2, TrendingUp, Clock, Scale } from 'lucide-react';

export default function ActiveWorkoutStats({ activeWorkout }) {
    const { workoutHistory, timer } = useWorkout();

    const stats = useMemo(() => {
        if (!activeWorkout) return null;

        // 1. Current Volume
        const currentVolume = activeWorkout.exercises.reduce((total, ex) => {
            return total + ex.sets.reduce((exTotal, set) => {
                // Only count completed sets or all? Usually performed volume.
                // Assuming completed sets for accuracy, or all for "planned"
                // Let's go with effective volume (completed)
                if (!set.completed) return exTotal;
                return exTotal + (set.weight * set.reps);
            }, 0);
        }, 0);

        // 2. Previous Workout Volume (Same routine name)
        const previousWorkout = workoutHistory
            .filter(w => w.name === activeWorkout.name && w.finished)
            .sort((a, b) => new Date(b.endTime) - new Date(a.endTime))[0];

        const previousVolume = previousWorkout
            ? previousWorkout.exercises.reduce((total, ex) => {
                return total + ex.sets.reduce((exTotal, set) => {
                    return exTotal + (set.weight * set.reps);
                }, 0);
            }, 0)
            : 0;

        // 3. Volume Breakdown by Muscle (from exercise data which is embedded or found via ID)
        // Since we might not have muscle data directly in activeWorkout.exercises if it's minimal, 
        // we rely on what's there. The `addExercise` adds full object, so we should have `muscle`.
        const volumeByMuscle = activeWorkout.exercises.reduce((acc, ex) => {
            if (!ex.sets.some(s => s.completed)) return acc;
            const muscle = ex.muscle || 'other';
            const vol = ex.sets.filter(s => s.completed).reduce((sAcc, s) => sAcc + (s.weight * s.reps), 0);
            acc[muscle] = (acc[muscle] || 0) + vol;
            return acc;
        }, {});

        // 4. Intensity (Avg Weight lifted)
        const totalReps = activeWorkout.exercises.reduce((acc, ex) =>
            acc + ex.sets.filter(s => s.completed).reduce((sAcc, s) => sAcc + s.reps, 0), 0);

        const avgIntensity = totalReps > 0 ? Math.round(currentVolume / totalReps) : 0;

        return {
            currentVolume,
            previousVolume,
            volumeByMuscle,
            avgIntensity,
            hasPrevious: !!previousWorkout
        };
    }, [activeWorkout, workoutHistory]);

    if (!stats) return null;

    const volumeDiff = stats.hasPrevious
        ? stats.currentVolume - stats.previousVolume
        : 0;
    const volumeDiffPercent = stats.hasPrevious && stats.previousVolume > 0
        ? Math.round((volumeDiff / stats.previousVolume) * 100)
        : 0;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm mb-6">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Métricas en Tiempo Real
            </h3>

            <div className="grid grid-cols-2 gap-4">
                {/* Volume Card */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                        <Scale className="w-3 h-3" /> Volumen Total
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {stats.currentVolume.toLocaleString()} <span className="text-xs font-normal text-gray-400">kg</span>
                    </div>
                    {stats.hasPrevious && (
                        <div className={`text-xs font-medium mt-1 ${volumeDiff >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {volumeDiff >= 0 ? '+' : ''}{volumeDiff.toLocaleString()} kg ({volumeDiff >= 0 ? '+' : ''}{volumeDiffPercent}%)
                        </div>
                    )}
                </div>

                {/* Intensity Card */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> Intensidad Prom.
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {stats.avgIntensity} <span className="text-xs font-normal text-gray-400">kg/rep</span>
                    </div>
                    {/* Placeholder for timer based efficiency if needed later */}
                    <div className="text-xs text-gray-400 mt-1">
                        Eficiencia: No calc.
                    </div>
                </div>
            </div>

            {/* Muscle Breakdown - Simple Bar */}
            {Object.keys(stats.volumeByMuscle).length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="text-xs text-gray-400 mb-2">Por Músculo (Volumen)</div>
                    <div className="space-y-2">
                        {Object.entries(stats.volumeByMuscle).sort((a, b) => b[1] - a[1]).map(([muscle, vol]) => (
                            <div key={muscle} className="flex items-center gap-2 text-xs">
                                <div className="w-16 capitalize text-gray-600 dark:text-gray-300 truncate">{muscle}</div>
                                <div className="flex-1 bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{ width: `${(vol / stats.currentVolume) * 100}%` }}
                                    />
                                </div>
                                <div className="w-12 text-right text-gray-500">{Math.round((vol / stats.currentVolume) * 100)}%</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
