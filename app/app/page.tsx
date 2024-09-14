"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Profile = () => {
  const { isAuthenticated, isLoading, loginWithRedirect, handleRedirectCallback } = useAuth0();
  const router = useRouter();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  useEffect(() => {
    if (window.location.search.includes("code=")) {
      handleRedirectCallback().then(() => {
        router.push("/main");
      });
    }
  }, [handleRedirectCallback, router]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/main");
    }
  }, [isAuthenticated, router]);

  function onSubmit() {
    if (isAuthenticated) {
      router.push("/main");
      console.log("User is authenticated");
    } else {
      loginWithRedirect();
      console.log("User is not authenticated");
    }
  }

  return (
    <div className="flex flex-col space-y-4 justify-center items-center h-screen">
      <div className="flex flex-col space-y-2 justify-center items-center">
        <div>
          <Card className="p-4 flex flex-col space-y-2 justify-center items-center">
            <CardTitle>Get Started</CardTitle>
            <CardContent>
              <Button
                size="lg"
                className="bg-violet-200 text-black hover:bg-violet-300"
                onClick={onSubmit}
              >
                Continue!
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
