import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Clock, Dumbbell, TrendingUp, ArrowRight, Home, Star } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function StatCard({ icon: Icon, label, value, colorClass }) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-4 flex flex-col items-center gap-2 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass}`}>
                <Icon className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">{value}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</span>
        </div>
    );
}

function formatDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s > 0 ? ` ${s}s` : ''}`.trim();
    return `${s}s`;
}

export default function WorkoutSummary({ summary, onDone }) {
    const navigate = useNavigate();
    const completedSets = summary.exercises?.reduce((acc, ex) => acc + ex.sets.filter(s => s.completed).length, 0) ?? 0;
    const totalSets = summary.exercises?.reduce((acc, ex) => acc + ex.sets.length, 0) ?? 0;

    return (
        <div className="max-w-lg mx-auto pb-16 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-500/30">
                    <Trophy className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    ¡Entrenamiento Completado!
                </h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium">{summary.name}</p>
                {summary.endTime && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {format(new Date(summary.endTime), "d 'de' MMMM, HH:mm", { locale: es })}
                    </p>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <StatCard
                    icon={Clock}
                    label="Duración"
                    value={formatDuration(summary.durationSeconds || 0)}
                    colorClass="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                />
                <StatCard
                    icon={Dumbbell}
                    label="Ejercicios"
                    value={summary.exercises?.length ?? 0}
                    colorClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                />
                <StatCard
                    icon={TrendingUp}
                    label="Volumen"
                    value={summary.totalVolume >= 1000
                        ? `${(summary.totalVolume / 1000).toFixed(1)}t`
                        : `${summary.totalVolume}kg`}
                    colorClass="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                />
            </div>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                {completedSets} de {totalSets} series completadas
            </p>

            {/* New PRs */}
            {summary.newPRs?.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-2xl p-4 mb-6">
                    <h3 className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-2 mb-3 text-sm">
                        <Star className="w-4 h-4 fill-current" />
                        {summary.newPRs.length} Récord{summary.newPRs.length > 1 ? 's' : ''} personal{summary.newPRs.length > 1 ? 'es' : ''} nuevo{summary.newPRs.length > 1 ? 's' : ''}
                    </h3>
                    <div className="space-y-1.5">
                        {summary.newPRs.map(pr => (
                            <div key={pr.name} className="flex justify-between items-center text-sm">
                                <span className="text-amber-700 dark:text-amber-300 font-medium">{pr.name}</span>
                                <span className="font-bold text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded-lg">
                                    {pr.weight} kg
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Exercise Breakdown */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden mb-8">
                {summary.exercises?.map((ex, i) => {
                    const done = ex.sets.filter(s => s.completed);
                    const max = Math.max(...ex.sets.map(s => parseFloat(s.weight) || 0));
                    return (
                        <div key={i} className={`px-4 py-3 flex justify-between items-center ${i > 0 ? 'border-t border-gray-100 dark:border-gray-800' : ''}`}>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white text-sm">{ex.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {done.length} {done.length === 1 ? 'serie' : 'series'} completada{done.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                            {max > 0 && (
                                <span className="text-sm font-bold text-emerald-500">{max} kg</span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
                <button
                    onClick={() => { onDone(); navigate('/progress'); }}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                    Ver Progreso <ArrowRight className="w-5 h-5" />
                </button>
                <button
                    onClick={() => { onDone(); navigate('/'); }}
                    className="w-full py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <Home className="w-4 h-4" /> Ir al Inicio
                </button>
            </div>
        </div>
    );
}
