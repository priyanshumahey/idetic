import React from 'react';

interface VideoProps {
    url: string;
    title: string;
    author: string;
}

export function Video({ url, title, author }: VideoProps) {
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <video controls width="100%" className="aspect-video">
                <source src={url} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">Uploaded by: {author}</p>
            </div>
        </div>
    );
}