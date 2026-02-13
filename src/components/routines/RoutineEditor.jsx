import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, GripVertical, Check } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { exercises as allExercises } from '../../data/exercises';

export default function RoutineEditor({ routineToEdit, onClose }) {
    const { saveRoutine } = useUser();

    // Form State
    const [name, setName] = useState(routineToEdit?.name || '');
    const [description, setDescription] = useState(routineToEdit?.description || '');
    const [days, setDays] = useState(routineToEdit?.days || 3);
    const [exercises, setExercises] = useState(routineToEdit?.exercises || []);

    // Exercise Selector State
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSave = (e) => {
        e.preventDefault();
        if (!name) return alert('El nombre es obligatorio');
        if (exercises.length === 0) return alert('Agrega al menos un ejercicio');

        const newRoutine = {
            id: routineToEdit?.id || Date.now(),
            name,
            description,
            days: parseInt(days),
            exercises,
            goal: routineToEdit?.goal || 'general', // Default or selector
            schedule: routineToEdit?.schedule || []
        };

        saveRoutine(newRoutine);
        onClose();
    };

    const addExercise = (exercise) => {
        setExercises(prev => [...prev, {
            ...exercise,
            sets: 3,
            reps: '10',
            rest: '60s' // Default values
        }]);
        setIsSelectorOpen(false);
        setSearchTerm('');
    };

    const removeExercise = (index) => {
        setExercises(prev => prev.filter((_, i) => i !== index));
    };

    const updateExercise = (index, field, value) => {
        setExercises(prev => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    // Simple drag-to-reorder logic could be added here, but for simplicity we rely on list order for now
    // Or rudimentary "move up/down" buttons if needed.

    const moveExercise = (index, direction) => {
        if (direction === 'up' && index > 0) {
            setExercises(prev => {
                const next = [...prev];
                [next[index], next[index - 1]] = [next[index - 1], next[index]];
                return next;
            });
        }
        if (direction === 'down' && index < exercises.length - 1) {
            setExercises(prev => {
                const next = [...prev];
                [next[index], next[index + 1]] = [next[index + 1], next[index]];
                return next;
            });
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-12 md:pt-20 p-2 md:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 w-full max-w-3xl max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden mx-2 md:mx-auto">

                {/* Header */}
                <div className="p-3 md:p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-white dark:bg-gray-900 z-10">
                    <h2 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                        {routineToEdit ? 'Editar Rutina' : 'Nueva Rutina'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-4 md:space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Nombre</label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all font-medium text-lg"
                                placeholder="Ej: Pull Day A"
                                autoFocus
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Días por semana</label>
                            <select
                                value={days}
                                onChange={e => setDays(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none outline-none"
                            >
                                {[1, 2, 3, 4, 5, 6, 7].map(d => <option key={d} value={d}>{d} días</option>)}
                            </select>
                        </div>
                        <div className="col-span-1 md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Descripción</label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-none outline-none min-h-[80px] resize-none"
                                placeholder="Breve descripción del objetivo de esta rutina..."
                            />
                        </div>
                    </div>

                    {/* Exercises */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Ejercicios</h3>
                            <button
                                onClick={() => setIsSelectorOpen(true)}
                                className="text-sm font-bold text-emerald-500 hover:text-emerald-600 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/10 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" /> Agregar
                            </button>
                        </div>

                        <div className="space-y-3">
                            {exercises.length === 0 && (
                                <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-400">
                                    Agrega ejercicios para comenzar
                                </div>
                            )}

                            {exercises.map((ex, idx) => (
                                <div key={idx} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-xl flex items-center gap-4 group hover:border-emerald-500/30 transition-colors shadow-sm">
                                    {/* Drag Handle (Visual) */}
                                    <div className="flex flex-col gap-1 text-gray-300">
                                        <button onClick={() => moveExercise(idx, 'up')} disabled={idx === 0} className="hover:text-emerald-500 disabled:opacity-30">▲</button>
                                        <GripVertical className="w-4 h-4" />
                                        <button onClick={() => moveExercise(idx, 'down')} disabled={idx === exercises.length - 1} className="hover:text-emerald-500 disabled:opacity-30">▼</button>
                                    </div>

                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900 dark:text-white">{ex.name}</h4>
                                        <div className="flex gap-4 mt-2">
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs text-gray-500 uppercase font-bold">Series</span>
                                                <input
                                                    type="number" value={ex.sets}
                                                    onChange={(e) => updateExercise(idx, 'sets', e.target.value)}
                                                    className="w-12 bg-gray-50 dark:bg-gray-900 border-none rounded px-1 py-0.5 text-center text-sm font-bold"
                                                />
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs text-gray-500 uppercase font-bold">Reps</span>
                                                <input
                                                    type="text" value={ex.reps}
                                                    onChange={(e) => updateExercise(idx, 'reps', e.target.value)}
                                                    className="w-14 bg-gray-50 dark:bg-gray-900 border-none rounded px-1 py-0.5 text-center text-sm font-bold"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button onClick={() => removeExercise(idx)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-3 md:p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-2 md:gap-3 rounded-b-2xl">
                    <button onClick={onClose} className="px-6 py-3 font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                    >
                        <Save className="w-5 h-5" /> Guardar
                    </button>
                </div>

                {/* Exercise Selector Modal (Nested) */}
                {isSelectorOpen && (
                    <div className="absolute inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col animate-in slide-in-from-bottom-5">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex gap-4 items-center">
                            <button onClick={() => setIsSelectorOpen(false)}><X className="w-6 h-6" /></button>
                            <input
                                type="text"
                                placeholder="Buscar ejercicio..."
                                className="flex-1 bg-transparent border-none outline-none text-lg"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-1">
                            {allExercises
                                .filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map(ex => (
                                    <button
                                        key={ex.id}
                                        onClick={() => addExercise(ex)}
                                        className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl flex justify-between items-center group"
                                    >
                                        <div>
                                            <div className="font-bold text-gray-900 dark:text-white">{ex.name}</div>
                                            <div className="text-xs text-gray-500 capitalize">{ex.muscle}</div>
                                        </div>
                                        <Plus className="w-5 h-5 text-emerald-500 opacity-0 group-hover:opacity-100" />
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
