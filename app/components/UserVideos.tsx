/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAuth0 } from "@auth0/auth0-react";
import { useQuery } from "convex/react";
import { useEffect } from "react";
import { api } from "../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Your Videos</h2>
      {userVideos === undefined ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="w-full aspect-video rounded-lg" />
          ))}
        </div>
      ) : userVideos === null ? (
        <div className="text-red-500">Error loading videos.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userVideos.map((video: any) => (
            <div key={video._id} className="bg-gray-100 rounded-lg p-4">
              {video.format === "video" ? (
                <video
                  src={video.url}
                  controls
                  className="w-full aspect-video object-cover rounded-lg"
                />
              ) : (
                <p className="text-gray-700">
                  {video.format} - {video.body}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
