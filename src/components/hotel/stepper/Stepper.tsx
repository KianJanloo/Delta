import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Stepper({ currentStep }: { currentStep: number }) {
    const t = useTranslations('hotel');
    const steps = [
        t("selectHotel"),
        t("passengerInfo"),
        t("confirmInfo"),
        t("onlinePayment"),
        t("ticketIssue"),
    ];

    return (
        <div className="flex items-center justify-around bg-secondary-light2 p-4 rounded-3xl shadow-sm">
            {steps.map((label, index) => {
                const isActive = index === currentStep;
                const isDone = index < currentStep;

                return (
                    <div key={index} className="flex items-center gap-4 text-base">
                        <div
                            className={`w-6 h-6 flex items-center justify-center rounded-full ${isActive
                                ? "bg-primary text-primary-foreground"
                                : isDone
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-gray-300 text-black"
                                }`}
                        >
                            {isDone ? <Check size={16} /> : index + 1}
                        </div>
                        <span className={` max-md:hidden ${isActive ? "font-bold" : "text-subText"}`}>
                            {label}
                        </span>
                        {index < steps.length - 1 && (
                            <svg className="max-xl:hidden" width="107" height="2" viewBox="0 0 107 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <line x1="106" y1="1" x2="1" y2="1.00001" stroke="#AAAAAA" strokeWidth="2" strokeLinecap="round" strokeDasharray="7 7" />
                            </svg>
                        )}
                    </div>
                );
            })}
        </div>
    );
}