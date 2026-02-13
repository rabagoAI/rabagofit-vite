import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Activity, AlertCircle, Layers, Dumbbell, Youtube } from 'lucide-react';

export default function ExerciseDetailModal({ exercise, onClose, onAddToWorkout }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const modalRef = useRef(null);

    // Reset video state when exercise changes
    useEffect(() => {
        setIsPlaying(false);
    }, [exercise]);

    // Handle Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (exercise) {
            window.addEventListener('keydown', handleKeyDown);
            // Focus modal for accessibility
            modalRef.current?.focus();
        }

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [exercise, onClose]);

    if (!exercise) return null;

    const videoUrl = exercise.video
        ? `https://www.youtube.com/embed/${exercise.video}?autoplay=1`
        : null;

    // Generar thumbnail de alta calidad si es posible
    const thumbnailUrl = exercise.video
        ? `https://img.youtube.com/vi/${exercise.video}/maxresdefault.jpg`
        : null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            ></div>

            <div
                ref={modalRef}
                tabIndex="-1"
                className="relative bg-white dark:bg-gray-800 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200 flex flex-col lg:flex-row focus:outline-none"
            >

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors focus:ring-2 focus:ring-white"
                    aria-label="Cerrar modal"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Left Side: Media & Title */}
                <div className="w-full lg:w-5/12 bg-gray-100 dark:bg-gray-900 flex flex-col justify-center bg-black">
                    <div className={`${exercise.isShort ? 'aspect-[9/16] max-h-[600px] w-auto mx-auto' : 'aspect-video w-full'} bg-black relative flex items-center justify-center group overflow-hidden shadow-2xl`}>
                        {videoUrl ? (
                            isPlaying ? (
                                <iframe
                                    src={videoUrl}
                                    title={exercise.name}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <button
                                    onClick={() => setIsPlaying(true)}
                                    className="w-full h-full relative group cursor-pointer"
                                    aria-label="Reproducir video"
                                >
                                    <img
                                        src={thumbnailUrl}
                                        alt={`Miniatura de ${exercise.name}`}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                                        onError={(e) => {
                                            e.target.style.display = 'none'; // Fallback si no hay maxres
                                        }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/40 group-hover:scale-110 transition-transform">
                                            <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded text-xs font-medium backdrop-blur-sm">
                                        Click para reproducir
                                    </div>
                                </button>
                            )
                        ) : (
                            <div className="text-center p-4">
                                <Youtube className="w-16 h-16 text-gray-500 mx-auto mb-2 opacity-50" />
                                <p className="text-gray-500 text-sm">Video no disponible</p>
                            </div>
                        )}
                    </div>

                    <div className="p-6 md:p-8 flex-grow flex flex-col justify-center bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                        <div className="mb-6">
                            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-3 border border-emerald-500/20">
                                {exercise.muscle}
                            </span>
                            <h2 id="modal-title" className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                                {exercise.name}
                            </h2>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
                                <Activity className="w-4 h-4 mr-2 text-blue-500" />
                                <span className="capitalize font-medium">{exercise.difficulty === 'medium' ? 'Intermedio' : exercise.difficulty === 'hard' ? 'Avanzado' : 'Principiante'}</span>
                            </div>
                            <div className="flex items-center px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
                                <Dumbbell className="w-4 h-4 mr-2 text-purple-500" />
                                <span className="capitalize font-medium">{exercise.equipment === 'bodyweight' ? 'Peso corporal' : exercise.equipment}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Details */}
                <div className="w-full lg:w-7/12 p-6 md:p-8 flex flex-col bg-white dark:bg-gray-800">
                    <div className="space-y-8 flex-grow">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                                <Play className="w-5 h-5 mr-2 text-emerald-500" />
                                Instrucciones
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                                {exercise.description}
                            </p>
                        </div>

                        {exercise.safety && (
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded-2xl border border-orange-100 dark:border-orange-800/30">
                                <h3 className="text-sm font-bold text-orange-700 dark:text-orange-400 mb-2 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-2" />
                                    Tips de Seguridad
                                </h3>
                                <p className="text-sm text-orange-800 dark:text-orange-300 leading-relaxed">
                                    {exercise.safety}
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700/50">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                                    <Layers className="w-4 h-4 mr-2 text-gray-400" />
                                    Músculos Secundarios
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {exercise.secondaryMuscles || 'Ninguno'}
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700/50">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center">
                                    <Activity className="w-4 h-4 mr-2 text-gray-400" />
                                    Variaciones
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {exercise.variations || 'No hay variaciones registradas'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800 pb-2">
                        {onAddToWorkout && (
                            <button
                                onClick={() => onAddToWorkout(exercise)}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transform active:scale-95 focus:ring-4 focus:ring-emerald-500/30"
                            >
                                <Play className="w-5 h-5" fill="currentColor" />
                                Añadir a mi Rutina
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
