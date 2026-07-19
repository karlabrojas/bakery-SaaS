interface Props {
  status: string;
}

export default function DeliveryTimeline({ status }: Props) {
  const states = ["PENDING", "ASSIGNED", "IN_ROUTE", "DELIVERED"];

  const current = states.indexOf(status);

  return (
    <div className="space-y-3">
      {states.map((item, index) => (
        <div key={item} className="flex gap-3 items-center">
          <div
            className={`
w-4
h-4
rounded-full

${index <= current ? "bg-[#472D20]" : "bg-gray-300"}

`}
          />

          <p>{item}</p>
        </div>
      ))}
    </div>
  );
}
