
"use client";

import React, { useEffect, useRef } from 'react';

interface AdRendererProps {
  adKey: string;
  width?: number;
  height?: number;
  format?: 'iframe';
}

export const AdRenderer: React.FC<AdRendererProps> = ({ 
    adKey, 
    width = 300, 
    height = 250, 
    format = 'iframe' 
}) => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adContainerRef.current && adKey) {
      // Clear any previous ad content
      adContainerRef.current.innerHTML = '';

      const atOptionsScript = document.createElement('script');
      atOptionsScript.type = 'text/javascript';
      atOptionsScript.innerHTML = `
        atOptions = {
          'key' : '${adKey}',
          'format' : '${format}',
          'height' : ${height},
          'width' : ${width},
          'params' : {}
        };
      `;

      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;
      invokeScript.async = true;

      adContainerRef.current.appendChild(atOptionsScript);
      adContainerRef.current.appendChild(invokeScript);
    }
  }, [adKey, width, height, format]);

  return <div ref={adContainerRef} style={{ width: `${width}px`, height: `${height}px` }} className="flex justify-center items-center"></div>;
};
