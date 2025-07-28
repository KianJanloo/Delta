"use client";
import React, { useState } from 'react';
import CommonButton from '@/components/common/buttons/common/CommonButton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { showToast } from '@/core/toast/toast';
import CommonInput from '@/components/common/inputs/common/CommonInput';

interface SelectImageModalProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
}

const SelectImageModal: React.FC<SelectImageModalProps> = ({ open, setOpen, setSelectedImage }) => {
  const t = useTranslations('modals.selectImage');
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleSubmitPicture = () => {
    if (photoFile) {
      setSelectedImage(photoFile);
      setOpen(false);
    } else {
      showToast("error", "لطفا یک تصویر انتخاب کنید.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='rounded-2xl flex flex-col gap-8 items-center' onMouseDown={(e) => e.stopPropagation()}>
        <DialogHeader className='flex flex-row  w-full justify-between mt-4 gap-4 items-center'>
          <DialogTitle className='text-xl'>{t('selectProfile')}</DialogTitle>
          <DialogDescription>
            <CommonButton 
              onclick={() => setOpen(false)} 
              title={t('close')} 
              icon={<X />} 
              classname='border border-danger bg-transparent text-danger' 
            />
          </DialogDescription>
        </DialogHeader>

        <svg width="100%" height="2" viewBox="0 0 1131 2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="0.88" x2="1131" y2="0.88" stroke="#888888" strokeOpacity="0.26" strokeDasharray="7 7" />
        </svg>

        <div className='w-full'>
          <CommonButton title=" ثبت تصویر " classname='w-full mb-4' onclick={handleSubmitPicture} />
          <CommonInput
            label="تصویر پروفایل"
            type="file"
            placeholder='لطفا تصویر خود را وارد کنید.'
            classname='bg-transparent text-foreground border-foreground w-full'
            color='text-foreground'
            onchange={handleFileChange}
          />
        </div>

        <DialogFooter className='relative flex flex-col gap-4 items-center'>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SelectImageModal;
