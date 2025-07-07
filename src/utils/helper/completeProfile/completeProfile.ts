import { IProfile } from "@/types/profile-type/profile-type";

export const calculateProfileCompletion = (profile: IProfile | null): number => {
  if (!profile) return 0;
  
  let completion = 0;
  
  if (profile.profilePicture) completion += 10;
  
  if (profile.firstName) completion += 10;
  if (profile.lastName) completion += 10;
  if (profile.phoneNumber) completion += 10;
  if (profile.email) completion += 10;
  
  if (profile.fullName) completion += 15;
  if (profile.emailVerified) completion += 15;
  
  if (profile.membershipDate) completion += 20;
  
  return Math.min(completion, 100);
};