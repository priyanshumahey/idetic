// components/Image.tsx

interface ImageProps {
    message: { url: string };
}

export function Image({ message }: ImageProps) {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img src={message.url} height="300px" width="auto" />;
}