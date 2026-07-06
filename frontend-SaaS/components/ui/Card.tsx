interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`
        bg-[#FBEACE]
        rounded-xl
        border-[#B8926B]
        border-4
        p-5
        shadow-sm
        ${className}
      `}
    >
      {children}
    </div>
  );
}
