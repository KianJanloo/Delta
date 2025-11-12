'use client';

import { useState } from "react";
import { Cog, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import AdminPageHeader from "@/components/dashboard/admin/shared/AdminPageHeader";

const AdminSettingsContent = () => {
  const [autoModeration, setAutoModeration] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);
  const [defaultRole, setDefaultRole] = useState("buyer");
  const [supportEmail, setSupportEmail] = useState("support@delta.com");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [language, setLanguage] = useState("fa");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: connect to backend endpoint when ready
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      <AdminPageHeader
        title="تنظیمات سیستم"
        description="پیکربندی سیاست‌های امنیتی، دسترسی و اطلاع‌رسانی سامانه مدیریت دلتا."
        actions={
          <Button type="submit" className="gap-2">
            <Save className="size-4" />
            ذخیره تغییرات
          </Button>
        }
        hint="تغییرات پس از ذخیره‌سازی برای تمام مدیران اعمال می‌شود."
      />

      <Card className="border-border/70">
        <CardHeader className="text-right">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Cog className="size-4" />
            تنظیمات عمومی
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 text-right md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="support-email">ایمیل پشتیبانی</Label>
            <Input
              id="support-email"
              type="email"
              placeholder="support@example.com"
              value={supportEmail}
              onChange={(event) => setSupportEmail(event.target.value)}
              className="text-right"
            />
            <p className="text-xs text-muted-foreground">
              ایمیلی که در اطلاعیه‌ها و پاسخ خودکار به کاربران نمایش داده می‌شود.
            </p>
          </div>

          <div className="space-y-2">
            <Label>زبان پیش‌فرض سامانه</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="justify-between text-right">
                <SelectValue placeholder="انتخاب زبان" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fa">فارسی</SelectItem>
                <SelectItem value="en">انگلیسی</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              زبان پیش‌فرض رابط کاربری مدیران.
            </p>
          </div>

          <div className="space-y-2">
            <Label>نقش پیش‌فرض کاربران تازه‌وارد</Label>
            <Select value={defaultRole} onValueChange={setDefaultRole}>
              <SelectTrigger className="justify-between text-right">
                <SelectValue placeholder="انتخاب نقش" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buyer">خریدار</SelectItem>
                <SelectItem value="seller">فروشنده</SelectItem>
                <SelectItem value="guest">کاربر مهمان</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              نقش اولیه‌ای که بعد از ثبت‌نام به کاربران اختصاص داده می‌شود.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center justify-between">
              <span>حالت تعمیرات</span>
              <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
            </Label>
            <p className="text-xs text-muted-foreground">
              فعال کردن این گزینه باعث نمایش پیام تعمیرات به کاربران می‌شود.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70">
        <CardHeader className="text-right">
          <CardTitle className="text-base font-semibold">امنیت و دسترسی</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 text-right md:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center justify-between">
              <span>احراز هویت دو مرحله‌ای مدیران</span>
              <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
            </Label>
            <p className="text-xs text-muted-foreground">
              توصیه می‌شود برای امنیت بیشتر همیشه فعال باشد.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center justify-between">
              <span>فعال‌سازی پایش خودکار محتوا</span>
              <Switch checked={autoModeration} onCheckedChange={setAutoModeration} />
            </Label>
            <p className="text-xs text-muted-foreground">
              با فعال بودن، نظرات حساس قبل از نمایش بررسی می‌شوند.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70">
        <CardHeader className="text-right">
          <CardTitle className="text-base font-semibold">اطلاع‌رسانی‌ها</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 text-right md:grid-cols-2">
          <div className="space-y-2">
            <Label>محدوده زمانی ارسال ایمیل‌های سیستمی</Label>
            <Select defaultValue="business">
              <SelectTrigger className="justify-between text-right">
                <SelectValue placeholder="انتخاب بازه" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="business">ساعات اداری</SelectItem>
                <SelectItem value="weekend">صرفاً آخر هفته</SelectItem>
                <SelectItem value="anytime">هر زمان</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              ارسال پیام‌های سیستمی بر اساس محدودیت‌های انتخاب‌شده انجام می‌شود.
            </p>
          </div>

          <div className="space-y-2">
            <Label>کانال اطلاع‌رسانی اضطراری</Label>
            <Select defaultValue="sms">
              <SelectTrigger className="justify-between text-right">
                <SelectValue placeholder="انتخاب کانال" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">ایمیل</SelectItem>
                <SelectItem value="sms">پیامک</SelectItem>
                <SelectItem value="push">اعلان درون برنامه</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              کانال پیش‌فرض برای ارسال هشدارهای بحرانی.
            </p>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default AdminSettingsContent;

