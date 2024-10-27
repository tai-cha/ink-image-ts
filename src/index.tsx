import React, { useEffect, useState } from 'react';
import { Text } from 'ink';
import { image2sixel } from 'sixel';
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

    const loadImageData = () => {
        let fileData: Uint8Array;
        if (Buffer.isBuffer(src)) {
            fileData = padToMultipleOf4(new Uint8Array(src.buffer, src.byteOffset, src.byteLength));
        } else if (typeof src === 'string') {
            const buffer = fs.readFileSync(src);
            fileData = padToMultipleOf4(new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength));
        } else {
            throw new Error("Invalid src: Buffer or string (file path) expected");
        }

        const adjustedWidth = preserveAspectRatio ? Math.min(parsedWidth, parsedHeight) : parsedWidth;
        const adjustedHeight = preserveAspectRatio ? Math.min(parsedWidth, parsedHeight) : parsedHeight;

        setSixelData(image2sixel(fileData, adjustedWidth, adjustedHeight));
    };

    useEffect(() => {
        loadImageData();
    }, [src, width, height, preserveAspectRatio]);

    return <Text>{sixelData}</Text>;
};

export default Image;
