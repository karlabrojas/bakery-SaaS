import { ReactNode } from "react";

interface Props {
  title: string;

  value: string | number;

  icon: ReactNode;
}

export default function SummaryCard({
  title,

  value,

  icon,
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">{title}</p>

          <h2 className="text-3xl font-bold mt-2">{value}</h2>
        </div>

        <div className="text-orange-500">{icon}</div>
      </div>
    </div>
  );
}
