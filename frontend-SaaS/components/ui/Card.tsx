interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`
        bg-[#FFF8E0]
        rounded-xl
        border-2
        border-[#B8926B]
        p-6
        shadow-md
        transition-all
        ${className}
      `}
    >
      {children}
    </div>
  );
}
