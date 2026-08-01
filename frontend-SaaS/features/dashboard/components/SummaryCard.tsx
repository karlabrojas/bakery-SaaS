import { ReactNode } from "react";

interface Props {
  title: string;
  value: string | number;
  icon: ReactNode;
}

export default function SummaryCard({ title, value, icon }: Props) {
  return (
    <div className="bg-white rounded-xl border-2 border-[#B8926B] shadow-md p-6 transition-all hover:shadow-lg">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold text-[#8C6D53]">{title}</p>
          <h2 className="text-3xl font-extrabold text-[#472D20] mt-2">
            {value}
          </h2>
        </div>
        <div className="p-3 rounded-xl bg-[#FBEACE] border border-[#B8926B] text-[#472D20]">
          {icon}
        </div>
      </div>
    </div>
  );
}
