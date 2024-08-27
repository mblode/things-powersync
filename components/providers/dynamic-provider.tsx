import dynamic from "next/dynamic";

/**
 * Only use PowerSync in client side rendering
 */
export const DynamicSystemProvider = dynamic(
  () => import("./system-provider"),
  {
    ssr: false,
  }
);
