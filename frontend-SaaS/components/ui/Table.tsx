interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export default function Table({ headers, children }: TableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[#D9C3A9] bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#FAF4ED] border-b border-[#D9C3A9] text-[#4A3525]">
            {headers.map((header) => (
              <th
                key={header}
                className="px-6 py-3.5 font-bold text-xs uppercase tracking-wider text-[#7C5A42]"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EFE7DE] text-[#4A3525]">
          {children}
        </tbody>
      </table>
    </div>
  );
}
