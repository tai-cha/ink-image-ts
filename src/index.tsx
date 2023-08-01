/* eslint-disable react/no-unused-prop-types */
'use strict';
import {Text} from 'ink'
import terminalImage from 'terminal-image'
import React, { useState, useEffect } from 'react'
import fileType from 'file-type'

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

const convertPropsToGifProps = (props:Props):GifProps => {
	let width:number|undefined = typeof props.width === 'string' ? undefined : props.width
	let height:number|undefined = typeof props.height === 'string' ? undefined : props.height

	return {...props, width, height}
}

const Image = (props:Props):JSX.Element => {
	const [imageData, setImageData] = useState('');

	useEffect(() => {
		let isPlaying = true;
		(async () => {
			if (Buffer.isBuffer(props.src)) {
				if ((await fileType.fromBuffer(props.src).then(ft => ft?.ext)) === 'gif') {
					const stopAnimation = terminalImage.gifBuffer(props.src, {
						...convertPropsToGifProps(props),
						renderFrame: (imageData:string) => {
							if (isPlaying) {
								setImageData(imageData);
							} else {
								stopAnimation();
							}
						}
					});
				} else {
					setImageData(await terminalImage.buffer(props.src, props));
				}
			} else if ((await fileType.fromFile(props.src).then(ft => ft?.ext)) === 'gif') {
				const stopAnimation = terminalImage.gifFile(props.src, {
					...convertPropsToGifProps(props),
					renderFrame: imageData => {
						if (isPlaying) {
							setImageData(imageData);
						} else {
							stopAnimation();
						}
					}
				});
			} else {
				setImageData(await terminalImage.file(props.src, props));
			}
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
