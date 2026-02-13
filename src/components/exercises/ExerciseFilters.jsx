import React, { useState, useEffect } from 'react';
import { Heart, ChevronDown, Search, X, Filter } from 'lucide-react';
import useDebounce from '../../hooks/useDebounce';

export default function ExerciseFilters({ filters, setFilters, resultCount }) {
    const activeTabClass = "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 border-transparent transform scale-105";
    const inactiveTabClass = "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:text-emerald-500 hover:shadow-md";

    // Estado local para el input de búsqueda para permitir escritura fluida
    const [localSearch, setLocalSearch] = useState(filters.search);
    const debouncedSearch = useDebounce(localSearch, 500);

    // Sincronizar búsqueda local con filtros globales después del debounce
    useEffect(() => {
        setFilters(prev => ({ ...prev, search: debouncedSearch }));
    }, [debouncedSearch, setFilters]);

    // Resincronizar si el filtro externo cambia (ej. reset)
    useEffect(() => {
        setLocalSearch(filters.search);
    }, [filters.search]);

    const handleMuscleChange = (muscle) => {
        setFilters(prev => ({ ...prev, muscle }));
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleReset = () => {
        setFilters({
            muscle: 'all',
            difficulty: 'all',
            equipment: 'all',
            sort: 'name-asc',
            search: ''
        });
        setLocalSearch('');
    };

    const hasActiveFilters = filters.muscle !== 'all' ||
        filters.difficulty !== 'all' ||
        filters.equipment !== 'all' ||
        filters.search !== '';

    const categories = [
        { id: 'all', label: 'Todos' },
        { id: 'favorites', label: 'Favoritos', icon: Heart },
        { type: 'divider' },
        { id: 'chest', label: 'Pecho' },
        { id: 'back', label: 'Espalda' },
        { id: 'shoulders', label: 'Hombros' },
        { id: 'legs', label: 'Piernas' },
        { id: 'arms', label: 'Brazos' },
        { id: 'core', label: 'Core' },
        { id: 'cardio', label: 'Cardio' },
    ];

    return (
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl p-6 border border-gray-200 dark:border-white/5 shadow-xl shadow-gray-200/50 dark:shadow-black/20 mb-8 sticky top-24 z-30 transition-all duration-300">
            <div className="flex flex-col gap-6">

                {/* Header: Búsqueda y Resultados */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:max-w-md group">
                        <input
                            type="text"
                            placeholder="Buscar ejercicio, músculo..."
                            value={localSearch}
                            onChange={(e) => setLocalSearch(e.target.value)}
                            className="peer w-full bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-emerald-500 rounded-xl px-4 py-3 pl-12 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                        />
                        <Search className="w-5 h-5 text-gray-400 peer-focus:text-emerald-500 absolute left-4 top-3.5 transition-colors" />
                        {localSearch && (
                            <button
                                onClick={() => setLocalSearch('')}
                                className="absolute right-3 top-3 p-1 text-gray-400 hover:text-red-500 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                            <span className="font-semibold text-gray-900 dark:text-white">{resultCount}</span>
                            <span>Resultados</span>
                        </div>

                        {hasActiveFilters && (
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                                <Filter className="w-4 h-4" />
                                Resetear
                            </button>
                        )}
                    </div>
                </div>

                {/* Categories Scrollable Area */}
                <div className="w-full overflow-x-auto pb-2 -mb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
                    <div className="flex flex-nowrap gap-2 items-center min-w-min">
                        {categories.map((cat, idx) => {
                            if (cat.type === 'divider') {
                                return <div key={idx} className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2 flex-shrink-0"></div>;
                            }

                            const isActive = filters.muscle === cat.id;

                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => handleMuscleChange(cat.id)}
                                    className={`
                                        px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 border flex-shrink-0 flex items-center gap-2 select-none
                                        ${isActive ? activeTabClass : inactiveTabClass}
                                    `}
                                >
                                    {cat.icon && <cat.icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : ''}`} />}
                                    {cat.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Dropdown Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="relative group">
                        <select
                            name="difficulty"
                            value={filters.difficulty}
                            onChange={handleSelectChange}
                            className="w-full appearance-none bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 pr-10 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer text-sm font-medium"
                        >
                            <option value="all">Todas las Dificultades</option>
                            <option value="easy">Principiante</option>
                            <option value="medium">Intermedio</option>
                            <option value="hard">Avanzado</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-emerald-500 transition-colors" />
                    </div>

                    <div className="relative group">
                        <select
                            name="equipment"
                            value={filters.equipment}
                            onChange={handleSelectChange}
                            className="w-full appearance-none bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-xl px-4 py-2.5 pr-10 border border-gray-200 dark:border-white/10 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer text-sm font-medium"
                        >
                            <option value="all">Todo el Equipo</option>
                            <option value="barbell">Barra</option>
                            <option value="dumbbell">Mancuernas</option>
                            <option value="machine">Máquina</option>
                            <option value="bodyweight">Peso Corporal</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-emerald-500 transition-colors" />
                    </div>

                    <div className="relative group">
                        <select
                            name="sort"
                            value={filters.sort}
                            onChange={handleSelectChange}
                            className="w-full appearance-none bg-emerald-50 dark:bg-emerald-900/10 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-xl px-4 py-2.5 pr-10 border border-emerald-500/20 group-hover:border-emerald-500/50 focus:outline-none focus:border-emerald-500 transition-all cursor-pointer text-sm font-bold"
                        >
                            <option value="name-asc">A-Z</option>
                            <option value="difficulty-asc">Dificultad ↑</option>
                            <option value="difficulty-desc">Dificultad ↓</option>
                            <option value="popularity-desc">Populares</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-emerald-500/60 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
}
