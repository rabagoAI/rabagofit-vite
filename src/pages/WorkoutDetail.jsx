import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import { ArrowLeft, Calendar, Clock, Trophy, Dumbbell } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function WorkoutDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { workoutHistory } = useWorkout();

    const workout = useMemo(() => {
        return workoutHistory.find(w => w.id === parseInt(id) || w.id === id);
    }, [id, workoutHistory]);

    if (!workout) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Entrenamiento no encontrado</h2>
                <button
                    onClick={() => navigate('/workouts')}
                    className="text-emerald-500 hover:underline"
                >
                    Volver a Entrenamientos
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto pb-12">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver
            </button>

            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{workout.name}</h1>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(workout.endTime), "d MMMM, yyyy - HH:mm", { locale: es })}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {Math.floor(workout.durationSeconds / 60)} min {workout.durationSeconds % 60} s
                            </span>
                        </div>
                    </div>
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center font-bold text-xl">
                        {workout.name.charAt(0)}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <div className="text-center">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Volumen Total</span>
                        <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                            {(workout.exercises.reduce((acc, ex) =>
                                acc + ex.sets.reduce((sAcc, s) => sAcc + (s.weight * s.reps), 0)
                                , 0) / 1000).toFixed(1)} Ton
                        </p>
                    </div>
                    <div className="text-center">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ejercicios</span>
                        <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                            {workout.exercises.length}
                        </p>
                    </div>
                </div>
            </div>

            {/* Exercises List */}
            <div className="space-y-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white px-1">Resumen de Ejercicios</h3>

                {workout.exercises.map((exercise, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="bg-gray-50 dark:bg-gray-700/30 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                            <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
                                    {idx + 1}
                                </div>
                                {exercise.name}
                            </h4>
                        </div>
                        <div className="p-4">
                            <div className="grid grid-cols-3 gap-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center mb-2">
                                <div>Set</div>
                                <div>kg</div>
                                <div>Reps</div>
                            </div>
                            {exercise.sets.map((set, sIdx) => (
                                <div key={sIdx} className="grid grid-cols-3 gap-4 py-2 border-b last:border-0 border-gray-100 dark:border-gray-700/50 text-sm">
                                    <div className="text-center font-medium text-gray-500">{sIdx + 1}</div>
                                    <div className="text-center font-bold text-gray-900 dark:text-gray-300">{set.weight}</div>
                                    <div className="text-center font-bold text-gray-900 dark:text-gray-300">{set.reps}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
