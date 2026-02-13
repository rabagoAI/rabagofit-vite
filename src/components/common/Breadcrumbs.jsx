import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    if (pathnames.length === 0) return null;

    const routeNameMap = {
        'workouts': 'Entrenamientos',
        'exercises': 'Ejercicios',
        'routines': 'Rutinas',
        'progress': 'Progreso',
        'history': 'Historial'
    };

    return (
        <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <li>
                    <Link
                        to="/"
                        className="flex items-center hover:text-emerald-500 transition-colors bg-gray-100 dark:bg-gray-800/50 p-1.5 rounded-md"
                    >
                        <Home className="w-4 h-4" />
                        <span className="sr-only">Inicio</span>
                    </Link>
                </li>
                {pathnames.map((value, index) => {
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;
                    const name = routeNameMap[value] || value.charAt(0).toUpperCase() + value.slice(1);

                    return (
                        <li key={to} className="flex items-center">
                            <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
                            {isLast ? (
                                <span className="font-semibold text-gray-900 dark:text-white pointer-events-none" aria-current="page">
                                    {name}
                                </span>
                            ) : (
                                <Link
                                    to={to}
                                    className="hover:text-emerald-500 transition-colors"
                                >
                                    {name}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
