import React, { useMemo } from 'react';
import { Activity, Clock, Trophy, Dumbbell, Zap, TrendingUp, Plus, BarChart2, ClipboardList, Settings, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useWorkout } from '../../context/WorkoutContext';
import { useUser } from '../../context/UserContext';

// --- WIDGETS ---

export const StatsWidget = () => {
    const { workoutHistory } = useWorkout();

    const stats = useMemo(() => {
        const totalWorkouts = workoutHistory.length;
        const totalDurationSeconds = workoutHistory.reduce((acc, curr) => acc + (curr.durationSeconds || 0), 0);
        const totalHours = (totalDurationSeconds / 3600).toFixed(1);

        // Simplified volume calculation
        const totalVolume = workoutHistory.reduce((acc, workout) => {
            // If we saved volume in history, use it. Else calculate (expensive)
            // For this demo assuming rigorous calculation is done elsewhere or acceptable here
            const workoutVolume = workout.exercises ? workout.exercises.reduce((wAcc, ex) => {
                return wAcc + ex.sets.reduce((sAcc, set) => sAcc + (set.weight * set.reps), 0);
            }, 0) : 0;
            return acc + workoutVolume;
        }, 0);

        return [
            { label: 'Entrenamientos', value: totalWorkouts, sub: 'Total', icon: Dumbbell, color: 'text-emerald-400', bg: 'bg-emerald-500/30' },
            { label: 'Horas Totales', value: totalHours, sub: 'Tiempo', icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/30' },
            { label: 'Récords (Sim)', value: 0, sub: 'PRs', icon: Trophy, color: 'text-yellow-400', bg: 'bg-yellow-500/30' },
            { label: 'kg Volumen', value: (totalVolume / 1000).toFixed(1) + 'k', sub: 'Total', icon: Activity, color: 'text-purple-400', bg: 'bg-purple-500/30' },
        ];
    }, [workoutHistory]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
                <div key={idx} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <span className={`text-xs font-mono font-bold px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700/50 ${stat.color}`}>{stat.sub}</span>
                    </div>
                    <h3 className="text-3xl font-bold font-mono text-gray-900 dark:text-white mb-1">{stat.value}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">{stat.label}</p>
                </div>
            ))}
        </div>
    );
};

export const FeaturedWorkoutWidget = () => {
    const { startWorkout } = useWorkout();
    return (
        <div className="bg-gradient-to-r from-gray-900 to-emerald-950 border border-emerald-500/30 rounded-3xl p-6 md:p-8 relative overflow-hidden group shadow-2xl shadow-emerald-900/20">
            <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:bg-emerald-500/20 transition-colors duration-500"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider rounded-full shadow-[0_0_10px_rgba(16,185,129,0.2)]">Sugerido para hoy</span>
                    </div>
                    <div>
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">Rutina <span className="text-emerald-400">Libre</span></h3>
                        <p className="text-gray-300 max-w-lg text-base md:text-lg">Entrena a tu ritmo, elige tus ejercicios y supera tus marcas.</p>
                    </div>
                </div>
                <button
                    onClick={() => startWorkout("Entrenamiento Libre")}
                    className="w-full md:w-auto flex-shrink-0 bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-xl font-bold transition-all transform hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.5)] flex items-center justify-center text-lg"
                >
                    <TrendingUp className="w-5 h-5 mr-3" />
                    Iniciar Ahora
                </button>
            </div>
        </div>
    );
};

export const ConsistencyWidget = () => {
    const { workoutHistory } = useWorkout();
    const currentMonth = new Date().getMonth();
    const sessionsThisMonth = workoutHistory.filter(w => new Date(w.endTime).getMonth() === currentMonth).length;
    const monthlyGoal = 12; // Could be customizable
    const progressPercent = Math.min((sessionsThisMonth / monthlyGoal) * 100, 100);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Constancia de Sesiones</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">Mantén el ritmo este mes</p>
                </div>
                <div className="text-left md:text-right">
                    <span className="text-3xl md:text-4xl font-bold text-emerald-500 font-mono">{sessionsThisMonth}</span>
                    <span className="text-gray-400 text-lg md:text-xl font-medium">/ {monthlyGoal}</span>
                </div>
            </div>
            <div className="relative w-full h-6 bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden mb-4 ring-1 ring-gray-900/5 dark:ring-white/5">
                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 dark:text-gray-300 font-bold uppercase tracking-wider">
                <span>Inicio de Mes</span>
                <span>{Math.round(progressPercent)}% Completado</span>
                <span>Meta</span>
            </div>
        </div>
    );
};

export const QuickActionsWidget = () => {
    const navigate = useNavigate();
    return (
        <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Acciones Rápidas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Nuevo Entrenamiento', sub: 'Comenzar sesión', icon: Plus, path: '/workouts', color: 'bg-emerald-500' },
                    { label: 'Ver Progreso', sub: 'Analizar métricas', icon: BarChart2, path: '/progress', color: 'bg-blue-500' },
                    { label: 'Gestionar Rutinas', sub: 'Crear/Editar', icon: ClipboardList, path: '/routines', color: 'bg-purple-500' }
                ].map((action, i) => (
                    <button
                        key={i}
                        onClick={() => navigate(action.path)}
                        className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm text-left hover:-translate-y-1 transition-transform duration-300 group"
                    >
                        <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                            <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{action.label}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{action.sub}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};

export const AchievementsWidget = () => {
    const { achievements } = useUser();

    // Some placeholders if empty so it looks good for demo
    const displayAchievements = achievements.length > 0 ? achievements : [
        { id: 'locked1', name: '???', desc: 'Sigue entrenando para desbloquear', icon: Lock, locked: true },
        { id: 'locked2', name: '???', desc: 'Sigue entrenando para desbloquear', icon: Lock, locked: true },
        { id: 'locked3', name: '???', desc: 'Sigue entrenando para desbloquear', icon: Lock, locked: true }
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" /> Logros Recientes
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                {displayAchievements.map((ach, i) => (
                    <div key={i} className={`min-w-[140px] p-4 rounded-xl border ${ach.locked ? 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50' : 'border-emerald-100 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-900/10'} flex flex-col items-center text-center`}>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${ach.locked ? 'bg-gray-200 dark:bg-gray-700 text-gray-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600'}`}>
                            {ach.locked ? <Lock className="w-5 h-5" /> : <Trophy className="w-5 h-5" />}
                        </div>
                        <div className={`font-bold text-sm ${ach.locked ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>{ach.name}</div>
                        <div className="text-xs text-gray-500 mt-1 line-clamp-2">{ach.desc}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const RecommendationsWidget = () => {
    // Logic could be moved to hook, but simple randomized advice for now
    const tips = [
        "No olvides calentar antes de empezar series pesadas.",
        "La hidratación es clave para el rendimiento.",
        "Intenta aumentar el peso en tu próximo ejercicio compuesto.",
        "Descansa al menos 48h antes de entrenar el mismo músculo."
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];

    return (
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2 relative z-10">
                <Zap className="w-5 h-5 text-yellow-300" /> Consejo del Entrenador
            </h3>
            <p className="text-blue-50 relative z-10 font-medium">"{randomTip}"</p>
        </div>
    );
};
