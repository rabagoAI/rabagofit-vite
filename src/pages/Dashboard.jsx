import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useWorkout } from '../context/WorkoutContext';
import { Settings, Eye, EyeOff, GripVertical, Check } from 'lucide-react';
import {
    StatsWidget,
    FeaturedWorkoutWidget,
    ConsistencyWidget,
    QuickActionsWidget,
    AchievementsWidget,
    RecommendationsWidget
} from '../components/dashboard/DashboardWidgets';

export default function Dashboard() {
    const { userProfile, dashboardConfig, updateDashboardConfig, checkAchievements } = useUser();
    const { workoutHistory } = useWorkout();

    const [isConfigOpen, setIsConfigOpen] = useState(false);

    // Check for achievements whenever history changes (simple effect)
    useEffect(() => {
        checkAchievements(workoutHistory);
    }, [workoutHistory.length]);

    const WIDGET_MAP = {
        'stats': <StatsWidget />,
        'featured_workout': <FeaturedWorkoutWidget />,
        'consistency': <ConsistencyWidget />,
        'quick_actions': <QuickActionsWidget />,
        'achievements': <AchievementsWidget />,
        'recommendations': <RecommendationsWidget />
    };

    const WIDGET_LABELS = {
        'stats': 'Estadísticas Generales',
        'featured_workout': 'Entrenamiento Destacado',
        'consistency': 'Gráfico de Constancia',
        'quick_actions': 'Acciones Rápidas',
        'achievements': 'Logros',
        'recommendations': 'Consejos'
    };

    const handleToggleWidget = (widgetId) => {
        const isHidden = dashboardConfig.hidden.includes(widgetId);
        let newHidden;
        if (isHidden) {
            newHidden = dashboardConfig.hidden.filter(id => id !== widgetId);
        } else {
            newHidden = [...dashboardConfig.hidden, widgetId];
        }
        updateDashboardConfig({ hidden: newHidden });
    };

    const moveWidget = (index, direction) => {
        const layout = [...dashboardConfig.layout];
        if (direction === 'up' && index > 0) {
            [layout[index], layout[index - 1]] = [layout[index - 1], layout[index]];
        }
        if (direction === 'down' && index < layout.length - 1) {
            [layout[index], layout[index + 1]] = [layout[index + 1], layout[index]];
        }
        updateDashboardConfig({ layout });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <section className="text-center relative mb-12">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] md:w-[500px] md:h-[300px] bg-emerald-500/20 rounded-full blur-[80px] md:blur-[100px] pointer-events-none"></div>
                <div className="relative z-10 flex justify-end">
                    <button
                        onClick={() => setIsConfigOpen(true)}
                        className="p-2 bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 rounded-full backdrop-blur-sm transition-colors text-gray-500 dark:text-gray-400"
                        title="Personalizar Dashboard"
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 relative z-10">
                    <span className="text-gray-900 dark:text-gray-100">Bienvenido de vuelta, </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 drop-shadow-sm">{userProfile.name}</span>
                </h2>
                <p className="text-base md:text-lg relative z-10 text-gray-600 dark:text-gray-200">Listo para alcanzar nuevos límites hoy</p>
            </section>

            {/* Dynamic Widgets */}
            <div className="space-y-8">
                {dashboardConfig.layout.map(widgetId => {
                    if (dashboardConfig.hidden.includes(widgetId)) return null;
                    return (
                        <div key={widgetId} className="animate-in slide-in-from-bottom-4 duration-500">
                            {WIDGET_MAP[widgetId]}
                        </div>
                    );
                })}
            </div>

            {/* Config Modal */}
            {isConfigOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-md mx-2 md:mx-auto rounded-2xl shadow-2xl overflow-hidden">
                        <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Personalizar Inicio</h3>
                            <button onClick={() => setIsConfigOpen(false)}><Check className="w-6 h-6 text-emerald-500" /></button>
                        </div>
                        <div className="p-3 md:p-4 space-y-2 max-h-[50vh] md:max-h-[60vh] overflow-y-auto">
                            <p className="text-sm text-gray-500 mb-4">Oculta o reordena los elementos de tu pantalla de inicio.</p>
                            {dashboardConfig.layout.map((id, index) => (
                                <div key={id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <div className="flex flex-col gap-1">
                                        <button onClick={() => moveWidget(index, 'up')} disabled={index === 0} className="hover:text-emerald-500 disabled:opacity-30 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400">
                                            <span className="text-lg">▲</span>
                                        </button>
                                        <button onClick={() => moveWidget(index, 'down')} disabled={index === dashboardConfig.layout.length - 1} className="hover:text-emerald-500 disabled:opacity-30 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400">
                                            <span className="text-lg">▼</span>
                                        </button>
                                    </div>
                                    <span className="flex-1 font-medium text-gray-700 dark:text-gray-200">{WIDGET_LABELS[id]}</span>
                                    <button
                                        onClick={() => handleToggleWidget(id)}
                                        className={`p-2 rounded-lg transition-colors ${dashboardConfig.hidden.includes(id) ? 'bg-gray-200 dark:bg-gray-700 text-gray-500' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'}`}
                                    >
                                        {dashboardConfig.hidden.includes(id) ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
