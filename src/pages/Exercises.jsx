import React, { useState, useMemo } from 'react';
import { exercises } from '../data/exercises';
import ExerciseCard from '../components/exercises/ExerciseCard';
import ExerciseFilters from '../components/exercises/ExerciseFilters';
import ExerciseDetailModal from '../components/exercises/ExerciseDetailModal';
import ExerciseCompareModal from '../components/exercises/ExerciseCompareModal';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../context/WorkoutContext';
import { Dumbbell, LayoutGrid, List, Save, Check, Heart, X } from 'lucide-react';

const muscleTranslations = {
    chest: 'Pecho',
    back: 'Espalda',
    legs: 'Pierna',
    shoulders: 'Hombro',
    arms: 'Brazos',
    core: 'Core',
    cardio: 'Cardio'
};

const ITEMS_PER_PAGE = 12;

export default function Exercises() {
    const { activeWorkout, addExercise, startWorkout } = useWorkout();
    const navigate = useNavigate();

    // UI State
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
    const [page, setPage] = useState(1);
    const [compareList, setCompareList] = useState([]);
    const [showCompareModal, setShowCompareModal] = useState(false);

    // Filter State
    const [filters, setFilters] = useState({
        muscle: 'all',
        difficulty: 'all',
        equipment: 'all',
        sort: 'name-asc',
        search: ''
    });

    const [showPresets, setShowPresets] = useState(false);
    const [savedPresets, setSavedPresets] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('rabago_filter_presets')) || [];
        } catch { return []; }
    });

    const [favorites, setFavorites] = useState(() => {
        try {
            const saved = localStorage.getItem('rabago_favorites');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const handleToggleFavorite = (id) => {
        setFavorites(prev => {
            const newFavs = prev.includes(id)
                ? prev.filter(f => f !== id)
                : [...prev, id];
            localStorage.setItem('rabago_favorites', JSON.stringify(newFavs));
            return newFavs;
        });
    };

    const handleSavePreset = (name) => {
        const newPreset = { name, filters };
        const newPresets = [...savedPresets, newPreset];
        setSavedPresets(newPresets);
        localStorage.setItem('rabago_filter_presets', JSON.stringify(newPresets));
        setShowPresets(false);
    };

    const handleApplyPreset = (preset) => {
        setFilters(preset.filters);
        setShowPresets(false);
    };

    const toggleCompare = (e, exercise) => {
        e.stopPropagation();
        setCompareList(prev => {
            if (prev.find(i => i.id === exercise.id)) {
                return prev.filter(i => i.id !== exercise.id);
            }
            if (prev.length >= 3) return prev; // Max 3
            return [...prev, exercise];
        });
    };

    const handleAddToWorkout = (exercise) => {
        if (activeWorkout) {
            addExercise(exercise);
            navigate('/workouts');
        } else {
            // Start new workout with this exercise
            startWorkout("Entrenamiento Rápido", [{ ...exercise, sets: [{ id: 1, weight: 0, reps: 0, completed: false }] }]);
            navigate('/workouts');
        }
    };

    const filteredExercises = useMemo(() => {
        let result = [...exercises];

        // Search
        if (filters.search) {
            const q = filters.search.toLowerCase();
            result = result.filter(ex =>
                ex.name.toLowerCase().includes(q) ||
                ex.muscle.includes(q)
            );
        }

        // Muscle / Favorites
        if (filters.muscle === 'favorites') {
            result = result.filter(ex => favorites.includes(ex.id));
        } else if (filters.muscle !== 'all') {
            result = result.filter(ex => ex.muscle === filters.muscle);
        }

        // Difficulty
        if (filters.difficulty !== 'all') {
            result = result.filter(ex => ex.difficulty === filters.difficulty);
        }

        // Equipment
        if (filters.equipment !== 'all') {
            result = result.filter(ex => ex.equipment === filters.equipment);
        }

        // Sort
        result.sort((a, b) => {
            switch (filters.sort) {
                case 'name-asc': return a.name.localeCompare(b.name);
                case 'difficulty-asc': {
                    const rank = { easy: 1, medium: 2, hard: 3 };
                    return rank[a.difficulty] - rank[b.difficulty];
                }
                case 'difficulty-desc': {
                    const rank = { easy: 1, medium: 2, hard: 3 };
                    return rank[b.difficulty] - rank[a.difficulty];
                }
                case 'popularity-desc': return b.popularity - a.popularity;
                default: return 0;
            }
        });

        return result;
    }, [filters, favorites]);

    // Pagination Slice
    const displayedExercises = useMemo(() => {
        return filteredExercises.slice(0, page * ITEMS_PER_PAGE);
    }, [filteredExercises, page]);

    const handleLoadMore = () => {
        setPage(prev => prev + 1);
    };

    return (
        <div className="pb-24">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Biblioteca de Ejercicios</h2>
                    <p className="text-gray-500 dark:text-gray-400">
                        {filteredExercises.length} ejercicios encontrados
                    </p>
                </div>

                {/* View Toggles & Presets */}
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm text-emerald-500' : 'text-gray-400 hover:text-gray-600'}`}
                        title="Vista Cuadrícula"
                    >
                        <LayoutGrid className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm text-emerald-500' : 'text-gray-400 hover:text-gray-600'}`}
                        title="Vista Lista"
                    >
                        <List className="w-5 h-5" />
                    </button>
                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />

                    {/* Presets Button */}
                    <div className="relative">
                        <button
                            onClick={() => setShowPresets(!showPresets)}
                            className={`p-2 rounded-lg transition-all ${showPresets ? 'bg-emerald-100 text-emerald-600' : 'text-gray-400 hover:text-emerald-500'}`}
                            title="Filtros Guardados"
                        >
                            <Save className="w-5 h-5" />
                        </button>

                        {showPresets && (
                            <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-30 p-2 animate-in fade-in zoom-in-95">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Filtros Guardados</h4>
                                {savedPresets.length === 0 ? (
                                    <p className="text-sm text-gray-500 italic px-2 py-2">No hay presets guardados.</p>
                                ) : (
                                    <div className="space-y-1 mb-2">
                                        {savedPresets.map((preset, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleApplyPreset(preset)}
                                                className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg flex items-center justify-between group"
                                            >
                                                <span>{preset.name}</span>
                                                <div className="opacity-0 group-hover:opacity-100" onClick={(e) => {
                                                    e.stopPropagation();
                                                    const newPresets = savedPresets.filter((_, i) => i !== idx);
                                                    setSavedPresets(newPresets);
                                                    localStorage.setItem('rabago_filter_presets', JSON.stringify(newPresets));
                                                }}>
                                                    <X className="w-3 h-3 text-red-500" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <div className="border-t border-gray-100 dark:border-gray-700 pt-2 mt-2">
                                    <button
                                        onClick={() => {
                                            const name = prompt("Nombre del filtro:");
                                            if (name) handleSavePreset(name);
                                        }}
                                        className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-bold transition-colors"
                                    >
                                        Guardar Actual
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ExerciseFilters
                filters={filters}
                setFilters={setFilters}
                resultCount={filteredExercises.length}
            />

            <div className={`grid gap-6 animate-fade-in ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {displayedExercises.map(exercise => (
                    <div key={exercise.id} className="relative group">
                        {viewMode === 'grid' ? (
                            <ExerciseCard
                                exercise={exercise}
                                isFavorite={favorites.includes(exercise.id)}
                                onToggleFavorite={handleToggleFavorite}
                                onOpenDetails={setSelectedExercise}
                            />
                        ) : (
                            // List View Item
                            <div
                                onClick={() => setSelectedExercise(exercise)}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-emerald-500/30 transition-all cursor-pointer flex gap-4 items-center"
                            >
                                <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-700 overflow-hidden shrink-0">
                                    {exercise.image ? (
                                        <img src={exercise.image} alt={exercise.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Dumbbell className="w-full h-full p-4 text-gray-400" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white truncate">{exercise.name}</h3>
                                        <p className="text-xs text-gray-500 capitalize">{muscleTranslations[exercise.muscle]}</p>
                                    </div>
                                    <div className="hidden md:flex gap-2">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold
                                            ${exercise.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                                exercise.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'}`}>
                                            {exercise.difficulty}
                                        </span>
                                        {exercise.tags?.slice(0, 2).map(tag => (
                                            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 capitalize border border-gray-200 dark:border-gray-600">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleToggleFavorite(exercise.id); }}
                                    className={`p-2 rounded-full ${favorites.includes(exercise.id) ? 'bg-red-50 dark:bg-red-900/10 text-red-500' : 'text-gray-300 hover:text-red-500'}`}
                                >
                                    <Heart className={`w-5 h-5 ${favorites.includes(exercise.id) ? 'fill-current' : ''}`} />
                                </button>
                            </div>
                        )}

                        {/* Comparison Checkbox - Modified to sit ON TOP with high z-index */}
                        <div className={`absolute top-2 left-2 z-50 transition-opacity pointer-events-none ${compareList.length > 0 || compareList.find(i => i.id === exercise.id)
                            ? 'opacity-100'
                            : 'opacity-0 group-hover:opacity-100'
                            }`}>
                            {/* pointer-events-auto wrapper to capture clicks properly */}
                            <div className="pointer-events-auto">
                                <button
                                    onClick={(e) => toggleCompare(e, exercise)}
                                    className={`p-2 rounded-full backdrop-blur-md border shadow-sm ${compareList.find(i => i.id === exercise.id)
                                        ? 'bg-emerald-500 text-white border-emerald-500 opacity-100' // Always visible if selected
                                        : 'bg-black/50 text-white hover:bg-emerald-500 border-white/30'
                                        }`}
                                    title="Comparar"
                                >
                                    <Check className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Load More */}
            {displayedExercises.length < filteredExercises.length && (
                <div className="mt-8 text-center">
                    <button
                        onClick={handleLoadMore}
                        className="px-8 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                    >
                        Cargar más ejercicios
                    </button>
                    <p className="mt-2 text-xs text-gray-400">
                        Mostrando {displayedExercises.length} de {filteredExercises.length}
                    </p>
                </div>
            )}

            {filteredExercises.length === 0 && (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No se encontraron resultados</p>
                    <button
                        onClick={() => setFilters({ muscle: 'all', difficulty: 'all', equipment: 'all', sort: 'name-asc', search: '' })}
                        className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-medium transition-colors"
                    >
                        Limpiar todos los filtros
                    </button>
                </div>
            )}

            {/* Comparison Floating Bar */}
            {compareList.length > 0 && (
                <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl z-40 flex items-center gap-4 animate-in slide-in-from-bottom-4">
                    <span className="font-bold text-sm">{compareList.length} seleccionados</span>
                    <button
                        onClick={() => setShowCompareModal(true)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded-full text-xs font-bold transition-colors"
                    >
                        Comparar
                    </button>
                    <button
                        onClick={() => setCompareList([])}
                        className="p-1 hover:bg-white/10 rounded-full"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )}

            <ExerciseDetailModal
                exercise={selectedExercise}
                onClose={() => setSelectedExercise(null)}
                onAddToWorkout={handleAddToWorkout}
            />

            <ExerciseCompareModal
                isOpen={showCompareModal}
                selectedExercises={compareList}
                onClose={() => setShowCompareModal(false)}
                onRemove={(id) => setCompareList(prev => prev.filter(i => i.id !== id))}
            />
        </div>
    );
}
