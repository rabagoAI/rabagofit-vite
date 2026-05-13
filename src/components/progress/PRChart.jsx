import React, { useState, useMemo } from 'react';
import {
    ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Trophy, TrendingUp, Zap } from 'lucide-react';

// Epley formula: estimated 1-rep max
const epley1RM = (weight, reps) => {
    if (!reps || reps <= 1) return weight;
    return Math.round(weight * (1 + reps / 30) * 10) / 10;
};

// Helper: Calculate simple linear regression for trend line
const calculateTrendLine = (data) => {
    if (!data || data.length < 2) return [];

    const n = data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;

    // We use index as X for simple sequence regression
    data.forEach((point, i) => {
        sumX += i;
        sumY += point.weight;
        sumXY += i * point.weight;
        sumXX += i * i;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return data.map((point, i) => ({
        ...point,
        trend: intercept + slope * i
    }));
};

export default function PRChart({ data, exerciseName }) {
    const [timeRange, setTimeRange] = useState('ALL');
    const [show1RM, setShow1RM] = useState(true);

    const filteredData = useMemo(() => {
        if (!data || data.length === 0) return [];

        const now = new Date();
        let cutoffDate = new Date();

        switch (timeRange) {
            case '1M': cutoffDate.setMonth(now.getMonth() - 1); break;
            case '3M': cutoffDate.setMonth(now.getMonth() - 3); break;
            case '6M': cutoffDate.setMonth(now.getMonth() - 6); break;
            case '1Y': cutoffDate.setFullYear(now.getFullYear() - 1); break;
            default: cutoffDate = new Date(0);
        }

        const filtered = data.filter(d => {
            const dateObj = d.fullDate ? new Date(d.fullDate) : new Date(d.date);
            return dateObj >= cutoffDate;
        });

        return calculateTrendLine(filtered).map(d => ({
            ...d,
            orm: epley1RM(d.weight, d.reps)
        }));
    }, [data, timeRange]);

    if (!data || data.length === 0) {
        return (
            <div className="h-64 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <Trophy className="w-12 h-12 mb-2 opacity-50" />
                <p className="font-medium">No hay datos suficientes</p>
            </div>
        );
    }

    // --- Statistics ---
    const currentPR = data.length > 0 ? Math.max(...data.map(d => d.weight)) : 0;
    const best1RM = filteredData.length > 0 ? Math.max(...filteredData.map(d => d.orm ?? d.weight)) : 0;

    const firstWeight = filteredData.length > 0 ? filteredData[0].weight : 0;
    const lastWeight = filteredData.length > 0 ? filteredData[filteredData.length - 1].weight : 0;
    const improvement = firstWeight > 0 ? ((lastWeight - firstWeight) / firstWeight * 100).toFixed(1) : 0;

    return (
        <div className="space-y-4">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-200 dark:border-emerald-800">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Récord Actual</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums tracking-tight">{currentPR} <span className="text-sm font-medium text-gray-500">kg</span></h3>
                                {filteredData.length >= 2 && (
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${parseFloat(improvement) >= 0 ? 'text-emerald-700 bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' : 'text-red-600 bg-red-50 border border-red-200'}`}>
                                        {parseFloat(improvement) > 0 ? '+' : ''}{improvement}%
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {best1RM > 0 && (
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400 shadow-sm border border-amber-200 dark:border-amber-800">
                                <Zap className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">1RM Est.</p>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white tabular-nums tracking-tight">{best1RM} <span className="text-sm font-medium text-gray-500">kg</span></h3>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2 items-end">
                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                        {['1M', '3M', '6M', '1Y', 'ALL'].map(range => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${timeRange === range
                                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setShow1RM(v => !v)}
                        className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border transition-all ${show1RM
                            ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-700/40'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700'
                        }`}
                    >
                        <Zap className="w-3 h-3" /> 1RM Epley
                    </button>
                </div>
            </div>

            {/* Chart Area */}
            <div className="h-72 w-full bg-gradient-to-b from-transparent to-emerald-50/10 dark:to-emerald-900/5 rounded-2xl">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPrGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.08} stroke="currentColor" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 500 }}
                            dy={10}
                            minTickGap={30}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 11, fontWeight: 500 }}
                            domain={['dataMin - 2.5', 'dataMax + 2.5']}
                        />
                        <Tooltip
                            cursor={{ stroke: '#10B981', strokeWidth: 1, strokeDasharray: '4 4' }}
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    const point = payload[0].payload;
                                    return (
                                        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200 dark:border-gray-700 p-3 rounded-xl shadow-xl text-xs">
                                            <p className="font-bold text-gray-900 dark:text-white mb-2">{label}</p>
                                            <div className="space-y-1.5">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20"></span>
                                                    <span className="text-gray-500 dark:text-gray-400 font-medium">Peso:</span>
                                                    <span className="font-mono font-bold text-base text-gray-900 dark:text-white ml-auto">{point.weight} kg</span>
                                                </div>
                                                {point.reps > 0 && (
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-2 h-2 rounded-full bg-gray-300"></span>
                                                        <span className="text-gray-500 dark:text-gray-400">Reps:</span>
                                                        <span className="font-mono text-gray-700 dark:text-gray-300 ml-auto">{point.reps}</span>
                                                    </div>
                                                )}
                                                {point.orm && point.orm !== point.weight && (
                                                    <div className="flex items-center gap-3 pt-1 border-t border-gray-100 dark:border-gray-800">
                                                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                                                        <span className="text-amber-600 dark:text-amber-400 font-medium">1RM est.:</span>
                                                        <span className="font-mono font-bold text-amber-700 dark:text-amber-300 ml-auto">{point.orm} kg</span>
                                                    </div>
                                                )}
                                                {point.trend && (
                                                    <div className="flex items-center gap-3 pt-1 border-t border-gray-100 dark:border-gray-800">
                                                        <span className="w-2 h-2 rounded-full bg-blue-500/50"></span>
                                                        <span className="text-gray-400 dark:text-gray-500">Tendencia:</span>
                                                        <span className="font-mono text-gray-400 dark:text-gray-500 ml-auto">~{point.trend.toFixed(1)} kg</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="weight"
                            stroke="none"
                            fill="url(#colorPrGradient)"
                            animationDuration={1500}
                        />
                        <Line
                            type="monotone"
                            dataKey="trend"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={false}
                            activeDot={false}
                            opacity={0.4}
                            animationDuration={1500}
                        />
                        {show1RM && (
                            <Line
                                type="monotone"
                                dataKey="orm"
                                stroke="#F59E0B"
                                strokeWidth={2}
                                strokeDasharray="4 3"
                                dot={{ r: 3, fill: '#F59E0B', strokeWidth: 0 }}
                                activeDot={{ r: 6, strokeWidth: 0, fill: '#F59E0B' }}
                                opacity={0.85}
                                animationDuration={1500}
                            />
                        )}
                        <Line
                            type="monotone"
                            dataKey="weight"
                            stroke="#10B981"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 7, strokeWidth: 0, fill: '#10B981' }}
                            animationDuration={1500}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
