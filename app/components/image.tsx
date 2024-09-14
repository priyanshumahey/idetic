// components/Image.tsx
import React from 'react';

interface ImageProps {
    message: { url: string };
}

export function Image({ message }: ImageProps) {
    return <img src={message.url} height="300px" width="auto" />;
}