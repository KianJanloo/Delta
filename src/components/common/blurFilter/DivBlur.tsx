import React, { FC } from 'react'

interface IProps {
    className?: string;
}

const DivBlur: FC<IProps> = ({ className }) => {
    return (
        <div className={`w-[218] h-[218] blur-[256px] z-[2] absolute ${className}`}>
            {" "}
        </div>
    )
}

export default DivBlur
