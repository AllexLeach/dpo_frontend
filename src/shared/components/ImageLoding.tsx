import { useEffect, useState } from "react";
import NoImage from '../../assets/NoImage.webp';
import { Spin } from "antd";


interface ImageLoadingProps {
   src: string;
   alt?: string;
   width?: string | number;
   height?: string | number;
   className?: string;
   style?: React.CSSProperties;
}

export function ImageLoading({ src, alt, width, height, className, style }: ImageLoadingProps) {
   const [imageSrc, setImageSrc] = useState(NoImage);
   const [isLoading, setIsLoading] = useState(true);
   const containerWidth = width? typeof width === 'string'? width: `${width}px`: 'auto';
   const containerHeight = height? typeof height === 'string'? height: `${height}px`: 'auto';

   useEffect(() => {
      setImageSrc(src || NoImage);
   }, [src]);

   return(
      <div
         className={className || 'relative'}
         style={{
            width: containerWidth,
            height: containerHeight
         }}
      >
         <img
            className={`
               w-full h-full
               object-cover rounded-lg flex-shrink-0 
               transition-opacity duration-300
               ${isLoading ? 'opacity-0' : 'opacity-100'}
            `}
            style={style}
            src={imageSrc}
            alt={alt}
            onLoad={() => {
               setIsLoading(false);
            }}
            onError={() => {
               setImageSrc(NoImage);
               setIsLoading(false);
            }}
         />
         {isLoading && (
            <div 
               className="absolute inset-0 flex items-center justify-center rounded-lg"
            >
               <Spin size='medium' />
            </div>
         )}
      </div>
   );
}