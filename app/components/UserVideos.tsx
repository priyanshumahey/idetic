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
            <div key={index} className="relative w-full aspect-video">
              <Skeleton className="w-full h-full rounded-lg" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      ) : userVideos === null ? (
        <div className="text-red-500">Error loading videos.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-5">
          {userVideos.map((video: any) => (
            <div key={video._id} className="bg-gray-100 rounded-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 cursor-pointer">
              {video.format === "video" ? (
                <video
                  src={video.url}
                  controls
                  className="w-full aspect-video rounded-sm shadow-lg"
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
