export interface RecentOrder {
  id: string;

  folio: string;

  customer: {
    id: string;
    name: string;
  } | null;

  total: number;

  status: string;

  deliveryDate: string;

  deliveryTime: string;
}
