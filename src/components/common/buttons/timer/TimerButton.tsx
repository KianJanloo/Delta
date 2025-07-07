'use client';

import React, { useRef, FC } from 'react';
import { Button } from '@/components/ui/button';
import TimerTwoMinutes from '@/utils/helper/Timer/TowMinuteTimer';
import { ChevronLeft, Clock } from 'lucide-react';
import { IButton } from '@/types/buttons-type/buttons-type';
import { useTranslations } from 'next-intl';
import { useDirection } from '@/utils/hooks/useDirection';

interface TimerHandle {
  reset(): void;
}

const TimerButton: FC<IButton> = ({ onclick }) => {
  const t = useTranslations('auth.timerButton');
  const dir = useDirection()
  const timerRef = useRef<TimerHandle | null>(null);

  const handleClick = () => {
    if (timerRef.current) {
      timerRef.current.reset()
    }
    if (onclick) {
      onclick();
    }
  };

  return (
    <div className="bg-[#7569FF] w-[226px] h-[34px] flex justify-start text-card-foreground rounded-[12px]">
      <Button
        type='button'
        variant="none"
        onClick={handleClick}
        className="bg-white text-black w-2/3 h-full flex-row-reverse cursor-pointer text-[13px] font-semibold"
      >
        <ChevronLeft className={` ${dir === "ltr" && "rotate-180"} `} /> {t('resend')}
      </Button>
      <div className="flex justify-center flex-row-reverse gap-2 w-1/3 items-center">
        <Clock className="size-[16px]" />
        <TimerTwoMinutes ref={timerRef} onExpire={() => {}} />
      </div>
    </div>
  );
};

export default TimerButton;