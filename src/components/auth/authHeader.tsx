import Image from "next/image";
import arrow from "../../assets/arrow.svg";
import { ChevronLeft } from 'lucide-react';
import Link from "next/link";
import { useTranslations } from "next-intl";

const AuthHeader = ({ pageName }: { pageName: string }) => {
  const t = useTranslations("auth.authHeader");

  return (
    <div>
      <div className="flex gap-3 text-xs">
        <Link href={'/'}>{t("home")}</Link>
        <ChevronLeft size={16} />
        <p className="text-primary">{pageName}</p>
      </div>
      <div className="flex mt-5 gap-3 lg:text-base text-sm">
        <h3 className=" font-bold text-primary">{t("welcomeBack")}</h3>
        <Image src={arrow} alt="none" className="dark:inline hidden" />
        <div className='flex gap-1 justify-center items-center dark:hidden'>
          <svg width="48" height="17" viewBox="0 0 48 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M45 10.1598C46.3333 9.38998 46.3333 7.46548 45 6.69568L39 3.23158C37.6667 2.46178 36 3.42403 36 4.96363L36 11.8918C36 13.4314 37.6667 14.3937 39 13.6239L45 10.1598Z" fill="#363636" />
            <path d="M23.75 9.72677C24.75 9.14942 24.75 7.70605 23.75 7.1287L19.25 4.53062C18.25 3.95327 17 4.67496 17 5.82966L17 11.0258C17 12.1805 18.25 12.9022 19.25 12.3248L23.75 9.72677Z" fill="#363636" fillOpacity="0.5" />
            <path d="M6.5 9.29376C7.16667 8.90886 7.16667 7.94661 6.5 7.56171L3.5 5.82966C2.83333 5.44476 2 5.92588 2 6.69568L2 10.1598C2 10.9296 2.83333 11.4107 3.5 11.0258L6.5 9.29376Z" fill="#363636" fillOpacity="0.25" />
          </svg>
        </div>
      </div>
      <h2 className="mt-5 lg:text-3xl text-xl">{t("mainTitle")}</h2>
      <h6 className="mt-5 lg:text-base text-sm">
        {t("description")}
      </h6>
    </div>
  );
};

export default AuthHeader;