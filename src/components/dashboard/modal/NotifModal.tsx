"use client";
import CommonButton from "@/components/common/buttons/common/CommonButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Bell, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useDirection } from "@/utils/hooks/useDirection";
import {
  createSettings,
  deleteSettings,
  getSettings,
  ISetting,
} from "@/utils/service/api/notifications-settings/settings";

const NotifModal = () => {
  const t = useTranslations("modals.notif");
  const [open, setOpen] = useState<boolean>();
  const dir = useDirection();

  const [settings, setSettings] = useState<ISetting[]>([]);
  const [refetch, setRefetch] = useState<boolean>(false);

  const fetchSettings = useCallback(async () => {
    const response = await getSettings();
    setSettings(response || []);
    setRefetch(true);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings, refetch]);

  const settingsData = settings.map((s) => s.notificationType);

  const handleChangeSetting = async ({
    type,
    id,
  }: {
    type: string;
    id?: number;
  }) => {
    if (!settings.some((s) => s.notificationType == type)) {
      const response = await createSettings({
        notificationType: type,
        criteria: {},
      });
      if (response) {
        setRefetch(true);
      }
    } else if (id) {
      const response = await deleteSettings(id);
      if (response) {
        setRefetch(true);
      }
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger>
        <div className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-md cursor-pointer transition-colors">
          <Bell size={16} /> {t("notifSettings")}
        </div>
      </DialogTrigger>
      <DialogContent
        dir={dir}
        onMouseDown={(e) => e.stopPropagation()}
        className="rounded-2xl flex flex-col gap-8 items-center"
      >
        <DialogHeader className="flex justify-between flex-row w-full items-center my-4">
          <DialogTitle className="text-xl">{t("notifSettings")}</DialogTitle>
          <DialogDescription>
            <CommonButton
              onclick={() => setOpen(false)}
              title={t("close")}
              icon={<X />}
              classname="border border-danger bg-transparent text-danger"
            />
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="w-full">
          <div className="flex flex-col gap-4 w-full mx-auto justify-center items-center">
            <div className="flex w-full justify-between text-lg items-center">
              {t("reserveNotif")}
              <Switch
                onCheckedChange={() => {
                  const data = settings.find(
                    (s) => s.notificationType === "new_booking"
                  );
                  if (data) {
                    handleChangeSetting({
                      type: data?.notificationType,
                      id: data?.id,
                    });
                  } else {
                    handleChangeSetting({
                      type: "new_booking",
                    });
                  }
                }}
                defaultChecked={settingsData.some((s) => s === "new_booking")}
              />
            </div>
            <div className="flex w-full justify-between text-lg items-center">
              {t("paymentNotif")}
              <Switch
                onCheckedChange={() => {
                  const data = settings.find(
                    (s) => s.notificationType === "new_payment"
                  );
                  if (data) {
                    handleChangeSetting({
                      type: data?.notificationType,
                      id: data?.id,
                    });
                  } else {
                    handleChangeSetting({
                      type: "new_payment",
                    });
                  }
                }}
                defaultChecked={settingsData.some((s) => s === "new_payment")}
              />
            </div>
            <div className="flex w-full justify-between text-lg items-center">
              {t("discountNotif")}
              <Switch
                onCheckedChange={() => {
                  const data = settings.find(
                    (s) => s.notificationType === "discount"
                  );
                  if (data) {
                    handleChangeSetting({
                      type: data?.notificationType,
                      id: data?.id,
                    });
                  } else {
                    handleChangeSetting({
                      type: "discount",
                    });
                  }
                }}
                defaultChecked={settingsData.some((s) => s === "discount")}
              />
            </div>
            <div className="flex w-full justify-between text-lg items-center">
              {t("systemNotif")}
              <Switch
                onCheckedChange={() => {
                  const data = settings.find(
                    (s) => s.notificationType === "system"
                  );
                  if (data) {
                    handleChangeSetting({
                      type: data?.notificationType,
                      id: data?.id,
                    });
                  } else {
                    handleChangeSetting({
                      type: "system",
                    });
                  }
                }}
                defaultChecked={settingsData.some((s) => s === "system")}
              />
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotifModal;
