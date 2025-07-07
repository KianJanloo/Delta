'use client'
import { usePathname } from "next/navigation";

const useClearPathname = () => {
    const cleanPath = usePathname();
    const pathname = cleanPath.replace(/^\/(fa|en|ar)/, "")
    return pathname
}

export default useClearPathname