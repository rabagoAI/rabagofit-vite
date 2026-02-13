import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Clock, Calendar, CheckCircle, MoreVertical, Copy, Edit2,
    Zap, BarChart, Dumbbell, Star, ChevronRight, Signal
} from 'lucide-react';

export default function RoutineCard({ routine, onDuplicate, onEdit }) {
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    const goalColors = {
        mass: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
        strength: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
        fat_loss: 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
        general: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
        aesthetics: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800'
    };

    const goalLabels = {
        mass: 'Hipertrofia',
        strength: 'Fuerza',
        fat_loss: 'Quema Grasa',
        general: 'General',
        aesthetics: 'Estética'
    };

    const levelLabels = {
        beginner: 'Principiante',
        intermediate: 'Intermedio',
        advanced: 'Avanzado',
        all_levels: 'Todos los niveles'
    };

    // Derived difficulty for visual bars (fallback logic)
    const difficultyMap = { beginner: 1, intermediate: 2, advanced: 3, all_levels: 1 };
    const difficultyLevel = difficultyMap[routine.level] || (routine.difficulty === 'hard' ? 3 : routine.difficulty === 'medium' ? 2 : 1);

    const handleAction = (e, action) => {
        e.stopPropagation();
        setShowMenu(false);
        if (action === 'duplicate' && onDuplicate) onDuplicate(routine);
        if (action === 'edit' && onEdit) onEdit(routine);
    };

    return (
        <div
            className="group relative bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden"
            onMouseLeave={() => setShowMenu(false)}
        >
            {/* Image Header with Gradient Overlay */}
            <div className="relative h-48 overflow-hidden">
                {routine.image ? (
                    <img
                        src={routine.image}
                        alt={routine.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                        <Dumbbell className="w-12 h-12 text-gray-300 dark:text-gray-700" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border ${goalColors[routine.goal] || goalColors.general}`}>
                        {goalLabels[routine.goal] || routine.goal}
                    </span>

                    <div className="relative">
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                            className="p-2 bg-black/30 backdrop-blur-md text-white hover:bg-white/20 rounded-full transition-colors"
                        >
                            <MoreVertical className="w-5 h-5" />
                        </button>
                        {/* Action Menu */}
                        {showMenu && (
                            <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-100">
                                <button
                                    onClick={(e) => handleAction(e, 'duplicate')}
                                    className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                >
                                    <Copy className="w-4 h-4 text-blue-500" /> Duplicar
                                </button>
                                <button
                                    onClick={(e) => handleAction(e, 'edit')}
                                    className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                >
                                    <Edit2 className="w-4 h-4 text-emerald-500" /> Editar
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Content within Image Area */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold mb-1 leading-tight group-hover:text-emerald-400 transition-colors shadow-black drop-shadow-md">
                        {routine.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                        <Signal className="w-3.5 h-3.5" />
                        <span>{levelLabels[routine.level] || 'Intermedio'}</span>
                    </div>
                </div>
            </div>

            {/* Body Content */}
            <div className="p-5 flex flex-col flex-1">
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4 flex-grow">
                    {routine.description}
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="font-medium">{routine.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-lg border border-gray-100 dark:border-gray-800">
                        <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="font-medium">{routine.days} Días/sem</span>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-2 mt-auto pt-2">
                    <button
                        onClick={() => navigate(`/routines/${routine.id}`)}
                        className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white py-2.5 rounded-xl text-sm font-bold transition-colors"
                    >
                        Ver Detalles
                    </button>
                    <button
                        onClick={() => navigate(`/routines/${routine.id}`)} // This would ideally trigger the workout start directly if logic permits
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 text-sm flex items-center justify-center gap-2"
                    >
                        <Zap className="w-4 h-4 fill-current" />
                        Empezar
                    </button>
                </div>
            </div>
        </div>
    );
}
