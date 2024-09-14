"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation } from "convex/react";
import { Loader2, UploadCloud } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const generateUploadUrl = useMutation(api.videos.generateUploadUrl);
  const sendImage = useMutation(api.videos.sendImage);
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      console.log(user);
    }
  }, [isAuthenticated, user]);

  const videoInput = useRef<HTMLInputElement>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [name] = useState(() => "User " + Math.floor(Math.random() * 10000));

  async function handleSendVideo(event: FormEvent) {
    event.preventDefault();
    setIsUploading(true);

    try {
      // Step 1: Get a short-lived upload URL
      const postUrl = await generateUploadUrl();

      // Step 2: POST the file to the URL
      const xhr = new XMLHttpRequest();
      xhr.open("POST", postUrl);
      xhr.setRequestHeader("Content-Type", selectedVideo!.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          const { storageId } = JSON.parse(xhr.responseText);
          // Step 3: Save the newly allocated storage id to the database
          await sendImage({ storageId, author: name });
          setSelectedVideo(null);
          setUploadProgress(0);
          if (videoInput.current) videoInput.current.value = "";
        } else {
          console.error("Upload failed");
        }
        setIsUploading(false);
      };

      xhr.onerror = () => {
        console.error("Upload failed");
        setIsUploading(false);
      };

      xhr.send(selectedVideo);
    } catch (error) {
      console.error("Error during upload:", error);
      setIsUploading(false);
    }
  }

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Upload Video
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendVideo} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="video-upload" className="text-sm font-medium">
                Choose a video file
              </Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="video-upload"
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      MP4, AVI, MOV (MAX. 100MB)
                    </p>
                  </div>
                  <Input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    ref={videoInput}
                    onChange={(event) =>
                      setSelectedVideo(event.target.files?.[0] || null)
                    }
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            {selectedVideo && (
              <p className="text-sm text-gray-500">
                Selected file: {selectedVideo.name}
              </p>
            )}
            {isUploading && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            onClick={handleSendVideo}
            disabled={!selectedVideo || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Upload Video"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
