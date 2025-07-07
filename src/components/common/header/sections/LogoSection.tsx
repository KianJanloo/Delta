import Link from "next/link";
import Image from "next/image";
import Icon from "@/assets/images/icon.png"

const LogoSection = () => (
  <div className=" w-[72px] lg:w-[92px] md:w-[72px] h-[80%] flex items-center justify-center rounded-[12px] lg:mr-[8px] md:mr-[4px]">
    <Link href="/" className="text-foreground flex items-center justify-center">
      <Image
        src={Icon}
        alt="Delta Logo"
        width={50}
        height={50}
        className="w-auto h-auto max-h-[45px] md:max-h-[40px] lg:max-h-[50px] text-foreground filter invert-0 dark:invert"
      />
    </Link>
  </div>
);

export default LogoSection;
