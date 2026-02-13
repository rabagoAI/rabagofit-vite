import React, { useState, useEffect, useMemo } from 'react';
import { useWorkout } from '../../context/WorkoutContext';
import {
    Clock, Plus, Save, Play, Pause, StopCircle,
    ChevronLeft, AlertTriangle, X, RotateCcw, RotateCw, Share2
} from 'lucide-react';
import SetGroup from './SetGroup';
import ActiveWorkoutStats from './ActiveWorkoutStats';
import WorkoutNotes from './WorkoutNotes';
import { exercises as exercisesData } from '../../data/exercises';
import { useNavigate } from 'react-router-dom';

export default function ActiveWorkoutView() {
    const {
        activeWorkout, timer, finishWorkout, cancelWorkout,
        updateSet, addSet, removeSet, addExercise, removeExercise,
        undo, redo, canUndo, canRedo
    } = useWorkout();

    const [showAddExercise, setShowAddExercise] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const navigate = useNavigate();

    // --- Derived State for Progress ---
    const progress = useMemo(() => {
        if (!activeWorkout) return 0;
        const totalSets = activeWorkout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
        if (totalSets === 0) return 0;
        const completedSets = activeWorkout.exercises.reduce((acc, ex) =>
            acc + ex.sets.filter(s => s.completed).length, 0);
        return Math.round((completedSets / totalSets) * 100);
    }, [activeWorkout]);

    // Find first incomplete exercise to show as "Active" or define "Next"
    const currentExerciseIndex = activeWorkout?.exercises.findIndex(ex => ex.sets.some(s => !s.completed)) ?? 0;
    const nextExercise = activeWorkout?.exercises[currentExerciseIndex + 1] || null;

    // --- Safety & Shortcuts ---

    // 1. BeforeUnload Protection
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (activeWorkout) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [activeWorkout]);

    // 2. Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore if typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

            if (e.code === 'Space') {
                e.preventDefault();
                timer.isRunning ? timer.pause() : timer.start();
            }
            if (e.code === 'Escape') {
                e.preventDefault();
                setShowCancelConfirm(true); // Open custom modal
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [timer, activeWorkout]); // Added activeWorkout dependency indirectly via setShowCancelConfirm logic availability

    const handleAddExercise = (exerciseId) => {
        const ex = exercisesData.find(e => e.id === exerciseId);
        if (ex) {
            addExercise(ex);
            setShowAddExercise(false);
            setSearchTerm('');
        }
    };

    const filteredExercises = exercisesData.filter(e =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleFinish = () => {
        finishWorkout();
        navigate('/progress'); // Or summary page
    };

    const handleCancel = () => {
        cancelWorkout();
        setShowCancelConfirm(false);
        navigate('/');
    };

    const handleShare = async () => {
        if (!activeWorkout) return;
        const text = `🏋️‍♂️ ${activeWorkout.name}
⏱️ ${timer.formatTime(timer.seconds)}

${activeWorkout.exercises.map(ex =>
            `▪️ ${ex.name}: ${ex.sets.filter(s => s.completed).length} series`
        ).join('\n')}

Vía RabagoFit ⚡`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Mi Entrenamiento - RabagoFit',
                    text: text
                });
            } catch (err) {
                // Ignore aborts
            }
        } else {
            navigator.clipboard.writeText(text);
            alert('¡Copiado al portapapeles!');
        }
    };

    if (!activeWorkout) return null;

    return (
        <>
            <div className="max-w-3xl mx-auto pb-32">
                {/* Sticky Header with Timer & Progress */}
                <div className="sticky top-20 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 py-4 mb-8 -mx-6 px-6 shadow-sm transition-all duration-300">
                    <div className="flex items-center justify-between mb-3">
                        <div className="overflow-hidden flex-1">
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate pr-4">{activeWorkout.name}</h1>
                            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-pulse">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Guardado automático activo
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Undo/Redo Controls */}
                            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                                <button
                                    onClick={undo}
                                    disabled={!canUndo}
                                    className={`p-1.5 rounded-md transition-colors ${canUndo ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700' : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'}`}
                                    title="Deshacer"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                                <div className="w-px bg-gray-300 dark:bg-gray-700 mx-1 my-0.5" />
                                <button
                                    onClick={redo}
                                    disabled={!canRedo}
                                    className={`p-1.5 rounded-md transition-colors ${canRedo ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700' : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'}`}
                                    title="Rehacer"
                                >
                                    <RotateCw className="w-4 h-4" />
                                </button>
                            </div>

                            <button
                                onClick={handleShare}
                                className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                                title="Compartir entrenamiento"
                            >
                                <Share2 className="w-5 h-5" />
                            </button>

                            <div className="text-3xl font-mono font-bold text-emerald-500 tabular-nums tracking-tight">
                                {timer.formatTime(timer.seconds)}
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 mb-1 overflow-hidden">
                        <div
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
                        <span>{progress}% Completado</span>
                        <span>{activeWorkout.exercises.reduce((acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0)} / {activeWorkout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0)} Series</span>
                    </div>
                </div>

                {/* Exercise List */}
                <div className="space-y-6">
                    {/* New Stats Component */}
                    <ActiveWorkoutStats activeWorkout={activeWorkout} />

                    {activeWorkout.exercises.map((exercise, index) => (
                        <SetGroup
                            key={exercise.id}
                            exercise={exercise}
                            exerciseIndex={index}
                            updateSet={updateSet}
                            addSet={addSet}
                            removeSet={removeSet}
                            removeExercise={removeExercise}
                        />
                    ))}
                </div>

                {/* Notes Section */}
                <WorkoutNotes />

                {/* Add Exercise & Actions */}
                <div className="mt-8 space-y-4">
                    <button
                        onClick={() => setShowAddExercise(!showAddExercise)}
                        className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 hover:border-emerald-500 hover:text-emerald-500 transition-colors font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        Añadir Ejercicio
                    </button>

                    {showAddExercise && (
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 animate-in slide-in-from-top-4 duration-200">
                            <input
                                type="text"
                                placeholder="Buscar ejercicios..."
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-emerald-500 mb-3"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                            <div className="max-h-60 overflow-y-auto space-y-1">
                                {filteredExercises.map(ex => (
                                    <button
                                        key={ex.id}
                                        onClick={() => handleAddExercise(ex.id)}
                                        className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center justify-between group"
                                    >
                                        <span className="font-medium text-gray-900 dark:text-white">{ex.name}</span>
                                        <Plus className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <button
                            onClick={() => setShowCancelConfirm(true)}
                            className="py-3 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleFinish}
                            className="py-3 px-4 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30"
                        >
                            Finalizar
                        </button>
                    </div>
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            {
                showCancelConfirm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-gray-100 dark:border-gray-800 animate-scale-in">
                            <div className="flex justify-center mb-4">
                                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-red-500" />
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 text-center">¿Cancelar entrenamiento?</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-6">
                                Se perderá todo el progreso de la sesión actual. Esta acción no se puede deshacer.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowCancelConfirm(false)}
                                    className="flex-1 py-2.5 px-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Volver
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 py-2.5 px-4 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30"
                                >
                                    Sí, cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}

