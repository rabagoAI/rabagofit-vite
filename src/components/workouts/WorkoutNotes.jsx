import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';
import { useWorkout } from '../../context/WorkoutContext';

export default function WorkoutNotes() {
    const { activeWorkout, updateMetadata } = useWorkout();
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (activeWorkout?.notes) {
            setNotes(activeWorkout.notes);
        }
    }, [activeWorkout]);

    const handleChange = (e) => {
        const newVal = e.target.value;
        setNotes(newVal);
        // Debounce update to context/storage could be better, but simple is fine for now
        updateMetadata('notes', newVal);
    };

    if (!activeWorkout) return null;

    return (
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800 shadow-sm mt-6">
            <div className="flex items-center gap-2 mb-3 text-gray-900 dark:text-white font-bold">
                <FileText className="w-4 h-4 text-emerald-500" />
                Notas de la sesión
            </div>
            <textarea
                value={notes}
                onChange={handleChange}
                placeholder="¿Cómo te sentiste? ¿Alguna molestia? ¿Récord personal?"
                className="w-full h-24 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-sm text-gray-700 dark:text-gray-300 resize-none focus:ring-2 focus:ring-emerald-500 focus:outline-none border-none placeholder:text-gray-400"
            />
        </div>
    );
}
