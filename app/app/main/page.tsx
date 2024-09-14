"use client";

import LoginButton from "@/components/login";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";

export default function Page() {
  const { isAuthenticated, isLoading } = useAuth0();
  const router = useRouter();

  if (isLoading) {
    return <div>Loading ...</div>;
  }
  
  function onContinue() {
    router.push("/app");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Page Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Page content</p>
        {isAuthenticated ? (
          <Button onClick={onContinue}>Continue to app</Button>
        ) : (
          <div>
            <h2>Not logged in</h2>
            <LoginButton />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
