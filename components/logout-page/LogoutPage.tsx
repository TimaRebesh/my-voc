'use client';

import { useEffect } from "react";
import { Preloader } from "../ui/preloader";
import { signOut } from "next-auth/react";
import { AppRouterPath } from "@/constants";

export const LogoutPage = () => {

  useEffect(() => {
    signOut({
      redirect: true,
      callbackUrl: AppRouterPath.LOGIN
    });
  }, []);

  return (
    <Preloader />
  );
};
