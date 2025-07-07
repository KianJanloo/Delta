import { ChangeEvent } from "react";

export interface ITextarea {
    classname?: string;
    onchange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    color?: string;
    background?: string;
    label?: string;
    mandatory?: boolean;
    placeholder?: string;
}