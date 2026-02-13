import { useState, useEffect, useRef, useCallback } from 'react';

// Simple beep based on oscillator
const playBeep = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
        console.error("Audio beep failed", e);
    }
};

export function useTimer(initialSeconds = 0) {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [isRunning, setIsRunning] = useState(false);
    const [laps, setLaps] = useState([]);
    const [goal, setGoal] = useState(null); // Target seconds
    const [history, setHistory] = useState([]); // List of completed sessions { duration, date }

    // Settings
    const [settings, setSettings] = useState({
        soundEnabled: true,
        vibrationEnabled: true
    });

    const intervalRef = useRef(null);
    const goalReachedRef = useRef(false);

    const alert = useCallback(() => {
        if (settings.vibrationEnabled && navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
        }
        if (settings.soundEnabled) {
            playBeep();
        }
    }, [settings]);

    const start = useCallback(() => {
        if (!isRunning) {
            setIsRunning(true);
            intervalRef.current = setInterval(() => {
                setSeconds(s => {
                    const next = s + 1;
                    // Check Goal
                    if (goal && next >= goal && !goalReachedRef.current) {
                        goalReachedRef.current = true;
                        alert();
                    }
                    return next;
                });
            }, 1000);
        }
    }, [isRunning, goal, alert]);

    const pause = useCallback(() => {
        if (isRunning) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
        }
    }, [isRunning]);

    const reset = useCallback(() => {
        clearInterval(intervalRef.current);

        // Save to history if duration was significant (> 0)
        if (seconds > 0) {
            setHistory(h => [...h, { duration: seconds, date: new Date().toISOString() }]);
        }

        setSeconds(0);
        setLaps([]);
        setIsRunning(false);
        goalReachedRef.current = false;
    }, [seconds]);

    // Enhanced Feature: Laps
    const lap = useCallback(() => {
        const now = seconds;
        const lastLapTime = laps.length > 0 ? laps[laps.length - 1].totalTime : 0;
        const split = now - lastLapTime;

        setLaps(prev => [...prev, {
            id: Date.now(),
            totalTime: now,
            splitTime: split
        }]);
    }, [seconds, laps]);

    // Enhanced Feature: Update Settings
    const configure = useCallback((newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);

    // Helper: Restore state functionality (used by WorkoutContext context restoration potentially)
    // Though usually context manages the "seconds" value restoration separately, 
    // we expose setSeconds just in case or allow initialSeconds prop.

    const formatTime = (totalSeconds) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return {
        seconds,
        isRunning,
        start,
        pause,
        reset,
        formatTime,
        // New Features
        laps,
        lap,
        history,
        goal,
        setGoal,
        configure,
        settings
    };
}
