import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Heart } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const version = "2.1.0";

    return (
        <footer className="relative z-10 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 pt-8 pb-4 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    {/* Brand Column */}
                    <div>
                        <Link to="/" className="text-xl font-black bg-gradient-to-r from-emerald-500 to-blue-500 bg-clip-text text-transparent mb-3 inline-block">
                            RabagoFit
                        </Link>
                        <p className="text-gray-500 dark:text-gray-400 mb-4 text-xs leading-relaxed">
                            Potenciando tu rendimiento fitness con tecnología inteligente y rutinas personalizadas.
                        </p>
                        <div className="flex space-x-3">
                            <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                                <span className="sr-only">Instagram</span>
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                                <span className="sr-only">Twitter</span>
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                                <span className="sr-only">Facebook</span>
                                <Facebook className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Links Column */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">Navegación</h3>
                            <ul className="space-y-2 text-xs">
                                <li>
                                    <Link to="/workouts" className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors">Entrenamientos</Link>
                                </li>
                                <li>
                                    <Link to="/exercises" className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors">Ejercicios</Link>
                                </li>
                                <li>
                                    <Link to="/routines" className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors">Rutinas</Link>
                                </li>
                                <li>
                                    <Link to="/progress" className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors">Progreso</Link>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">Soporte</h3>
                            <ul className="space-y-2 text-xs">
                                <li>
                                    <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors">Centro de Ayuda</a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors">Términos de Servicio</a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors">Política de Privacidad</a>
                                </li>
                                <li>
                                    <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors">Contacto</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-800 pt-4 flex flex-col md:flex-row justify-between items-center gap-2">
                    <p className="text-gray-400 text-xs">
                        &copy; {currentYear} RabagoFit Inc. Todos los derechos reservados.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                            Hecho con <Heart className="w-3 h-3 text-red-500 fill-current" /> por Paco
                        </span>
                        <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-[10px]">
                            v{version}
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
