import { createActor } from "@/backend";
import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { LogIn, ShieldAlert } from "lucide-react";

function useIsAdmin() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export default function AdminGuard({
  children,
}: { children: React.ReactNode }) {
  const { isAuthenticated, isInitializing, login } = useInternetIdentity();
  const { data: isAdmin, isLoading } = useIsAdmin();

  if (isInitializing || isLoading) {
    return (
      <div
        className="min-h-[60vh] flex items-center justify-center"
        data-ocid="admin_guard.loading_state"
      >
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Checking access…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-[60vh] flex items-center justify-center px-4"
        data-ocid="admin_guard.unauthenticated"
      >
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <LogIn size={28} className="text-primary" />
          </div>
          <h2 className="font-display font-bold text-xl text-foreground mb-2">
            Admin Login Required
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Please log in with Internet Identity to access the admin panel.
          </p>
          <Button onClick={login} data-ocid="admin_guard.login_button">
            Login with Internet Identity
          </Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="min-h-[60vh] flex items-center justify-center px-4"
        data-ocid="admin_guard.access_denied"
      >
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={28} className="text-destructive" />
          </div>
          <h2 className="font-display font-bold text-xl text-foreground mb-2">
            Access Denied
          </h2>
          <p className="text-muted-foreground text-sm">
            You don't have admin privileges. Please contact the store owner.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
