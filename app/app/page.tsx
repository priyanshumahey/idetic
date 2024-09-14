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
      {isAuthenticated ? (
        <div>
          <h2>Logged In</h2>
          <img src={user?.picture || ""} alt={user?.name || ""} />
          <h4>User ID: {user?.sub}</h4>
          <p>Name: {user?.name}</p>
          <p>Email: {user?.email}</p>
          <LogoutButton />
        </div>
      ) : (
        <div>
          <h2>Not Logged In</h2>
          <p>Please log in to view your profile.</p>
          <LoginButton />
        </div>
      )}
    </div>
  );
};

export default Profile;
