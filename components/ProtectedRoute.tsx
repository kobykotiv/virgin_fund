import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/providers/auth-provider";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useContext(AuthContext) || {};
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return <div>Loading...</div>;
  return <>{children}</>;
}
