/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "convex/react";
import { useEffect } from "react";
import { api } from "../convex/_generated/api";

export const UserVideos = () => {
  const { user, isAuthenticated } = useAuth0();

  // Use the new query
  const userVideos = useQuery(
    api.listUserVideos.listUserVideos,
    isAuthenticated && user?.sub ? { userId: user.sub } : "skip"
  );

  useEffect(() => {
    if (isAuthenticated) {
      console.log(user);
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return <div>Please log in to view your videos.</div>;
  }

  return (
    <div>
      <h2>Your Videos</h2>
      {userVideos === undefined ? (
        <div>Loading...</div>
      ) : userVideos === null ? (
        <div>Error loading videos.</div>
      ) : (
        <ul>
          {userVideos.map((video: any) => (
            <li key={video._id}>
              {video.format === "video" ? (
                <video src={video.url} controls width="320" height="240" />
              ) : (
                <p>
                  {video.format} - {video.body}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
