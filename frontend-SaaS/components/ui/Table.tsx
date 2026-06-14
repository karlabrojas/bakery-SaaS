interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export default function Table({ headers, children }: TableProps) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-[#472D20]">
          {headers.map((header) => (
            <th key={header} className="text-left py-3">
              {header}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>{children}</tbody>
    </table>
  );
}
