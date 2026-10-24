import { useEffect, useRef, useState } from 'react';

const reduceMotion = () =>
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * 数字滚动过渡：value 变化时从当前显示值缓动到新值，
 * 避免「3 → 4」这种硬切换。系统开启「减弱动态效果」时直接取新值。
 */
const AnimatedNumber = ({ value, duration = 520 }) => {
    const [display, setDisplay] = useState(value);
    const displayRef = useRef(value);
    displayRef.current = display;
    const frameRef = useRef(null);

    useEffect(() => {
        if (reduceMotion()) {
            setDisplay(value);
            return undefined;
        }

        const from = displayRef.current;
        const to = value;
        if (from === to) {
            return undefined;
        }

        const start = performance.now();
        const tick = (now) => {
            const progress = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic，收尾更柔
            setDisplay(from + (to - from) * eased);
            if (progress < 1) {
                frameRef.current = requestAnimationFrame(tick);
            }
        };

        frameRef.current = requestAnimationFrame(tick);
        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
                frameRef.current = null;
            }
        };
    }, [value, duration]);

    return Math.round(display);
};

export default AnimatedNumber;
