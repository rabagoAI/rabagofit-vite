import React, { useState } from 'react';
import { useWorkout } from '../context/WorkoutContext';
import ActiveWorkoutView from '../components/workouts/ActiveWorkoutView';
import WorkoutHistoryList from '../components/workouts/WorkoutHistoryList';
import { routines } from '../data/routines';
import { Play, Dumbbell, Trash2 } from 'lucide-react';

export default function Workouts() {
    const { activeWorkout, startWorkout, clearHistory } = useWorkout();

    if (activeWorkout) {
        return <ActiveWorkoutView />;
    }

    // Pre-Start View
    return (
        <div>
            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Entrenamientos</h2>
                <p className="text-gray-500 dark:text-gray-400">Inicia una nueva sesión o continúa donde lo dejaste</p>
            </div>

            {/* Quick Start Card */}
            <section className="mb-12">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-2xl p-8 relative overflow-hidden text-white shadow-xl shadow-emerald-500/20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Entrenamiento Libre</h3>
                            <p className="text-emerald-100 max-w-md">Sin plan, solo tú y las pesas. Agrega ejercicios sobre la marcha y registra tus series.</p>
                        </div>
                        <button
                            onClick={() => startWorkout("Entrenamiento Libre")}
                            className="bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-4 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 group"
                        >
                            <Play className="w-5 h-5 fill-current" />
                            Comenzar Ahora
                        </button>
                    </div>
                </div>
            </section>

            {/* Templates Selection */}
            <section>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Iniciar desde Rutina</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {routines.map(routine => (
                        <div key={routine.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 card-hover group cursor-pointer"
                            onClick={() => startWorkout(routine.name)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 text-emerald-500 rounded-lg flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                    <Dumbbell className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold px-2 py-1 bg-gray-100 dark:bg-gray-700/50 rounded capitalize text-gray-500">{routine.goal}</span>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-emerald-500 transition-colors">{routine.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{routine.description}</p>
                            <div className="flex items-center text-xs text-gray-400 gap-4">
                                <span>{routine.duration}</span>
                                <span>•</span>
                                <span>{routine.days} días/sem</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Workout History */}
            <section className="mt-12 mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Historial Reciente</h3>
                    <button
                        onClick={() => clearHistory()}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 text-sm"
                    >
                        <Trash2 className="w-4 h-4" />
                        Resetear Historial
                    </button>
                </div>
                {activeWorkout ? (
                    <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                        <p className="text-gray-500">Termina tu entrenamiento actual para ver el historial.</p>
                    </div>
                ) : (
                    <WorkoutHistoryList />
                )}
            </section>
        </div>
    );
}
