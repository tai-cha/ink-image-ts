import React, { useEffect, useState } from 'react';
import { Text } from 'ink';
import { image2sixel } from 'sixel';
import sharp from 'sharp';
import fs from 'fs';

type ImageProps = {
    src: Buffer | string;
    width?: number | string;
    height?: number | string;
    preserveAspectRatio?: boolean;
};

function padToMultipleOf4(data: Uint8Array): Uint8Array {
    const remainder = data.byteLength % 4;
    if (remainder === 0) return data;

    const paddedData = new Uint8Array(data.byteLength + (4 - remainder));
    paddedData.set(data);
    return paddedData;
}

const Image = ({
    src,
    width = 100,
    height = 100,
    preserveAspectRatio = true
}: ImageProps): JSX.Element => {
    const [sixelData, setSixelData] = useState<string>("");

    const parseDimension = (dim: number | string): number => {
        if (typeof dim === "string") {
            if (dim.endsWith("%")) {
                return parseInt(dim, 10) / 100;
            }
            return parseInt(dim, 10);
        }
        return dim;
    };

    const parsedWidth = parseDimension(width);
    const parsedHeight = parseDimension(height);

    const loadImageData = async () => {
        let imageBuffer: Buffer;
        if (Buffer.isBuffer(src)) {
            imageBuffer = src;
        } else if (typeof src === 'string') {
            imageBuffer = fs.readFileSync(src);
        } else {
            throw new Error("Invalid src: Buffer or string (file path) expected");
        }

        const image = sharp(imageBuffer);
        const metadata = await image.metadata();
        const srcWidth = metadata.width || parsedWidth;
        const srcHeight = metadata.height || parsedHeight;

        let targetWidth = parsedWidth;
        let targetHeight = parsedHeight;
        if (preserveAspectRatio) {
            const aspectRatio = srcWidth / srcHeight;
            if (parsedWidth / parsedHeight > aspectRatio) {
                targetWidth = Math.round(parsedHeight * aspectRatio);
            } else {
                targetHeight = Math.round(parsedWidth / aspectRatio);
            }
        }

        const resizedBuffer = await image
            .resize(targetWidth, targetHeight, { fit: preserveAspectRatio ? 'inside' : 'fill' })
            .raw()
            .toBuffer();

        const paddedData = padToMultipleOf4(new Uint8Array(resizedBuffer));
        setSixelData(image2sixel(paddedData, targetWidth, targetHeight));
    };

    useEffect(() => {
        loadImageData();
    }, [src, width, height, preserveAspectRatio]);

    return <Text>{sixelData}</Text>;
};

export default Image;
