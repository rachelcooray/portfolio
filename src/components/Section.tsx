import { ReactNode } from "react";

export function Section({
  id,
  title,
  surface = false,
  children,
}: {
  id: string;
  title?: string;
  surface?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-guide-id={id}
      className={`px-6 py-16 md:py-20 ${surface ? "bg-surface" : ""}`}
    >
      <div className="mx-auto max-w-[680px]">
        {title && (
          <h2 className="font-heading italic text-[28px] md:text-[34px] font-semibold mb-8 text-text">
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
}
