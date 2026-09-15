import { Navigate } from "react-router";
import { useStore } from "../store";
// @ts-expect-error TS7016: productApi.js is intentionally consumed here.

import { isAdmin } from "../lib/auth";

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loadingUser } = useStore();

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || !isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}