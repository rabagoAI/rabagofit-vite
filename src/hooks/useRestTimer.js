import { useState, useEffect, useRef, useCallback } from 'react';

const playFinishAlert = () => {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        [0, 0.25, 0.5].forEach((delay, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.value = 440 + i * 220;
            gain.gain.setValueAtTime(0.4, ctx.currentTime + delay);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.2);
            osc.start(ctx.currentTime + delay);
            osc.stop(ctx.currentTime + delay + 0.25);
        });
    } catch { }
};

export function useRestTimer(defaultDuration = 90) {
    const [isActive, setIsActive] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(defaultDuration);
    const [duration, setDuration] = useState(defaultDuration);
    const intervalRef = useRef(null);

    const stop = useCallback(() => {
        clearInterval(intervalRef.current);
        setIsActive(false);
    }, []);

    const start = useCallback((customDuration) => {
        const d = customDuration ?? duration;
        clearInterval(intervalRef.current);
        setDuration(d);
        setSecondsLeft(d);
        setIsActive(true);

        intervalRef.current = setInterval(() => {
            setSecondsLeft(s => {
                if (s <= 1) {
                    clearInterval(intervalRef.current);
                    setIsActive(false);
                    playFinishAlert();
                    if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 200]);
                    return 0;
                }
                return s - 1;
            });
        }, 1000);
    }, [duration]);

    const skip = useCallback(() => stop(), [stop]);

    const addTime = useCallback((extra = 15) => {
        setSecondsLeft(s => Math.min(s + extra, 300));
    }, []);

    const removeTime = useCallback((sub = 15) => {
        setSecondsLeft(s => {
            const next = Math.max(s - sub, 5);
            if (next <= 5 && s <= 5) stop();
            return next;
        });
    }, [stop]);

    useEffect(() => () => clearInterval(intervalRef.current), []);

    return { isActive, secondsLeft, duration, setDuration, start, skip, addTime, removeTime };
}
