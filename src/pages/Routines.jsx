import React, { useState } from 'react';
import { Plus, Search, Calendar, Edit2, Trash2, Share2, Copy } from 'lucide-react';
import { routines as templateRoutines } from '../data/routines';
import RoutineCard from '../components/routines/RoutineCard';
import RoutineEditor from '../components/routines/RoutineEditor';
import SchedulerView from '../components/routines/SchedulerView';
import { useUser } from '../context/UserContext';

export default function Routines() {
    const { myRoutines, deleteRoutine, saveRoutine } = useUser();

    const [filter, setFilter] = useState('all');
    const [activeTab, setActiveTab] = useState('my-routines'); // 'my-routines', 'templates', 'calendar'

    // Editor State
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [routineToEdit, setRoutineToEdit] = useState(null);

    const filteredTemplates = filter === 'all'
        ? templateRoutines
        : templateRoutines.filter(r => r.goal === filter);

    const handleCreate = () => {
        setRoutineToEdit(null);
        setIsEditorOpen(true);
    };

    const handleEdit = (routine) => {
        setRoutineToEdit(routine);
        setIsEditorOpen(true);
    };

    const handleClone = (template) => {
        const newRoutine = {
            ...template,
            id: Date.now(),
            name: `${template.name} (Copia)`,
            isCustom: true
        };
        saveRoutine(newRoutine);
        alert('Rutinada copiada a "Mis Rutinas"');
        setActiveTab('my-routines');
    };

    const handleShare = (routine) => {
        const data = JSON.stringify(routine);
        // In real app: Generate link. Limit for now: Clipboard
        navigator.clipboard.writeText(data);
        alert('Datos de la rutina copiados al portapapeles (Simulación de Share)');
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Mis Rutinas</h2>
                    <p className="text-gray-500 dark:text-gray-400">Organiza tu semana de entrenamiento</p>
                </div>
                <button
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group"
                    onClick={handleCreate}
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Crear Nueva Rutina
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('my-routines')}
                    className={`pb-4 px-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'my-routines'
                        ? 'text-emerald-500 border-b-2 border-emerald-500'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    Mis Rutinas
                </button>
                <button
                    onClick={() => setActiveTab('templates')}
                    className={`pb-4 px-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'templates'
                        ? 'text-emerald-500 border-b-2 border-emerald-500'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    Plantillas Populares
                </button>
                <button
                    onClick={() => setActiveTab('calendar')}
                    className={`pb-4 px-2 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'calendar'
                        ? 'text-emerald-500 border-b-2 border-emerald-500'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    Calendario
                </button>
            </div>

            {activeTab === 'templates' && (
                <>
                    {/* Filters */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {['all', 'mass', 'strength', 'fat_loss'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize ${filter === f
                                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {f === 'all' ? 'Todos' : f.replace('_', ' ')}
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTemplates.map(routine => (
                            <div key={routine.id} className="relative group">
                                <RoutineCard routine={routine} />
                                {/* Overlay button for cloning */}
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleClone(routine); }}
                                        className="bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg text-emerald-500 hover:scale-110 transition-transform"
                                        title="Clonar a Mis Rutinas"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {activeTab === 'my-routines' && (
                <div>
                    {myRoutines.length === 0 ? (
                        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 border-dashed">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Calendar className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No tienes rutinas creadas</h3>
                            <button
                                onClick={() => setActiveTab('templates')}
                                className="text-emerald-500 hover:text-emerald-600 font-medium hover:underline"
                            >
                                Ver Plantillas
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myRoutines.map(routine => (
                                <div key={routine.id} className="relative group">
                                    <RoutineCard routine={routine} />
                                    {/* Action Buttons */}
                                    <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleShare(routine); }}
                                            className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 text-blue-500"
                                            title="Compartir"
                                        >
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleEdit(routine); }}
                                            className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                            title="Editar"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteRoutine(routine.id); }}
                                            className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'calendar' && (
                <SchedulerView myRoutines={myRoutines} />
            )}

            {/* Modal */}
            {isEditorOpen && (
                <RoutineEditor
                    routineToEdit={routineToEdit}
                    onClose={() => setIsEditorOpen(false)}
                />
            )}
        </div>
    );
}
