'use client';
import { useState } from 'react';
import { SearchIcon, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle"

export default function StreamPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [modal, setModal] = useState(false);

    function toggleModal() {
        setModal(!modal);
    }

    return (
        <div className="flex h-screen relative">
            <div className="flex-grow flex flex-col">
                <div className="p-4 border-b grid grid-cols-3">
                    <div className=" col-span-2 flex items-center w-full space-x-4 relative">
                        <SearchIcon className="w-6 h-6 text-gray-400 absolute left-8" />
                        <Input
                            placeholder="Type in a search query"
                            type="text"
                            onChange={(event) => {
                                setSearchTerm(event.target.value);
                            }}
                            className="w-full rounded-full p-6 text-xl pl-14"
                        />
                    </div>
                    <div className='col-start-3 flex items-center justify-end'>
                        <button onClick={toggleModal}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="flex-grow flex flex-col p-4">
                    <div className="flex-grow bg-black rounded-md flex items-center justify-center mb-4">
                        <span className="text-white">video here</span>
                    </div>
                    <div className='flex flex-col gap-5'>
                        <div className='flex justify-center'>
                            <h2>Timestamp</h2>
                        </div>
                        <div className="flex justify-center space-x-4">
                            {['1:05', '2:05', '3:05', '4:05'].map((num) => (
                                <Toggle key={num} className="px-4 py-2 rounded">
                                    <b>{num}</b>
                                </Toggle>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {modal && (
                <div className="fixed inset-y-0 right-0 w-full sm:w-64 bg-white border-l shadow-lg flex flex-col z-50 transition-transform duration-300 ease-in-out overflow-hidden">
                    <div className="p-4 border-b flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Similar moments:</h2>
                        <button onClick={toggleModal} className="text-gray-500 hover:text-gray-700">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        <div className="flex flex-col p-4 gap-3">
                            {['video1', 'video2', 'video3', 'video4', 'video5', 'video6', 'video7', 'video8', 'video9', 'video10'].map((number) => (
                                <div key={number} className="aspect-square bg-gray-200 flex items-center justify-center hover:bg-gray-300">
                                    {number}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}