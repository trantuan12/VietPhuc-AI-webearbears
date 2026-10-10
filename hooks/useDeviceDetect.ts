import { useState, useEffect } from "react";

export interface DeviceInfo {
  isMobile: boolean; // < 768px
  isTablet: boolean; // >= 768px && < 1024px
  isDesktop: boolean; // >= 1024px
  isSmallMobile: boolean; // < 400px
  isPortrait: boolean;
  screenWidth: number;
  screenHeight: number;
  aspectRatio: number;
}

export function useDeviceDetect(): DeviceInfo {
  const getDeviceInfo = (): DeviceInfo => {
    if (typeof window === "undefined") {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isSmallMobile: false,
        isPortrait: false,
        screenWidth: 1280,
        screenHeight: 800,
        aspectRatio: 1280 / 800,
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const isDesktop = width >= 1024;
    const isSmallMobile = width < 400;
    const isPortrait = height > width;

    return {
      isMobile,
      isTablet,
      isDesktop,
      isSmallMobile,
      isPortrait,
      screenWidth: width,
      screenHeight: height,
      aspectRatio: width / (height || 1),
    };
  };

  const [device, setDevice] = useState<DeviceInfo>(getDeviceInfo);

  useEffect(() => {
    let timeoutId: any = null;

    const handleResize = () => {
      // Debounce slightly to smooth out mobile orientation flips and keyboard triggers
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setDevice(getDeviceInfo());
      }, 50);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  return device;
}
