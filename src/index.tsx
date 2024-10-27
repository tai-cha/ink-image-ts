/* eslint-disable react/no-unused-prop-types */
'use strict';
import {Text} from 'ink'
import terminalImage from 'terminal-image'
import React, { useState, useEffect } from 'react'
import fileType from 'file-type'
import { convertToSixel } from './encode.js';


type Props = {
	src: Buffer | string,
	width?: number | string,
	height?: number | string,
	preserveAspectRatio?: boolean,
	maximumFrameRate?: number
}

type GifProps = {
	src: Buffer | string,
	width?: number,
	height?: number,
	preserveAspectRatio?: boolean,
	maximumFrameRate?: number
}

const Image = (props:Props):JSX.Element => {
	const [imageData, setImageData] = useState('');

	useEffect(() => {
		let isPlaying = true;
		(async () => {
			setImageData(await convertToSixel(props.src, Number(props.width), Number(props.height)));
		})();

		return () => {
			isPlaying = false;
		};
	}, [props]);

	return <Text>{imageData}</Text>;
};

Image.defaultProps = {
	width: '100%',
	height: '100%',
	preserveAspectRatio: true,
	maximumFrameRate: 30
};

export default Image
