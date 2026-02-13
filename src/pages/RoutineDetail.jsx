import React, { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { routines as templateRoutines } from '../data/routines';
import { useWorkout } from '../context/WorkoutContext';
import { ArrowLeft, Clock, Activity, Dumbbell, Play, Calendar } from 'lucide-react';

export default function RoutineDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { startWorkout } = useWorkout();

    // Fetch routine logic (Mock + Templates)
    const routine = useMemo(() => {
        // First check templates
        const template = templateRoutines.find(r => r.id === parseInt(id) || r.id === id);
        if (template) return template;

        // Then check user routines
        try {
            const saved = localStorage.getItem('rabago_my_routines');
            const myRoutines = saved ? JSON.parse(saved) : [];
            return myRoutines.find(r => r.id === parseInt(id) || r.id === id);
        } catch {
            return null;
        }
    }, [id]);

    if (!routine) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Rutina no encontrada</h2>
                <Link to="/routines" className="text-emerald-500 hover:underline">Volver a Rutinas</Link>
            </div>
        );
    }

    const handleStart = () => {
        // Transform routine exercises to active workout format
        const initialExercises = (routine.exercises || []).map(ex => {
            const exerciseName = typeof ex === 'string' ? ex : ex.name;
            const targetSets = typeof ex !== 'string' && ex.sets ? ex.sets : 3;
            // Create initial sets
            const sets = Array(targetSets).fill(0).map((_, i) => ({
                id: i + 1,
                weight: 0,
                reps: typeof ex !== 'string' && ex.reps ? ex.reps : 0,
                completed: false
            }));

            return {
                id: Date.now() + Math.random(), // Temp unique ID
                name: exerciseName,
                sets: sets
            };
        });

        startWorkout(routine.name, initialExercises);
        navigate('/workouts');
    };

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver
            </button>

            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-xl">
                <div className={`h-48 bg-gradient-to-r ${routine.color || 'from-emerald-500 to-teal-600'} relative`}>
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute bottom-0 left-0 p-8">
                        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-wider mb-2">
                            {routine.goal === 'mass' ? 'Hipertrofia' : routine.goal === 'strength' ? 'Fuerza' : 'General'}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{routine.title}</h1>
                        <p className="text-white/90 max-w-xl">{routine.description}</p>
                    </div>
                </div>

                <div className="p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                        <div className="flex flex-col items-center justify-center text-center">
                            <Clock className="w-6 h-6 text-blue-500 mb-2" />
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Duración</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">{routine.duration}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center">
                            <Activity className="w-6 h-6 text-emerald-500 mb-2" />
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Nivel</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white capitalize">{routine.difficulty}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center">
                            <Dumbbell className="w-6 h-6 text-purple-500 mb-2" />
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Ejercicios</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">{routine.exercises ? routine.exercises.length : 0}</span>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center">
                            <Calendar className="w-6 h-6 text-orange-500 mb-2" />
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Frecuencia</span>
                            <span className="text-lg font-bold text-gray-900 dark:text-white">{routine.frequency || 'N/A'}</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Ejercicios de la Rutina</h3>
                        <div className="space-y-3">
                            {routine.exercises && routine.exercises.map((ex, idx) => (
                                <div key={idx} className="flex items-center p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-700/50">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm mr-4">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="font-bold text-gray-900 dark:text-white">
                                            {/* Handling string or object exercises */}
                                            {typeof ex === 'string' ? ex : ex.name}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {typeof ex !== 'string' && ex.sets ? `${ex.sets} series x ${ex.reps} reps` : 'Series y reps por definir'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleStart}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transform hover:-translate-y-1"
                    >
                        <Play className="w-6 h-6" fill="currentColor" />
                        Comenzar Rutina Ahora
                    </button>
                </div>
            </div>
        </div>
    );
}
