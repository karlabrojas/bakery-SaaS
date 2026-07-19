interface Props {
  status: string;
}

export default function DeliveryStatusBadge({ status }: Props) {
  const styles: any = {
    PENDING: "bg-yellow-100 text-yellow-700",

    ASSIGNED: "bg-blue-100 text-blue-700",

    IN_ROUTE: "bg-purple-100 text-purple-700",

    DELIVERED: "bg-green-100 text-green-700",

    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`
px-3
py-1
rounded-full
font-semibold
text-sm
${styles[status]}
`}
    >
      {status}
    </span>
  );
}
