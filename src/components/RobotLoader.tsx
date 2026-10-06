"use client";

import dynamic from "next/dynamic";

// next/dynamic with ssr:false must live in a Client Component — this
// wrapper exists purely so page.tsx (a Server Component) can still use a
// plain import rather than calling dynamic() itself.
const Robot = dynamic(() => import("./Robot"), { ssr: false });

export default function RobotLoader() {
  return <Robot />;
}
