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

const Image = ({
    src: src,
    width = 100, // デフォルトの幅
    height = 100, // デフォルトの高さ
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
            fileData = new Uint8Array(src.buffer, src.byteOffset, src.byteLength);
        } else if (typeof src === 'string') {
            const buffer = fs.readFileSync(src);
            fileData = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
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
