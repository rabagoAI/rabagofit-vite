import React from 'react'
import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 p-4">
            <div className="text-center space-y-6 max-w-md w-full">
                <h1 className="text-9xl font-bold text-emerald-500">404</h1>
                <h2 className="text-3xl font-semibold">Página no encontrada</h2>
                <p className="text-slate-400">
                    Lo sentimos, la página que buscas no existe o ha sido movida.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
                >
                    <Home className="w-5 h-5" />
                    Volver al Inicio
                </Link>
            </div>
        </div>
    )
}

export default NotFound
