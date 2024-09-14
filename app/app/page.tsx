"use client";

import LoginButton from "@/components/login";
import LogoutButton from "@/components/logout";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <div>
      {isAuthenticated && (
        <div>
          <img
            src={user?.picture || ""}
            alt={user?.name || ""}
          />
          <h4>{user?.sub}</h4>
          <p>{user?.name}</p>
          <p>{user?.email}</p>
          <LogoutButton />
        </div>
      )}
      {!isAuthenticated && (
        <div>
          <h2>Not logged in</h2>
          <LoginButton />
        </div>
      )}
    </div>
  );
};

export default Profile;
