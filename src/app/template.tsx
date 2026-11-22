// Re-mounts on every navigation, so each page turns in like a magazine page.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="turn">{children}</div>;
}
