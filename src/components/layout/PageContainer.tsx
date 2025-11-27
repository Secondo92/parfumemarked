import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import useAuth from "../../hooks/useAuth";
import { useChatThreads } from "../../hooks/useChatThreads";
import type { AppOutletContext } from "../../types/context";

const PageContainer: React.FC = () => {
  const { user, profile, loading } = useAuth();

  const userId = user?.uid ?? "";

  const threads = useChatThreads(userId);

  React.useEffect(() => {
    if (window.lucide) window.lucide.createIcons();
  }, [threads]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Indlæser...
      </div>
    );
  }

  const outletContext: AppOutletContext = {
    userId,
    profile,
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Header user={user} profile={profile} threads={threads} />
      <Outlet context={outletContext} />
    </div>
  );
};

export default PageContainer;
