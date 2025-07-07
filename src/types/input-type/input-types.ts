/* eslint-disable */

import { ChangeEvent } from "react";
import { DateObject } from "react-multi-date-picker";

export interface IInput {
  label?: string;
  placeholder?: string;
  classname?: string;
  type?: string;
  color?: string;
  background?: string;
  onchange?: (e: ChangeEvent<HTMLInputElement>) => void;
  mandatory?: boolean;
  name?: string;
  id?: string;
  value?: any;
}

export interface IPasswordInput {
  label?: string;
  placeholder?: string;
  classname?: string;
  color?: string;
  background?: string;
  onchange?: (e: ChangeEvent<HTMLInputElement>) => void;
  mandatory?: boolean;
  name?: string;
  id?: string;
}

export interface IOTPInput {
  onchange?: (val: string) => void;
}

export interface IDatePicker {
  label?: string
  onChange?: (
    date: DateObject | null,
    options: {
      validatedValue: string | string[]
      input: HTMLElement
      isTyping: boolean
    }
  ) => false | void
  placeholder?: string
  mandatory?: boolean
  background?: string
  color?: string
  className?: string
  icon?: React.ReactNode,
  value?: Date | DateObject | null;
}

export interface IUpdatePassenger {
  firstName: string,
  lastName: string,
  nationalId: string
}