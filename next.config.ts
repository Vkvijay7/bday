import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    // @ts-ignore
    appIsrStatus: false,
  } as any,
};

export default nextConfig;
