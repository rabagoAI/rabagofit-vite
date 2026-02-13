import React, { useState, useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import { Calendar, TrendingUp, Activity, Weight, Plus, X, Trash2, AlertTriangle } from 'lucide-react';
import { useWorkout } from '../context/WorkoutContext';
import { useUser } from '../context/UserContext';
import { format, subDays, startOfWeek, addDays, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import PRChart from '../components/progress/PRChart';
import { Trophy } from 'lucide-react';

export default function Progress() {
    const { workoutHistory, clearHistory } = useWorkout();
    const { bodyStats, addBodyStat, clearBodyStats } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [weightInput, setWeightInput] = useState('');
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);

    // Weekly Volume Logic
    const weeklyData = useMemo(() => {
        const today = new Date();
        const start = startOfWeek(today, { weekStartsOn: 1 }); // Monday start
        const days = [];

        for (let i = 0; i < 7; i++) {
            const currentDay = addDays(start, i);
            const label = format(currentDay, 'EEE', { locale: es });

            // Filter workouts for this day
            const dayWorkouts = workoutHistory.filter(w =>
                new Date(w.endTime).toDateString() === currentDay.toDateString()
            );

            const volume = dayWorkouts.reduce((acc, w) =>
                acc + w.exercises.reduce((wa, e) => wa + e.sets.reduce((sa, s) => sa + (s.weight * s.reps), 0), 0)
                , 0);

            days.push({ name: label.charAt(0).toUpperCase() + label.slice(1), volume: volume / 1000 }); // Volume in tonnes (k)
        }
        return days;
    }, [workoutHistory]);

    // Weight Data Logic
    const weightChartData = useMemo(() => {
        if (!bodyStats.length) return [];
        return bodyStats.map(stat => ({
            date: format(new Date(stat.date), 'd MMM', { locale: es }),
            weight: parseFloat(stat.weight)
        }));
    }, [bodyStats]);

    const [selectedExercise, setSelectedExercise] = useState('');

    // Get unique exercises
    const availableExercises = useMemo(() => {
        const exercises = new Set();
        workoutHistory.forEach(w => {
            w.exercises.forEach(e => exercises.add(e.name)); // Assuming e.name is the identifier
        });
        return Array.from(exercises).sort();
    }, [workoutHistory]);

    // Set default selected exercise
    React.useEffect(() => {
        if (availableExercises.length > 0 && !selectedExercise) {
            setSelectedExercise(availableExercises[0]);
        }
    }, [availableExercises, selectedExercise]);

    // PR Data Logic
    const prData = useMemo(() => {
        if (!selectedExercise) return [];

        const data = [];
        workoutHistory.forEach(w => {
            const exercise = w.exercises.find(e => e.name === selectedExercise);
            if (exercise) {
                // Find max weight lifted in this session for this exercise
                const maxWeight = Math.max(...exercise.sets.map(s => parseFloat(s.weight) || 0));

                if (maxWeight > 0) {
                    data.push({
                        date: format(new Date(w.endTime), 'd MMM', { locale: es }),
                        weight: maxWeight,
                        fullDate: new Date(w.endTime) // For sorting
                    });
                }
            }
        });

        return data.sort((a, b) => a.fullDate - b.fullDate);
    }, [workoutHistory, selectedExercise]);


    const handleSaveWeight = (e) => {
        e.preventDefault();
        if (!weightInput) return;

        addBodyStat({
            id: Date.now(),
            date: new Date().toISOString(),
            weight: parseFloat(weightInput)
        });
        setWeightInput('');
        setIsModalOpen(false);
    };

    const handleReset = (type) => {
        if (type === 'weight') {
            clearBodyStats();
        } else if (type === 'workouts') {
            clearHistory();
        } else if (type === 'both') {
            if (confirm('¿Estás seguro de que quieres borrar TODAS las estadísticas de peso Y el historial de entrenamientos? Esta acción no se puede deshacer.')) {
                clearBodyStats();
                clearHistory();
            }
        }
        setIsResetModalOpen(false);
    };

    return (
        <div className="pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Tu Progreso</h2>
                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">Visualiza tus ganancias y mantén la consistencia</p>
                </div>
                <div className="flex gap-2 md:gap-3">
                    <button
                        onClick={() => setIsResetModalOpen(true)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 md:px-4 py-2 md:py-3 rounded-xl font-bold transition-all shadow-glow hover:shadow-glow-lg flex items-center justify-center gap-2 transform hover:-translate-y-0.5 text-sm md:text-base"
                    >
                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="hidden sm:inline">Resetear</span>
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-bold transition-all shadow-glow hover:shadow-glow-lg flex items-center justify-center gap-2 transform hover:-translate-y-0.5 text-sm md:text-base"
                    >
                        <Weight className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="hidden sm:inline">Registrar</span><span className="sm:hidden">Peso</span><span className="hidden sm:inline"> Peso</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Weekly Volume Chart */}
                <div className="bg-white dark:bg-gray-900 backdrop-blur-md p-6 rounded-2xl border border-gray-200 dark:border-emerald-500/20 shadow-sm dark:shadow-card hover:shadow-glow transition-all duration-500">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-emerald-500" />
                            Volumen Semanal (Ton)
                        </h3>
                    </div>
                    <div className="h-48 sm:h-56 md:h-64">
                        {weeklyData.some(d => d.volume > 0) ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} stroke="#ffffff" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '0.5rem', color: '#fff' }}
                                    />
                                    <Bar dataKey="volume" fill="#10B981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                <Activity className="w-12 h-12 mb-2 opacity-50" />
                                <p className="font-medium">Sin datos semanales</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* PR Chart Section */}
                <div className="bg-white dark:bg-gray-900 backdrop-blur-md p-6 rounded-2xl border border-gray-200 dark:border-emerald-500/20 shadow-sm dark:shadow-card hover:shadow-glow transition-all duration-500 col-span-1 lg:col-span-2">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            Récords Personales (Max Peso)
                        </h3>
                        <select
                            value={selectedExercise}
                            onChange={(e) => setSelectedExercise(e.target.value)}
                            className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            {availableExercises.map(ex => (
                                <option key={ex} value={ex}>{ex}</option>
                            ))}
                        </select>
                    </div>
                    {prData.length > 0 ? (
                        <PRChart data={prData} exerciseName={selectedExercise} />
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                            <Trophy className="w-12 h-12 mb-2 opacity-50" />
                            <p className="font-medium">Selecciona un ejercicio con registros</p>
                        </div>
                    )}
                </div>

                {/* Body Weight Trend */}
                <div className="bg-white dark:bg-gray-900 backdrop-blur-md p-6 rounded-2xl border border-gray-200 dark:border-emerald-500/20 shadow-sm dark:shadow-card hover:shadow-glow transition-all duration-500">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                            Tendencia de Peso (kg)
                        </h3>
                    </div>
                    <div className="h-48 sm:h-56 md:h-64">
                        {weightChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weightChartData}>
                                    <defs>
                                        <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} stroke="#ffffff" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }} dy={10} />
                                    <YAxis domain={['dataMin - 2', 'dataMax + 2']} axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 500 }} />
                                    <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '0.5rem', color: '#fff' }} />
                                    <Area type="monotone" dataKey="weight" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                                <Weight className="w-12 h-12 mb-2 opacity-50" />
                                <p className="font-medium">No hay registros de peso aún</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setIsModalOpen(false); setWeightInput(''); }}></div>
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 w-full max-w-sm mx-2 md:mx-auto shadow-xl border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
                        <button onClick={() => { setIsModalOpen(false); setWeightInput(''); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Registrar Peso</h3>
                        <form onSubmit={handleSaveWeight}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Peso actual (kg)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-gray-900 dark:text-white"
                                    placeholder="0.0"
                                    value={weightInput}
                                    onChange={(e) => setWeightInput(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-all">
                                Guardar
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Reset Modal */}
            {isResetModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsResetModalOpen(false)}></div>
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-4 md:p-6 w-full max-w-md mx-2 md:mx-auto shadow-xl border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200">
                        <button onClick={() => setIsResetModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Resetear Datos</h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">Selecciona qué datos deseas borrar. Esta acción no se puede deshacer.</p>
                        <div className="space-y-3">
                            <button
                                onClick={() => handleReset('weight')}
                                className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-4 rounded-xl transition-all text-left flex items-center gap-3"
                            >
                                <Weight className="w-5 h-5 text-blue-500" />
                                <div>
                                    <div className="font-bold">Solo Estadísticas de Peso</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Borrar registros de peso corporal</div>
                                </div>
                            </button>
                            <button
                                onClick={() => handleReset('workouts')}
                                className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-4 rounded-xl transition-all text-left flex items-center gap-3"
                            >
                                <Activity className="w-5 h-5 text-emerald-500" />
                                <div>
                                    <div className="font-bold">Solo Historial de Entrenamientos</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Borrar todos los entrenamientos registrados</div>
                                </div>
                            </button>
                            <button
                                onClick={() => handleReset('both')}
                                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl transition-all text-left flex items-center gap-3"
                            >
                                <Trash2 className="w-5 h-5" />
                                <div>
                                    <div className="font-bold">Borrar Todo</div>
                                    <div className="text-sm text-red-100">Borrar estadísticas de peso Y entrenamientos</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
