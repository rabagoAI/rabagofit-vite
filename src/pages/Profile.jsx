import React, { useState, useRef } from 'react';
import {
    User, Mail, Ruler, Calendar, Save, Download, Upload,
    Trash2, AlertTriangle, Sun, Moon, Monitor, Coffee, Eye,
    CheckCircle, X
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useTheme } from '../context/ThemeContext';

const THEME_OPTIONS = [
    { id: 'light',         label: 'Claro',          icon: Sun },
    { id: 'dark',          label: 'Oscuro',          icon: Moon },
    { id: 'system',        label: 'Sistema',         icon: Monitor },
    { id: 'sepia',         label: 'Sepia',           icon: Coffee },
    { id: 'high-contrast', label: 'Alto Contraste',  icon: Eye },
];

const GENDER_OPTIONS = [
    { value: 'male',   label: 'Masculino' },
    { value: 'female', label: 'Femenino' },
    { value: 'other',  label: 'Otro' },
];

export default function Profile() {
    const { userProfile, updateProfile, exportUserData, importUserData, resetUserData } = useUser();
    const { theme, setTheme } = useTheme();

    const [form, setForm] = useState({
        name:      userProfile.name      || '',
        email:     userProfile.email     || '',
        height:    userProfile.height    || '',
        gender:    userProfile.gender    || '',
        birthDate: userProfile.birthDate || '',
    });
    const [saved, setSaved] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setSaved(false);
    };

    const handleSave = (e) => {
        e.preventDefault();
        updateProfile({
            ...form,
            height: form.height ? parseFloat(form.height) : undefined,
            email:  form.email  || undefined,
            gender: form.gender || undefined,
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const handleImport = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await importUserData(file);
        e.target.value = '';
    };

    return (
        <div className="max-w-2xl mx-auto pb-16">
            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-1">Perfil y Ajustes</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Personaliza tu cuenta y gestiona tus datos</p>
            </div>

            {/* Profile Form */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-500" />
                    Datos Personales
                </h3>

                <form onSubmit={handleSave} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-gray-900 dark:text-white"
                            placeholder="Tu nombre"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> Email</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-gray-900 dark:text-white"
                            placeholder="correo@ejemplo.com"
                        />
                    </div>

                    {/* Height + Gender */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                <span className="flex items-center gap-1.5"><Ruler className="w-4 h-4" /> Altura (cm)</span>
                            </label>
                            <input
                                type="number"
                                name="height"
                                value={form.height}
                                onChange={handleChange}
                                min="100"
                                max="250"
                                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-gray-900 dark:text-white"
                                placeholder="175"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Género
                            </label>
                            <select
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-gray-900 dark:text-white"
                            >
                                <option value="">Sin especificar</option>
                                {GENDER_OPTIONS.map(o => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Birth Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Fecha de nacimiento</span>
                        </label>
                        <input
                            type="date"
                            name="birthDate"
                            value={form.birthDate}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-gray-900 dark:text-white"
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                            saved
                                ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                        }`}
                    >
                        {saved ? (
                            <><CheckCircle className="w-5 h-5" /> Guardado</>
                        ) : (
                            <><Save className="w-5 h-5" /> Guardar Cambios</>
                        )}
                    </button>
                </form>
            </section>

            {/* Theme */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                    <Sun className="w-5 h-5 text-yellow-500" />
                    Apariencia
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {THEME_OPTIONS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setTheme(id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all font-medium text-sm ${
                                theme === id
                                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                        >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            {label}
                        </button>
                    ))}
                </div>
            </section>

            {/* Data Management */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                    <Download className="w-5 h-5 text-blue-500" />
                    Gestión de Datos
                </h3>
                <div className="space-y-3">
                    <button
                        onClick={exportUserData}
                        className="w-full flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-colors text-left"
                    >
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Download className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900 dark:text-white text-sm">Exportar copia de seguridad</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Descarga un archivo .json con tu perfil y estadísticas</div>
                        </div>
                    </button>

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-colors text-left"
                    >
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Upload className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900 dark:text-white text-sm">Importar copia de seguridad</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Restaura tus datos desde un archivo .json</div>
                        </div>
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={handleImport}
                    />
                </div>
            </section>

            {/* Danger Zone */}
            <section className="bg-white dark:bg-gray-800 rounded-2xl border border-red-200 dark:border-red-900/40 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Zona de Peligro
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Borra permanentemente todos tus datos locales: perfil, historial, estadísticas y logros. No se puede deshacer.
                </p>
                <button
                    onClick={() => setShowResetConfirm(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors text-sm"
                >
                    <Trash2 className="w-4 h-4" />
                    Borrar todos los datos
                </button>
            </section>

            {/* Reset Confirmation Modal */}
            {showResetConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setShowResetConfirm(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="flex justify-center mb-4">
                            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-7 h-7 text-red-500" />
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 text-center">¿Borrar todo?</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-6">
                            Se eliminarán todos tus datos locales. Esta acción es irreversible.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowResetConfirm(false)}
                                className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => { setShowResetConfirm(false); resetUserData(); }}
                                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
                            >
                                Sí, borrar todo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
