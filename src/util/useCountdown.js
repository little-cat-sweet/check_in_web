import { useEffect, useState } from 'react';

/**
 * 验证码倒计时：返回 [剩余秒数, 设置剩余秒数]。
 * setCountdown(60) 后每秒自减，归零后自动停止。
 */
const useCountdown = () => {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        if (seconds <= 0) {
            return undefined;
        }
        const timer = setTimeout(() => setSeconds((value) => value - 1), 1000);
        return () => clearTimeout(timer);
    }, [seconds]);

    return [seconds, setSeconds];
};

export default useCountdown;
