import { Text } from 'ink';
import React, { useState, useEffect } from 'react';
import { convertToSixel } from './encode.js';

type Props = {
  src: Buffer | string;
  width?: number | string;
  height?: number | string;
  preserveAspectRatio?: boolean;
  maximumFrameRate?: number;
};

const Image = (props: Props): JSX.Element => {
  const { src, width = '100%', height = '100%' } = props;
  const [imageData, setImageData] = useState('');

  useEffect(() => {
    const loadImage = async () => {
      const parsedWidth = typeof width === 'string' ? parseInt(width, 10) : width;
      const parsedHeight = typeof height === 'string' ? parseInt(height, 10) : height;

      setImageData(await convertToSixel(src, parsedWidth || 100, parsedHeight || 100));
    };
    loadImage();
  }, [src, width, height]);

  return <Text>{imageData}</Text>;
};

Image.defaultProps = {
  width: '100%',
  height: '100%',
  preserveAspectRatio: true,
  maximumFrameRate: 30,
};

export default Image;
