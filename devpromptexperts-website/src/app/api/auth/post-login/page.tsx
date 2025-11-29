"use client";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { UserRoles, UserRole, UserStages, UserStage } from "@/types/";

// Move the logic that uses useSearchParams into a separate component
function PostLoginContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (status === "loading") return; // Wait for session to load

    if (session?.user) {
      const userStage = session.user.stage as UserStage;
      let userRole = session.user.role as UserRole;

      // Fix: Check for pending role and update if needed
      if (userRole === UserRoles.ROLE_PENDING) {
        userRole = (searchParams.get("pendingRole") as UserRole) || userRole;
      }

      const user_id = session.user.id;
      console.log(
        "Post-login redirect for role:",
        userRole,
        "stage:",
        userStage
      );

      // Perform the final, stage-based redirection here
      if (userRole === UserRoles.CONSULTANT) {
        switch (userStage) {
          case UserStages.BIO_WIP:
          case UserStages.BIO:
            router.push("/consultant/onboarding");
            break;
          case UserStages.BIO_DONE:
          case UserStages.INTV_SCHEDULED:
            router.push("/consultant/induction");
            break; // Added missing break
          case UserStages.PROBATION:
          case UserStages.PROBATION_WIP:
            router.push("/consultant/induction");
            break; // Added missing break
          case UserStages.PROFESSIONAL:
            router.push(`/consultant/${user_id}/dashboard`);
            break;
          default:
            router.push("/default-dashboard");
        }
      } else if (userRole === UserRoles.CLIENT) {
        switch (userStage) {
          case UserStages.BIO_WIP:
          case UserStages.BIO:
            router.push("/client/onboarding");
            break;
          case UserStages.BIO_DONE:
            router.push("/client/induction");
            break; // Added missing break
          case UserStages.PROFESSIONAL:
            router.push(`/client/${user_id}/dashboard`);
            break;
          default:
            router.push("/default-dashboard");
        }
      } else if (userRole === UserRoles.SELLER) {
        switch (userStage) {
          case UserStages.BIO_WIP:
          case UserStages.BIO:
            router.push("/seller/onboarding");
            break;
          case UserStages.BIO_DONE:
            router.push("/seller/induction");
            break; // Added missing break
          case UserStages.PROFESSIONAL:
            router.push(`/seller/${user_id}/dashboard`);
            break;
          default:
            router.push("/default-dashboard");
        }
      } else {
        // Handle ROLE_PENDING or unknown roles
        router.push("/auth/select-role");
      }
    } else {
      // Should not happen, but redirect to login if session is missing
      router.push("/auth/login");
    }
  }, [status, session, router, searchParams]); // Added searchParams to dependencies

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Completing Sign In...</h1>
        <p>Loading user profile...</p>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
const PostLoginRedirect = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Loading...</h1>
            <p>Preparing your redirect...</p>
          </div>
        </div>
      }
    >
      <PostLoginContent />
    </Suspense>
  );
};

export default PostLoginRedirect;
