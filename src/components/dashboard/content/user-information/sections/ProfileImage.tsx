/* eslint-disable */
"use client";
import React, { useCallback, useEffect, useState } from 'react';
import { Camera, X } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';
import SelectImageModal from '@/components/dashboard/modal/SelectImageModal';
import { editProfile } from '@/utils/service/api/profile/editProfile';
import { getProfileById } from '@/utils/service/api/profile/getProfileById';
import { IProfile } from '@/types/profile-type/profile-type';
import { showToast } from '@/core/toast/toast';

const ProfileImage: React.FC = () => {
  const { data: session } = useSession() as any;
  const [profile, setProfile] = useState<IProfile | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const t = useTranslations('dashboardBuyer.profile2');

  const getProfile = useCallback(async () => {
    if (session?.userInfo?.id) {
      const profileData = await getProfileById(session.userInfo.id);
      setProfile(profileData);
    }
  }, [session]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  useEffect(() => {
    if (profile?.profilePicture) {
      setSelectedImage(profile.profilePicture);
    }
  }, [profile]);

  useEffect(() => {
    if (session?.userInfo?.id && selectedImage) {
      const profile = async () => {
        await editProfile(session.userInfo.id, { profilePicture: selectedImage });
      }

      profile()
    }
  }, [selectedImage, session]);


  const deleteProfilePicture = async () => {
    const response = await editProfile(session.userInfo.id, { profilePicture: null });
    setSelectedImage(null)
    if(response){
      showToast("success", " تصویر پروفایل با موفقیت حذف شد. ")
    }
  }

  return (
    <div className='flex w-full max-sm:flex-col flex-row max-sm:gap-8'>
      <div className='flex flex-col gap-2 w-1/2 max-xl:w-full'>
        <h2 className='text-xl font-bold'>{t('title')}</h2>
        <span className='text-subText'>{t('subtitle')}</span>
      </div>
      <div className='w-1/2 max-sm:w-full flex justify-start relative'>
        <Image
          src={selectedImage || "/default-profile.png"}
          alt=" "
          width={120}
          height={120}
          className='rounded-full w-[120px] h-[120px] bg-subBg2 relative'
        />
        <div
          onClick={() => setOpen(true)}
          className='bg-primary rounded-full flex items-center cursor-pointer justify-center absolute size-[21px] top-4 text-primary-foreground'
        >
          <Camera size={16} />
        </div>
        {selectedImage && <div
          onClick={() => deleteProfilePicture()}
          className='bg-danger rounded-full flex items-center cursor-pointer justify-center absolute size-[21px] bottom-4 text-accent-foreground'
        >
          <X size={16} />
        </div>}
      </div>
      <SelectImageModal
        open={open}
        setOpen={setOpen}
        setSelectedImage={setSelectedImage}
      />
    </div>
  );
};

export default ProfileImage;
