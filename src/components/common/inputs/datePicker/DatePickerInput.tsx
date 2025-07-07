import { Label } from '@/components/ui/label'
import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import React, { FC } from 'react'
import { IDatePicker } from '@/types/input-type/input-types'

const DatePickerInput: FC<IDatePicker> = ({
  background = '',
  color = '',
  label,
  mandatory,
  placeholder,
  onChange,
  className = '',
  icon,
  value,
}) => {
  return (
    <div className={`rtl flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <Label htmlFor={label} className={`text-[13px] flex gap-0.5 text-subText ${color}`}>
          <span>{label}</span>
          {mandatory && <p className="text-danger">*</p>}
          <span>:</span>
        </Label>
      )}

      <div className={`flex items-center gap-2 rounded-[16px] border text-subText border-subText px-4 py-2.5 ${background} ${color} w-full`}>
        {icon && <span className={`text-subText ${color}`}>{icon}</span>}
        <div className="flex-1">
          <DatePicker
            value={value}
            id={label}
            onChange={onChange}
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-right"
            inputClass="w-full outline-none bg-transparent placeholder:text-subText text-subText text-sm"
            containerClassName="w-full"
            style={{
              background: 'transparent',
              border: 'none',
              width: '100%',
              fontSize: '14px',
              color: 'inherit',
            }}
            placeholder={placeholder}
          />
        </div>
      </div>
    </div>
  )
}


export default DatePickerInput
