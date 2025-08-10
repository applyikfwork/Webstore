
"use client";

import React, { useEffect, useRef } from 'react';

interface AdRendererProps {
  adCode: string;
}

export const AdRenderer: React.FC<AdRendererProps> = ({ adCode }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adContainerRef.current && adCode) {
      // Clear any previous ad content
      adContainerRef.current.innerHTML = '';

      const fragment = document.createDocumentFragment();
      
      // Create a temporary div to parse the adCode string
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = adCode;

      // The main script is often inside a div or directly in the string
      const scriptElement = tempDiv.querySelector('script');

      if (scriptElement) {
        const script = document.createElement('script');
        // Copy attributes from the parsed script to the new one
        for (let i = 0; i < scriptElement.attributes.length; i++) {
          const attr = scriptElement.attributes[i];
          script.setAttribute(attr.name, attr.value);
        }
        script.innerHTML = scriptElement.innerHTML; // Copy inline script content
        fragment.appendChild(script);
      } else {
         // If no script tag is found, it might be a simpler ad tag.
         // Fallback to the original method, just in case.
         adContainerRef.current.innerHTML = adCode;
         return;
      }
      
      adContainerRef.current.appendChild(fragment);
    }
  }, [adCode]);

  return <div ref={adContainerRef} className="w-full h-full flex justify-center items-center"></div>;
};
