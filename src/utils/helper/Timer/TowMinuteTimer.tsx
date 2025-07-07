/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { forwardRef, useImperativeHandle } from 'react';
import { useTimer } from 'react-timer-hook';

const TwoMinuteTimer = forwardRef(({ onExpire }: {onExpire: any}, ref) => {
  const getExpiryTimestamp = () => {
    const expiry = new Date();
    expiry.setSeconds(expiry.getSeconds() + 120);
    return expiry;
  };

  const { minutes, seconds, restart } = useTimer({
    expiryTimestamp: getExpiryTimestamp(),
    onExpire: () => {
      if (onExpire) onExpire();
    },
  });

  useImperativeHandle(ref, () => ({
    reset: () => {
      restart(getExpiryTimestamp());
    }
  }));

  const mm = minutes.toString().padStart(2, '0');
  const ss = seconds.toString().padStart(2, '0');

  return <span className="text-[13px] font-bold">{mm}:{ss}</span>;
});

TwoMinuteTimer.displayName = 'TwoMinuteTimer';

export default TwoMinuteTimer;
