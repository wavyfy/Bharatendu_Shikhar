export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`cms-card shadow-md ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="cms-card-header bg-surface-container-high px-6 py-4">
      <h2 className="text-lg font-bold leading-tight text-on-surface tracking-wide">{children}</h2>
    </div>
  );
}

export function CardBody({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`p-6 bg-surface-container-lowest ${className}`}>{children}</div>;
}
