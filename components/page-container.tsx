import { ReactNode } from "react";

type PageContainerProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
};

export default function PageContainer({
  title,
  subtitle,
  action,
  children,
}: PageContainerProps) {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12 md:px-10">
      <div className="mb-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-950">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-3 text-sm text-gray-600 md:text-base">{subtitle}</p>
          ) : null}
        </div>

        {action ? <div className="shrink-0">{action}</div> : null}
      </div>

      {children}
    </div>
  );
}
