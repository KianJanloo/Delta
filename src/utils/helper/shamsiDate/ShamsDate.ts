import { toJalaali } from 'jalaali-js';

export function convertToJalaliString(isoDate: string | Date): string {
  const utcDate = new Date(isoDate);

  const iranTime = new Date(
    utcDate.toLocaleString('en-US', { timeZone: 'Asia/Tehran' })
  );

  const { gy, gm, gd } = {
    gy: iranTime.getFullYear(),
    gm: iranTime.getMonth() + 1,
    gd: iranTime.getDate(),
  };

  const jDate = toJalaali(gy, gm, gd);

  const hour = iranTime.getHours().toString().padStart(2, '0');
  const minute = iranTime.getMinutes().toString().padStart(2, '0');

  return `${jDate.jd} ${getPersianMonthName(jDate.jm)} - ${jDate.jy} / ${hour}:${minute}`;
}

function getPersianMonthName(month: number): string {
  const months = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',
  ];
  return months[month - 1];
}
