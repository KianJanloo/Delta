import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IPassenger } from "@/utils/zustand/booking";
import { convertToJalaliString } from "@/utils/helper/shamsiDate/ShamsDate";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function GuestCount({
  traveler_details,
  button,
}: {
  traveler_details: IPassenger[];
  button: React.ReactNode;
}) {
  const t = useTranslations("dashboardBuyer.manageReserves");

  return (
    <Dialog>
      <DialogTrigger> {button} </DialogTrigger>
      <DialogContent className="max-w-fit overflow-x-auto">
        <DialogHeader>
          <DialogTitle className="text-right w-full mt-[40px]">
            {t("guestListTitle")}
          </DialogTitle>
          <div className="mt-4">
            <div className="overflow-x-auto w-full">
              <Table className="min-w-[600px] text-sm text-center border-collapse">
                <TableHeader className="bg-subBg2 text-foreground">
                  <TableRow className="bg-subBg2 rounded">
                    <TableHead className="p-2 rounded-r">{t("name")}</TableHead>
                    <TableHead className="p-2">{t("nationalCode")}</TableHead>
                    <TableHead className="p-2">{t("gender")}</TableHead>
                    <TableHead className="p-2 rounded-l">{t("birthDate")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {traveler_details.map((passenger, index) => (
                    <TableRow key={index} className="bg-subBg">
                      <TableCell className="p-2">
                        {passenger.firstName + " " + passenger.lastName}
                      </TableCell>
                      <TableCell className="p-2">{passenger.nationalId}</TableCell>
                      <TableCell className="p-2">
                        {passenger.gender === "male" ? "مرد" : "زن"}
                      </TableCell>
                      <TableCell className="p-2 text-primary cursor-pointer">
                        {convertToJalaliString(passenger.birthDate?.toString() || "")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
