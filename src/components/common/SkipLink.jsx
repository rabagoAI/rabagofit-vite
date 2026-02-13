import React from 'react';

const SkipLink = () => {
    return (
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg shadow-lg outline-none ring-2 ring-white dark:ring-gray-900 focus:outline-none transition-transform"
        >
            Saltar al contenido principal
        </a>
    );
};

export default SkipLink;
