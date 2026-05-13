import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Trophy, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const ICONS = {
    achievement: Trophy,
    success:     CheckCircle,
    warning:     AlertTriangle,
    info:        Info,
};

const STYLES = {
    achievement: 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white',
    success:     'bg-gradient-to-r from-emerald-500 to-teal-500 text-white',
    warning:     'bg-white dark:bg-gray-800 border border-yellow-300 dark:border-yellow-700 text-gray-900 dark:text-white',
    info:        'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white',
};

const ICON_STYLES = {
    achievement: 'text-white',
    success:     'text-white',
    warning:     'text-yellow-500',
    info:        'text-blue-500',
};

export default function ToastContainer() {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed bottom-6 right-4 z-[9999] flex flex-col gap-3 items-end pointer-events-none">
            <AnimatePresence>
                {toasts.map(toast => {
                    const Icon = ICONS[toast.type] || Info;
                    return (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 60, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 60, scale: 0.9 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-2xl shadow-2xl max-w-xs w-full ${STYLES[toast.type] || STYLES.info}`}
                        >
                            <div className="flex-shrink-0 mt-0.5">
                                <Icon className={`w-5 h-5 ${ICON_STYLES[toast.type] || ICON_STYLES.info}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                {toast.title && (
                                    <p className="font-bold text-sm leading-tight">{toast.title}</p>
                                )}
                                <p className="text-sm leading-snug opacity-90">{toast.message}</p>
                            </div>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity mt-0.5"
                                aria-label="Cerrar"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
