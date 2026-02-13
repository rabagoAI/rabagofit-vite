import { z } from 'zod';

export const SetSchema = z.object({
    id: z.number().or(z.string()).optional(),
    weight: z.number().min(0),
    reps: z.number().min(0),
    completed: z.boolean().default(false)
});

export const ExerciseSchema = z.object({
    id: z.number().or(z.string()).optional(),
    name: z.string().min(1, "El nombre del ejercicio es obligatorio"),
    sets: z.array(SetSchema).default([])
});

export const WorkoutSchema = z.object({
    id: z.number().or(z.string()),
    name: z.string().min(1, "El nombre de la rutina es obligatorio"),
    startTime: z.string(), // ISO string
    endTime: z.string().optional(),
    durationSeconds: z.number().default(0),
    finished: z.boolean().default(false),
    exercises: z.array(ExerciseSchema).default([])
});
