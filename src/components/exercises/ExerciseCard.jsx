import React, { useMemo } from 'react';
import { Heart, Activity, Trophy, History, Play } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';

export default function ExerciseCard({ exercise, isFavorite, onToggleFavorite, onOpenDetails }) {
    const { workoutHistory } = useWorkout();

    const stats = useMemo(() => {
        if (!workoutHistory || workoutHistory.length === 0) return null;

        let maxWeight = 0;
        let totalSets = 0;
        let lastPlayed = null;

        workoutHistory.forEach(workout => {
            const exData = workout.exercises.find(e => e.name === exercise.name);
            if (exData) {
                // Last played date
                const date = new Date(workout.endTime);
                if (!lastPlayed || date > lastPlayed) {
                    lastPlayed = date;
                }

                // Stats
                exData.sets.forEach(set => {
                    totalSets++;
                    if (set.weight > maxWeight) maxWeight = set.weight;
                });
            }
        });

        return {
            pr: maxWeight,
            sets: totalSets,
            lastPlayed: lastPlayed
        };
    }, [workoutHistory, exercise.name]);

    const difficultyColors = {
        easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
        medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400',
        hard: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
    };

    const difficultyLabel = {
        easy: 'Principiante',
        medium: 'Intermedio',
        hard: 'Avanzado'
    };

    const thumbnailUrl = exercise.video
        ? `https://img.youtube.com/vi/${exercise.video}/mqdefault.jpg`
        : null;

    return (
        <div
            onClick={() => onOpenDetails(exercise)}
            className="group bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
        >
            {/* Header / Image Area */}
            <div className="relative h-48 bg-gray-100 dark:bg-gray-900 overflow-hidden">
                {thumbnailUrl ? (
                    <img
                        src={thumbnailUrl}
                        alt={exercise.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                        <Activity className="w-12 h-12 text-gray-300" />
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(exercise.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border border-white/10 transition-all z-20 ${isFavorite
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                        : 'bg-black/30 text-white hover:bg-red-500 hover:text-white'
                        }`}
                    title="Guardar en favoritos"
                >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>

                <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${difficultyColors[exercise.difficulty]}`}>
                            {difficultyLabel[exercise.difficulty]}
                        </span>
                        {stats && stats.lastPlayed && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 backdrop-blur-sm">
                                Realizado recientemente
                            </span>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-white leading-tight drop-shadow-md group-hover:text-emerald-400 transition-colors">
                        {exercise.name}
                    </h3>
                </div>

                {/* Play Overlay on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300">
                        <Play className="w-6 h-6 ml-1" fill="currentColor" />
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-grow flex flex-col">
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {exercise.description}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700/50 grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                            <Trophy className="w-3 h-3 text-yellow-500" />
                            Mejor Peso
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white">
                            {stats && stats.pr > 0 ? `${stats.pr} kg` : '--'}
                        </span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                            <History className="w-3 h-3 text-blue-500" />
                            Total Series
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white">
                            {stats ? stats.sets : 0}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
