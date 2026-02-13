import React from 'react';
import { createPortal } from 'react-dom';
import { X, Dumbbell, Activity, Shield, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExerciseCompareModal({ isOpen, selectedExercises, onClose, onRemove }) {
    // If not visible, return null (handled by caller usually, but safe here)
    // Note: AnimatePresence requires the component to be mounted to animate exit,
    // so we usually pass `isOpen` or handle conditional rendering in parent.
    // Here we'll stick to parent rendering, but portal needs to exist.

    if (typeof document === 'undefined') return null;

    const muscleTranslations = {
        chest: 'Pecho',
        back: 'Espalda',
        legs: 'Pierna',
        shoulders: 'Hombro',
        arms: 'Brazos',
        core: 'Core',
        cardio: 'Cardio'
    };

    return createPortal(
        <AnimatePresence mode="wait">
            {isOpen && selectedExercises && selectedExercises.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-5xl h-[80vh] flex flex-col shadow-2xl overflow-hidden relative"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800 shrink-0">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <Activity className="w-6 h-6 text-emerald-500" />
                                Comparar Ejercicios
                            </h2>
                            <button
                                onClick={(e) => { e.stopPropagation(); onClose(); }}
                                className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group cursor-pointer z-50"
                                aria-label="Cerrar modal"
                            >
                                <X className="w-5 h-5 text-gray-500 group-hover:text-red-500 transition-colors" />
                            </button>
                        </div>

                        {/* Comparison Grid */}
                        <div className="flex-1 overflow-x-auto overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                            <div className="flex gap-4 min-w-max">
                                {/* Attribute Labels Column */}
                                <div className="w-40 flex flex-col pt-64 gap-4 text-sm font-bold text-gray-500 dark:text-gray-400 shrink-0 sticky left-0 bg-white dark:bg-gray-900 z-20">
                                    <div className="h-10 flex items-center">Dificultad</div>
                                    <div className="h-10 flex items-center">Músculo</div>
                                    <div className="h-10 flex items-center">Equipamiento</div>
                                    <div className="h-10 flex items-center">Popularidad</div>
                                    <div className="h-24 flex items-center">Músculos Sec.</div>
                                    <div className="h-24 flex items-center">Descripción</div>
                                </div>

                                {/* Exercise Columns */}
                                {selectedExercises.map((ex) => (
                                    <div key={ex.id} className="w-72 flex flex-col gap-4 relative shrink-0">
                                        <button
                                            onClick={() => onRemove(ex.id)}
                                            className="absolute top-2 right-2 p-1 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full hover:bg-red-200 transition-colors z-10 cursor-pointer"
                                            title="Quitar"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>

                                        {/* Image & Title */}
                                        <div className="h-64 rounded-2xl overflow-hidden relative group">
                                            {ex.image ? (
                                                <img src={ex.image} alt={ex.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                                    <Dumbbell className="w-12 h-12 text-gray-400" />
                                                </div>
                                            )}
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                                <h3 className="text-lg font-bold text-white leading-tight">{ex.name}</h3>
                                            </div>
                                        </div>

                                        {/* Attributes */}
                                        <div className="h-10 flex items-center">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${ex.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                                ex.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {ex.difficulty === 'easy' ? 'Fácil' : ex.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                                            </span>
                                        </div>
                                        <div className="h-10 flex items-center text-gray-700 dark:text-gray-300 font-medium capitalize">
                                            {muscleTranslations[ex.muscle] || ex.muscle}
                                        </div>
                                        <div className="h-10 flex items-center text-gray-700 dark:text-gray-300 capitalize">
                                            {ex.equipment || 'Ninguno'}
                                        </div>
                                        <div className="h-10 flex items-center">
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-emerald-500 rounded-full"
                                                    style={{ width: `${ex.popularity || 50}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="h-24 flex items-start text-sm text-gray-600 dark:text-gray-400 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                                            {ex.secondaryMuscles || 'N/A'}
                                        </div>
                                        <div className="h-24 flex items-start text-sm text-gray-600 dark:text-gray-400 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                                            {ex.description}
                                        </div>
                                    </div>
                                ))}

                                {/* Add Placeholder if less than 3 */}
                                {selectedExercises.length < 3 && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onClose(); }}
                                        className="w-72 flex flex-col items-center justify-center h-full border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl text-gray-400 gap-4 min-h-[600px] hover:border-emerald-500 hover:text-emerald-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all cursor-pointer group shrink-0"
                                    >
                                        <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 transition-colors">
                                            <Dumbbell className="w-8 h-8 opacity-50 group-hover:opacity-100 text-current" />
                                        </div>
                                        <p className="text-sm font-medium text-center">
                                            <span className="text-emerald-500 font-bold">Añadir Ejercicio (+)</span><br />
                                            Selecciona de la lista
                                        </p>
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
