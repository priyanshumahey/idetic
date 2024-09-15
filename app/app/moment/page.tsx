"use client";
import { Input } from "@/components/ui/input";
import { search } from "@/lib/utils";
import { SearchIcon, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function StreamPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [videoReccs, setVideoReccs] = useState<any[]>([]);
  const [seletectedVideo, setSelectedVideo] = useState(0);

  const [selectedTimestamp, setSelectedTimestamp] = useState<string | null>(
    null
  );
  const searchParams = useSearchParams();

  useEffect(() => {
    const search_term = searchParams.get("query")!;
    setSearchTerm(search_term);
    const fetchData = async () => {
      try {
        setLoading(true);
        const json = await search(search_term);
        json.sort((a: any, b: any) => b.score - a.score);
        console.log(json);
        console.log(typeof json);

        let processed: any[] = [];
        for (let i = 0; i < json.length; i++) {
          let found = false;
          for (let j = 0; j < processed.length; j++) {
            if (processed[j].videoId === json[i].videoId) {
              processed[j].timestamps = [
                ...processed[j].timestamps,
                json[i].timeStamp,
              ];
              found = true;
            }
          }
          if (!found) {
            processed.push({
              videoId: json[i].videoId,
              timestamps: [json[i].timeStamp],
            });
          }
        }
        setVideoReccs(processed);
        // Process the JSON

        console.log(processed);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function toggleModal() {
    setModal(!modal);
  }

  function handleTimestampClick(timestamp: string | null) {
    setSelectedTimestamp(timestamp === selectedTimestamp ? null : timestamp);
  }

  return (
    <>
      {loading && <div>Loading...</div>}
      {!loading && (
        <div className="flex h-screen relative">
          <div className="flex-grow flex flex-col">
            <div className="p-4 border-b grid grid-cols-3">
              <div className=" col-span-2 flex items-center w-full space-x-4 relative">
                <SearchIcon className="w-6 h-6 text-gray-400 absolute left-8" />
                <Input
                  placeholder={searchTerm}
                  type="text"
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                  }}
                  className="w-full rounded-full p-6 text-xl pl-14"
                />
              </div>
              <div className="col-start-3 flex items-center justify-end">
                <button onClick={toggleModal}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-grow flex flex-col p-4">
            {/* Main Video */}
              <div className="flex-grow bg-black rounded-md flex items-center justify-center mb-4">
                <video
                  className="flex-grow h-[70vh] bg-black rounded-md flex items-center justify-center mb-4  aspect-video rounded-sm shadow-lg"
                  src={""}
                  controls
                />

              </div>
              <div className="flex flex-col gap-5">
                {/* Video Timestamps */}
                <div className="flex justify-center space-x-4">
                  {["1:05", "2:05", "3:05", "4:05"].map((timestamp) => (
                    <button
                      key={timestamp}
                      className={`px-4 py-2 rounded transition-colors ${
                        selectedTimestamp === timestamp
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      onClick={() => handleTimestampClick(timestamp)}
                    >
                      {timestamp}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {modal && (
            <div className="fixed inset-y-0 right-0 w-full sm:w-64 bg-white border-l shadow-lg flex flex-col z-50 transition-transform duration-300 ease-in-out overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">Similar moments:</h2>
                <button
                  onClick={toggleModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1">
                <div className="flex flex-col p-4 gap-3">
                  {[
                    "video1",
                    "video2",
                    "video3",
                    "video4",
                    "video5",
                    "video6",
                    "video7",
                    "video8",
                    "video9",
                    "video10",
                  ].map((number) => (
                    <div
                      key={number}
                      className="aspect-square bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                    >
                      {number}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
