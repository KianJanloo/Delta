import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Stepper({ currentStep }: { currentStep: number }) {
    const t = useTranslations('dashboardSeller.addHouses')
    const steps = [
        t('basicInfo'),
        t('address'),
        t('facilities'),
        t('images'),
        t('finalConfirm'),
    ];

    return (
        <div className="flex items-center max-xl:justify-around justify-center gap-8 bg-subBg2 p-4 rounded-3xl shadow-sm">
            {steps.map((label, index) => {
                const isActive = index === currentStep;
                const isDone = index < currentStep;

                return (
                    <div key={index} className="flex items-center gap-4 text-sm">
                        <div
                            className={`w-6 h-6 flex items-center justify-center rounded-full ${isActive
                                    ? "bg-accent-blue text-accent-blue-foreground"
                                    : isDone
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-300 text-black"
                                }`}
                        >
                            {isDone ? <Check size={16} /> : index + 1}
                        </div>
                        <span className={`max-xl:hidden ${isActive ? "font-bold" : "text-subText"}`}>
                            {label}
                        </span>
                        {index < steps.length - 1 && (
                            <svg className="w-[80] max-2xl:w-[30] max-xl:hidden" height="2" viewBox="0 0 88 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <line x1="87" y1="1" x2="1" y2="1.00001" stroke="#777777" strokeWidth="2" strokeLinecap="round" strokeDasharray="7 7" />
                            </svg>
                        )}
                    </div>
                );
            })}
        </div>
    );
}