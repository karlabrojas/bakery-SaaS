import Table from "@/components/ui/Table";

export default function SalesHistoryTable() {
  const sales = [
    {
      date: "10/06/2026",
      folio: "0001",
      total: "$25.00",
      payment: "Efectivo",
    },
  ];

  return (
    <Table headers={["Fecha", "Folio", "Total", "Pago"]}>
      {sales.map((sale) => (
        <tr key={sale.folio}>
          <td>{sale.date}</td>
          <td>{sale.folio}</td>
          <td>{sale.total}</td>
          <td>{sale.payment}</td>
        </tr>
      ))}
    </Table>
  );
}
