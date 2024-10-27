import React, { useEffect, useState } from 'react';
import { Text } from 'ink';
import { image2sixel } from 'sixel';
import fs from 'fs';

type ImageProps = {
    input: Buffer | string;
    width?: number | string;
    height?: number | string;
    preserveAspectRatio?: boolean;
};

const Image = ({
    input,
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
        if (Buffer.isBuffer(input)) {
            fileData = new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
        } else if (typeof input === 'string') {
            const buffer = fs.readFileSync(input);
            fileData = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
        } else {
            throw new Error("Invalid input: Buffer or string (file path) expected");
        }

        const adjustedWidth = preserveAspectRatio ? Math.min(parsedWidth, parsedHeight) : parsedWidth;
        const adjustedHeight = preserveAspectRatio ? Math.min(parsedWidth, parsedHeight) : parsedHeight;

        setSixelData(image2sixel(fileData, adjustedWidth, adjustedHeight));
    };

    useEffect(() => {
        loadImageData();
    }, [input, width, height, preserveAspectRatio]);

    return <Text>{sixelData}</Text>;
};

export default Image;
