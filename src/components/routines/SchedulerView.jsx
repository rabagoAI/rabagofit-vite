import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

// Simple mock calendar - In real app, date-fns logic would be more robust
const WEEK_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export default function SchedulerView({ myRoutines }) {
    // This is a simplified visual representation.
    // A full scheduler needs persistent "assignments" of routines to dates.
    // For now, we'll visualize based on the static "schedule" array in routines if available
    // OR just a placeholder for the "Schedule" feature requested.

    // Improving: Let's assume user wants to assign routines to days of the week.
    // We can show a grid of the week and drag routines onto it? 
    // Or simpler: Just a weekly list view.

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-emerald-500" />
                    Calendario Semanal
                </h3>
                <div className="flex gap-2">
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
                    <span className="text-sm font-medium pt-1">Esta Semana</span>
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"><ChevronRight className="w-5 h-5" /></button>
                </div>
            </div>

            <div className="grid grid-cols-7 divide-x divide-gray-100 dark:divide-gray-800">
                {WEEK_DAYS.map((day, i) => (
                    <div key={day} className="min-h-[200px] p-4 bg-gray-50/50 dark:bg-gray-800/20">
                        <div className="text-xs font-bold text-gray-400 uppercase mb-4 text-center">{day}</div>

                        {/* Mock Placed Routines */}
                        {/* Logic: Find routines that have this day in their 'schedule' array? Or just random for demo */}
                        {myRoutines
                            .filter(r => r.schedule && r.schedule[i] && r.schedule[i] !== 'Descanso')
                            .map(r => (
                                <div key={r.id} className="bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm text-xs mb-2 cursor-pointer hover:border-emerald-500 transition-colors">
                                    <div className="font-bold text-gray-900 dark:text-white truncate">{r.name}</div>
                                    <div className="text-gray-500">{r.duration}</div>
                                </div>
                            ))}

                        {myRoutines.filter(r => r.schedule && r.schedule[i] && r.schedule[i] !== 'Descanso').length === 0 && (
                            <div className="h-full flex items-center justify-center">
                                <div className="w-full h-full border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-lg flex items-center justify-center text-gray-300 hover:border-emerald-500/30 hover:text-emerald-500 transition-colors cursor-pointer">
                                    <span className="text-xs font-bold">+</span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
