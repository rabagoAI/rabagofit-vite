import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Menu, Dumbbell, User, LogOut, Sun, Moon, Settings,
    BarChart2, Calendar, LayoutDashboard, X, Bell, Monitor, Eye, Coffee
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const { theme, setTheme, activeTheme } = useTheme();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    // Refs for focus management
    const mobileMenuRef = useRef(null);
    const profileMenuRef = useRef(null);
    const themeMenuRef = useRef(null);

    // Handle scroll effect for navbar
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menus on route change or click outside
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsProfileOpen(false);
        setIsThemeMenuOpen(false);
    }, [location.pathname]);

    // Click outside listener
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
                setIsThemeMenuOpen(false);
            }
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMobileMenuOpen]);

    const isActive = (path) => {
        return location.pathname === path
            ? 'text-emerald-500 font-medium'
            : 'text-gray-500 dark:text-gray-400 hover:text-emerald-500 transition-colors';
    };

    const NavLink = ({ to, children }) => (
        <Link to={to} className={`text-sm tracking-wide relative group py-2 ${isActive(to)}`}>
            {children}
            {location.pathname === to && (
                <motion.span
                    layoutId="underline"
                    className="absolute left-0 top-full block h-0.5 w-full bg-emerald-500"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
            <span className="absolute left-0 top-full block h-0.5 w-0 bg-emerald-500 transition-all duration-300 group-hover:w-full opacity-50"></span>
        </Link>
    );

    const MobileLink = ({ to, children, icon: Icon }) => (
        <Link
            to={to}
            className={`px-4 py-3 rounded-xl flex items-center gap-4 transition-all ${location.pathname === to
                ? 'bg-emerald-500/10 text-emerald-500 font-bold border-l-4 border-emerald-500'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            onClick={() => setIsMobileMenuOpen(false)}
        >
            {Icon && <Icon className={`w-5 h-5 ${location.pathname === to ? 'text-emerald-500' : 'text-gray-400'}`} />}
            {children}
        </Link>
    );

    const themeOptions = [
        { id: 'light', label: 'Claro', icon: Sun },
        { id: 'dark', label: 'Oscuro', icon: Moon },
        { id: 'system', label: 'Sistema', icon: Monitor },
        { id: 'sepia', label: 'Sepia', icon: Coffee },
        { id: 'high-contrast', label: 'Alto Contraste', icon: Eye },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 transition-all duration-300 ${isMobileMenuOpen ? 'z-[10000]' : 'z-50'} ${scrolled
                ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm'
                : 'bg-transparent border-b border-transparent'
                }`}
            role="navigation"
            aria-label="Main Navigation"
        >
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group relative z-50">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform duration-300">
                            <Dumbbell className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            <span className="text-gray-900 dark:text-white">Rabago</span>
                            <span className="text-emerald-500">Fit</span>
                        </h1>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <NavLink to="/">Dashboard</NavLink>
                        <NavLink to="/workouts">Entrenamientos</NavLink>
                        <NavLink to="/exercises">Ejercicios</NavLink>
                        <NavLink to="/progress">Progreso</NavLink>
                        <NavLink to="/routines">Rutinas</NavLink>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-4 relative z-50">

                        {/* Theme Dropdown */}
                        <div className="relative hidden md:block" ref={themeMenuRef}>
                            <button
                                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                aria-label="Cambiar tema"
                            >
                                {activeTheme === 'dark' ? <Moon className="w-5 h-5" /> :
                                    activeTheme === 'sepia' ? <Coffee className="w-5 h-5" /> :
                                        activeTheme === 'high-contrast' ? <Eye className="w-5 h-5" /> :
                                            <Sun className="w-5 h-5" />}
                            </button>
                            <AnimatePresence>
                                {isThemeMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden py-1 z-50"
                                    >
                                        <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">Tema</div>
                                        {themeOptions.map((option) => (
                                            <button
                                                key={option.id}
                                                onClick={() => { setTheme(option.id); setIsThemeMenuOpen(false); }}
                                                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 transition-colors ${theme === option.id ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                            >
                                                <option.icon className="w-4 h-4" />
                                                {option.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Notification Bell with Badge */}
                        <button className="hidden md:flex p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative focus:outline-none focus:ring-2 focus:ring-emerald-500">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                        </button>

                        <div className="relative" ref={profileMenuRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="w-9 h-9 bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-600 dark:to-gray-800 rounded-full flex items-center justify-center ring-2 ring-transparent hover:ring-emerald-500 transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <span className="text-sm font-bold text-white">U</span>
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 overflow-hidden"
                                    >
                                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                                            <p className="text-sm text-gray-900 dark:text-white font-bold">Usuario</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">usuario@ejemplo.com</p>
                                        </div>

                                        <div className="p-2">
                                            <a href="#" className="flex px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors items-center gap-3">
                                                <Settings className="w-4 h-4" />
                                                Configuración
                                            </a>
                                            <button className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 rounded-xl transition-colors flex items-center gap-3 mt-1">
                                                <LogOut className="w-4 h-4" />
                                                Cerrar Sesión
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden text-gray-600 dark:text-gray-300 hover:text-emerald-500 transition-colors p-1 relative z-50"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl z-[60] md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <div className="flex flex-col h-full pt-28 px-6 pb-8 overflow-y-auto">
                            <div className="space-y-2">
                                <MobileLink to="/" icon={LayoutDashboard}>Dashboard</MobileLink>
                                <MobileLink to="/workouts" icon={Dumbbell}>Entrenamientos</MobileLink>
                                <MobileLink to="/exercises" icon={Dumbbell}>Ejercicios</MobileLink>
                                <MobileLink to="/progress" icon={BarChart2}>Progreso</MobileLink>
                                <MobileLink to="/routines" icon={Calendar}>Rutinas</MobileLink>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Temas</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {themeOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={(e) => { e.stopPropagation(); setTheme(option.id); }}
                                            className={`flex items-center gap-2 p-3 rounded-xl border ${theme === option.id ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400' : 'bg-gray-50 dark:bg-gray-800 border-transparent text-gray-600 dark:text-gray-400'}`}
                                        >
                                            <option.icon className="w-4 h-4" />
                                            <span className="text-sm font-medium">{option.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
