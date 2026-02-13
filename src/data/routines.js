export const routines = [
    // --- HYPERTROPHY / BUILD MUSCLE ---
    {
        id: 'push_pull_legs',
        name: "Push Pull Legs (Frequencia 2)",
        goal: "mass",
        level: "intermediate",
        duration: "60-75 min",
        days: 6,
        difficulty: "medium",
        description: "El estándar de oro para estética y fuerza. Divide el cuerpo en patrones de movimiento.",
        image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80",
        schedule: ["Push", "Pull", "Legs", "Push", "Pull", "Legs", "Descanso"],
        exercises: [
            { name: "Press de Banca", sets: 4, reps: "8-10", rest: "90s" },
            { name: "Press Militar", sets: 3, reps: "10-12", rest: "90s" },
            { name: "Fondos en Paralelas", sets: 3, reps: "10-12", rest: "60s" },
            { name: "Elevaciones Laterales", sets: 3, reps: "15", rest: "60s" },
            { name: "Extensiones Tríceps", sets: 3, reps: "12-15", rest: "60s" }
        ]
    },
    {
        id: 'bro_split',
        name: "Bro Split Classics",
        goal: "mass",
        level: "advanced",
        duration: "60 min",
        days: 5,
        difficulty: "medium",
        description: "Enfoque de la vieja escuela. Un grupo muscular por día para máxima congestión.",
        image: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&q=80",
        schedule: ["Pecho", "Espalda", "Pierna", "Hombro", "Brazos", "Descanso", "Descanso"],
        exercises: [
            { name: "Press Banca Plano", sets: 4, reps: "8", rest: "120s" },
            { name: "Press Inclinado Mancuernas", sets: 3, reps: "10", rest: "90s" },
            { name: "Aperturas Mancuernas", sets: 3, reps: "12-15", rest: "60s" },
            { name: "Cruce de Poleas", sets: 3, reps: "15", rest: "60s" },
            { name: "Fondos", sets: 3, reps: "Fallo", rest: "90s" }
        ]
    },
    {
        id: 'upper_lower',
        name: "Torso / Pierna",
        goal: "mass",
        level: "intermediate",
        duration: "60 min",
        days: 4,
        difficulty: "medium",
        description: "Equilibrio perfecto entre entrenamiento y recuperación. Ideal para ganar masa sostenible.",
        image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
        schedule: ["Torso A", "Pierna A", "Descanso", "Torso B", "Pierna B", "Descanso", "Descanso"],
        exercises: [
            { name: "Press Inclinado", sets: 4, reps: "8", rest: "90s" },
            { name: "Remo con Barra", sets: 4, reps: "8-10", rest: "90s" },
            { name: "Press Militar Mancuernas", sets: 3, reps: "12", rest: "90s" },
            { name: "Jalón al Pecho", sets: 3, reps: "12", rest: "60s" },
            { name: "Curl Bíceps", sets: 3, reps: "12-15", rest: "60s" },
            { name: "Press Francés", sets: 3, reps: "12-15", rest: "60s" }
        ]
    },
    {
        id: 'phul_power',
        name: "P.H.U.L. (Poder/Hipertrofia)",
        goal: "strength",
        level: "advanced",
        duration: "75 min",
        days: 4,
        difficulty: "hard",
        description: "Power Hypertrophy Upper Lower. Combina días de fuerza bajos reps con días de hipertrofia.",
        image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80",
        schedule: ["Torso Fuerza", "Pierna Fuerza", "Descanso", "Torso Hipertrofia", "Pierna Hipertrofia", "Descanso", "Descanso"],
        exercises: [
            { name: "Press Banca", sets: 3, reps: "3-5", rest: "180s" },
            { name: "Remo Pendlay", sets: 3, reps: "3-5", rest: "180s" },
            { name: "Press Militar", sets: 2, reps: "5-8", rest: "120s" },
            { name: "Dominadas Lastradas", sets: 2, reps: "5-8", rest: "120s" }
        ]
    },

    // --- STRENGTH ---
    {
        id: 'stronglifts_5x5',
        name: "StrongLifts 5x5",
        goal: "strength",
        level: "beginner",
        duration: "45-60 min",
        days: 3,
        difficulty: "medium",
        description: "El programa clásico para construir una base sólida de fuerza usando ejercicios compuestos.",
        image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
        schedule: ["A", "Descanso", "B", "Descanso", "A", "Descanso", "Descanso"],
        exercises: [
            { name: "Sentadilla Trasera", sets: 5, reps: "5", rest: "180s" },
            { name: "Press Banca", sets: 5, reps: "5", rest: "180s" },
            { name: "Remo con Barra", sets: 5, reps: "5", rest: "180s" }
        ]
    },
    {
        id: 'starting_strength',
        name: "Fuerza Inicial",
        goal: "strength",
        level: "beginner",
        duration: "45-60 min",
        days: 3,
        difficulty: "easy",
        description: "Focalizado en aprender la técnica perfecta y progresión lineal simple.",
        image: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?w=800&q=80",
        schedule: ["A", "Descanso", "B", "Descanso", "A", "Descanso", "Descanso"],
        exercises: [
            { name: "Sentadilla", sets: 3, reps: "5", rest: "180s" },
            { name: "Press Militar", sets: 3, reps: "5", rest: "180s" },
            { name: "Peso Muerto", sets: 1, reps: "5", rest: "180s" }
        ]
    },

    // --- HOME / SPECIALIZED ---
    {
        id: 'full_body_beginner',
        name: "Full Body Principiante",
        goal: "general",
        level: "beginner",
        duration: "45 min",
        days: 3,
        difficulty: "easy",
        description: "Entrenamiento de cuerpo completo ideal para tus primeros meses en el gimnasio.",
        image: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&q=80",
        schedule: ["Full Body", "Descanso", "Full Body", "Descanso", "Full Body", "Descanso", "Descanso"],
        exercises: [
            { name: "Goblet Squat", sets: 3, reps: "10-12", rest: "60s" },
            { name: "Flexiones", sets: 3, reps: "8-12", rest: "60s" },
            { name: "Jalón al Pecho", sets: 3, reps: "12", rest: "60s" },
            { name: "Zancadas", sets: 2, reps: "12/pierna", rest: "60s" },
            { name: "Plancha", sets: 3, reps: "30s", rest: "45s" }
        ]
    },
    {
        id: 'dumbbell_home',
        name: "Mancuernas en Casa",
        goal: "general",
        level: "beginner",
        duration: "45 min",
        days: 4,
        difficulty: "medium",
        description: "Sin excusas. Rutina completa usando solo un par de mancuernas.",
        image: "https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=800&q=80",
        schedule: ["Torso", "Pierna", "Descanso", "Torso", "Pierna", "Descanso", "Descanso"],
        exercises: [
            { name: "Sentadilla Goblet", sets: 4, reps: "12", rest: "60s" },
            { name: "Press Suelo Mancuernas", sets: 4, reps: "12", rest: "60s" },
            { name: "Remo Mancuerna", sets: 4, reps: "12/lado", rest: "60s" },
            { name: "Press Militar Unilateral", sets: 3, reps: "10", rest: "60s" },
            { name: "Peso Muerto Rumano Mancuernas", sets: 3, reps: "12", rest: "60s" }
        ]
    },
    {
        id: 'glute_focus',
        name: "Glute Focus (Énfasis Glúteo)",
        goal: "aesthetics",
        level: "intermediate",
        duration: "60 min",
        days: 3,
        difficulty: "hard",
        description: "Programa especializado para el desarrollo de la cadena posterior y glúteos.",
        image: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=800&q=80",
        schedule: ["Glúteo/Femoral", "Descanso", "Glúteo/Cuádriceps", "Descanso", "Glúteo Completo", "Descanso", "Descanso"],
        exercises: [
            { name: "Hip Thrust", sets: 4, reps: "8-12", rest: "120s" },
            { name: "Peso Muerto Rumano", sets: 3, reps: "10", rest: "90s" },
            { name: "Zancadas Búlgaras", sets: 3, reps: "10-12", rest: "90s" },
            { name: "Patada de Glúteo", sets: 3, reps: "15-20", rest: "45s" },
            { name: "Abducciones sentado", sets: 3, reps: "20", rest: "45s" }
        ]
    },
    {
        id: 'calisthenics_basics',
        name: "Calistenia Básica",
        goal: "strength",
        level: "beginner",
        duration: "50 min",
        days: 3,
        difficulty: "medium",
        description: "Domina tu peso corporal con los movimientos fundamentales.",
        image: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?w=800&q=80",
        schedule: ["Full Body", "Descanso", "Full Body", "Descanso", "Full Body", "Descanso", "Descanso"],
        exercises: [
            { name: "Dominadas (o asistidas)", sets: 3, reps: "5-10", rest: "120s" },
            { name: "Flexiones Diamante", sets: 3, reps: "10-15", rest: "90s" },
            { name: "Sentadillas Air", sets: 4, reps: "20", rest: "60s" },
            { name: "Fondos", sets: 3, reps: "8-12", rest: "90s" },
            { name: "Hanging Leg Raises", sets: 3, reps: "10", rest: "90s" }
        ]
    },
    {
        id: 'hiit_cardio_burner',
        name: "HIIT Quemagrasa",
        goal: "fat_loss",
        level: "all_levels",
        duration: "30 min",
        days: 4,
        difficulty: "hard",
        description: "Entrenamiento interválico de alta intensidad para acelerar el metabolismo.",
        image: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=800&q=80",
        schedule: ["HIIT", "Descanso", "HIIT", "Descanso", "HIIT", "HIIT", "Descanso"],
        exercises: [
            { name: "Burpees", sets: 4, reps: "30s", rest: "30s" },
            { name: "Mountain Climbers", sets: 4, reps: "30s", rest: "30s" },
            { name: "Salto a la Comba", sets: 4, reps: "45s", rest: "15s" },
            { name: "Jumping Jacks", sets: 4, reps: "45s", rest: "15s" },
            { name: "Sprints en sitio", sets: 4, reps: "20s", rest: "40s" }
        ]
    }
];
