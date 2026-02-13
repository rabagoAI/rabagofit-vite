import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import SkipLink from '../common/SkipLink';
import Breadcrumbs from '../common/Breadcrumbs';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout() {
    const location = useLocation();

    // Rutas donde no queremos mostrar breadcrumbs (ej. Dashboard raíz si se prefiere minimalista, aunque aquí los mostramos si no es root)
    const showBreadcrumbs = location.pathname !== '/';

    return (
        <div className="min-h-screen grid-pattern transition-colors duration-300 bg-gray-50 dark:bg-[#0a0f1c] text-gray-900 dark:text-white flex flex-col overflow-x-hidden relative">
            <SkipLink />

            {/* Ambient Background Lights - Optimized with lower opacity */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[100px] animate-blob mix-blend-multiply dark:mix-blend-screen"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply dark:mix-blend-screen"></div>
                <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-multiply dark:mix-blend-screen"></div>
            </div>

            <div className="fixed inset-0 bg-gradient-radial opacity-40 pointer-events-none"></div>

            <Navbar />

            <main id="main-content" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 flex-grow w-full">
                {showBreadcrumbs && (
                    <div className="mb-4 animate-in fade-in slide-in-from-left-4 duration-500">
                        <Breadcrumbs />
                    </div>
                )}

                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="w-full"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>

            <Footer />
        </div>
    );
}
