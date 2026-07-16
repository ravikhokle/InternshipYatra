export const PageContainer = ({ children, className = "" }) => (
  <div className={`max-w-7xl mx-auto w-full min-w-0 px-4 sm:px-6 box-border ${className}`}>
    {children}
  </div>
);

export const SidebarMainRow = ({ sidebar, children }) => (
  <div className="grid grid-cols-1 lg:grid-cols-[20rem_minmax(0,1fr)] gap-6 lg:gap-8 items-start w-full min-w-0">
    <div className="min-w-0 w-full">{sidebar}</div>
    <div className="min-w-0 w-full overflow-hidden">{children}</div>
  </div>
);
