import React from 'react';

interface VideoMessageProps {
    message: {
        url: string;
        format: string;
    }
}

export function Video({ message }: VideoMessageProps) {
    if (message.format !== "video" || !message.url) {
        return <div>Invalid video message</div>;
    }

    return (
        <video controls width="100%" style={{ maxHeight: "300px" }}>
            <source src={message.url} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    );
}