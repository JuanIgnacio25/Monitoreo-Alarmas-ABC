"use client";

import { getUserProfile } from "@/lib/api/api";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/zustand/authStore";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function ProfilePage() {
  const accessToken = useAuthStore.getState().accessToken;
  useEffect(() => {
    console.log({ profile: accessToken });

    getUserProfile();
  }, [accessToken]);
  return (
    <div className="flex flex-col justify-center items-center gap-2">
      ProfilePage
      <Link href="/auth/login">
        <Button>Login</Button>
      </Link>
    </div>
  );
}

export default ProfilePage;
