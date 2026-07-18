export interface Order {
    id: string;
    folio: string;
    bakery_id: string;
    customer_id?: string;
    status: "PENDING" | "CONFIRMED" | "IN_PRODUCTION" | "READY" | "DELIVERED" | "CANCELLED";
    delivery_type: "PICKUP" | "DELIVERY";
    delivery_date: string;
    delivery_time: string;
    subtotal: number;
    discount: number;
    total: number;
    notes?: string;
    created_by: string;
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    observations?: string;
}

export interface OrderStatusHistory {
    id: string;
    order_id: string;
    previous_status?: string;
    current_status: string;
    changed_by: string;
    comments?: string;
    changed_at: string;
}