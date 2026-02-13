import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../../context/WorkoutContext';
import {
    Calendar, Clock, Trophy, ChevronRight, Search, Filter,
    MoreVertical, Repeat, Share2, Trash2, Dumbbell
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function WorkoutHistoryList() {
    const { workoutHistory, startWorkout, deleteWorkout } = useWorkout();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeMenuId, setActiveMenuId] = useState(null);

    // Close menu when clicking outside
    React.useEffect(() => {
        const handleClickOutside = () => setActiveMenuId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Filter and Group Data
    const groupedWorkouts = useMemo(() => {
        if (!workoutHistory) return {};

        const filtered = workoutHistory.filter(w =>
            w.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const groups = {};

        filtered.forEach(workout => {
            const date = new Date(workout.endTime || Date.now());
            const monthKey = format(date, 'MMMM yyyy', { locale: es });
            // Capitalize first letter
            const displayKey = monthKey.charAt(0).toUpperCase() + monthKey.slice(1);

            if (!groups[displayKey]) {
                groups[displayKey] = [];
            }
            groups[displayKey].push(workout);
        });

        return groups;
    }, [workoutHistory, searchQuery]);

    const handleAction = (e, action, workout) => {
        e.stopPropagation(); // Prevent navigating to detail
        setActiveMenuId(null);

        switch (action) {
            case 'repeat':
                // Remover sets completed status for a fresh start
                const cleanExercises = workout.exercises.map(ex => ({
                    ...ex,
                    sets: ex.sets.map(s => ({ ...s, completed: false, weight: s.weight, reps: s.reps }))
                }));
                startWorkout(workout.name, cleanExercises);
                navigate('/workout');
                break;
            case 'share':
                const text = `¡Acabo de completar ${workout.name} en RabagoFit! 💪\nDuración: ${Math.floor((workout.durationSeconds || 0) / 60)} min\nEjercicios: ${workout.exercises?.length}`;
                if (navigator.share) {
                    navigator.share({ title: 'Mi Entrenamiento', text }).catch(() => { });
                } else {
                    navigator.clipboard.writeText(text);
                    alert('¡Resumen copiado al portapapeles!');
                }
                break;
            case 'delete':
                if (window.confirm('¿Seguro que quieres borrar este entrenamiento del historial?')) {
                    deleteWorkout(workout.id);
                }
                break;
        }
    };

    const toggleMenu = (e, id) => {
        e.stopPropagation();
        setActiveMenuId(activeMenuId === id ? null : id);
    };

    if (!workoutHistory || workoutHistory.length === 0) {
        return (
            <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Sin historial aún</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto mb-6">Completa tu primer entrenamiento para ver tu progreso aquí.</p>
                <button
                    onClick={() => navigate('/routines')}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
                >
                    Comenzar ahora
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Search & Stats */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar entrenamiento..."
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-gray-900 dark:text-white font-medium"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                {/* Could add filter dropdown here later */}
            </div>

            {Object.keys(groupedWorkouts).length === 0 && searchQuery && (
                <div className="text-center py-12">
                    <p className="text-gray-500 font-medium">No se encontraron entrenamientos para "{searchQuery}"</p>
                </div>
            )}

            {Object.entries(groupedWorkouts).map(([month, workouts]) => (
                <div key={month} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 pl-2 sticky top-20 bg-gray-50/95 dark:bg-[#09090b]/95 backdrop-blur-sm py-2 z-10 w-fit rounded-r-lg pr-4">
                        {month}
                    </h3>
                    <div className="space-y-3">
                        {workouts.map((workout) => (
                            <div
                                key={workout.id}
                                onClick={() => navigate(`/history/${workout.id}`)}
                                className="group relative bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-500/5 cursor-pointer"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 text-gray-600 dark:text-gray-300 rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner">
                                            {(workout.name || 'E').charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors text-lg">{workout.name}</h4>
                                            <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {format(new Date(workout.endTime), 'd MMM, HH:mm', { locale: es })}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {Math.floor((workout.durationSeconds || 0) / 60)} min
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Dumbbell className="w-3.5 h-3.5" />
                                                    {workout.exercises ? workout.exercises.length : 0} Ejercicios
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => toggleMenu(e, workout.id)}
                                            className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors relative"
                                        >
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Dropdown Menu */}
                                {activeMenuId === workout.id && (
                                    <div className="absolute right-4 top-16 z-20 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                        <button
                                            onClick={(e) => handleAction(e, 'repeat', workout)}
                                            className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                        >
                                            <Repeat className="w-4 h-4 text-emerald-500" /> Repetir Rutina
                                        </button>
                                        <button
                                            onClick={(e) => handleAction(e, 'share', workout)}
                                            className="w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                        >
                                            <Share2 className="w-4 h-4 text-blue-500" /> Compartir
                                        </button>
                                        <div className="h-px bg-gray-100 dark:bg-gray-700 my-0"></div>
                                        <button
                                            onClick={(e) => handleAction(e, 'delete', workout)}
                                            className="w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" /> Eliminar
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
