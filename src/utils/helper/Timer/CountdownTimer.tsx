'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  initialSeconds: number;
  classname?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ initialSeconds, classname }) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const seconds = secs % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  return (
    <div className={`text-2xl font-mono text-white ${classname}`}>
      {formatTime(secondsLeft)}
    </div>
  );
};

export default CountdownTimer;
