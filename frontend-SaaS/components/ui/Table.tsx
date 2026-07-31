interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export default function Table({ headers, children }: TableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border-2 border-[#B8926B] bg-[#FFF8E0] shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#FBEACE] border-b-2 border-[#B8926B] text-[#472D20]">
            {headers.map((header) => (
              <th
                key={header}
                className="px-6 py-3.5 font-bold text-sm tracking-wide"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EAD9B6] text-[#5A2E1F]">
          {children}
        </tbody>
      </table>
    </div>
  );
}
