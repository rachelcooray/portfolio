// PageTransition: every route change re-mounts this wrapper, which fades
// the new page in. Reduced motion turns the fade off in CSS.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-fade">{children}</div>;
}
