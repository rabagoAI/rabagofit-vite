import React from 'react';
import { SkipForward, Plus, Minus } from 'lucide-react';

const RADIUS = 38;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function RestTimerOverlay({ secondsLeft, duration, onSkip, onAdd, onSubtract }) {
    const progress = duration > 0 ? secondsLeft / duration : 0;
    const dashOffset = CIRCUMFERENCE * (1 - progress);
    const isUrgent = secondsLeft <= 10;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-6 px-4 pointer-events-none">
            <div className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 shadow-2xl flex items-center gap-5 pointer-events-auto w-full max-w-sm animate-in slide-in-from-bottom-4 duration-300">

                {/* Circular countdown */}
                <div className="relative w-20 h-20 flex-shrink-0">
                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
                        <circle
                            cx="50" cy="50" r={RADIUS}
                            fill="none" stroke="#374151" strokeWidth="8"
                        />
                        <circle
                            cx="50" cy="50" r={RADIUS}
                            fill="none"
                            stroke={isUrgent ? '#EF4444' : '#10B981'}
                            strokeWidth="8"
                            strokeDasharray={CIRCUMFERENCE}
                            strokeDashoffset={dashOffset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-linear"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-xl font-bold font-mono tabular-nums ${isUrgent ? 'text-red-400' : 'text-white'}`}>
                            {secondsLeft}
                        </span>
                    </div>
                </div>

                {/* Label & controls */}
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">
                        Tiempo de descanso
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onSubtract}
                            className="w-9 h-9 bg-gray-800 hover:bg-gray-700 active:scale-95 rounded-xl flex items-center justify-center text-gray-300 transition-all"
                            title="-15s"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-xs text-gray-500 font-medium">±15s</span>
                        <button
                            onClick={onAdd}
                            className="w-9 h-9 bg-gray-800 hover:bg-gray-700 active:scale-95 rounded-xl flex items-center justify-center text-gray-300 transition-all"
                            title="+15s"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Skip */}
                <button
                    onClick={onSkip}
                    className="flex flex-col items-center gap-1 text-gray-400 hover:text-white active:scale-95 transition-all p-2 rounded-xl hover:bg-gray-800"
                >
                    <SkipForward className="w-5 h-5" />
                    <span className="text-xs">Saltar</span>
                </button>
            </div>
        </div>
    );
}
