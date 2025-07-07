import { redirect } from "next/navigation";

export const handleLogout = (logoutFn: () => Promise<void>, push: string) => {
  return async () => {
    await logoutFn();
    redirect(push)
  };
};
