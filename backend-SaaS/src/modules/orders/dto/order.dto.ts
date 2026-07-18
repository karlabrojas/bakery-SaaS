export interface CreateOrderDTO {
    customerId?: string;
    deliveryType: "PICKUP" | "DELIVERY";
    deliveryDate: string;
    deliveryTime: string;
    discount?: number;
    notes?: string;
    items: {
        productId: string;
        quantity: number;
        observations?: string;
    }[];
}

export interface UpdateOrderDTO {
    customerId?: string;
    deliveryType?: "PICKUP" | "DELIVERY";
    deliveryDate?: string;
    deliveryTime?: string;
    discount?: number;
    notes?: string;
    items?: {
        productId: string;
        quantity: number;
        observations?: string;
    }[];
}

export interface ChangeStatusDTO {
    status: "PENDING" | "CONFIRMED" | "IN_PRODUCTION" | "READY" | "DELIVERED" | "CANCELLED";
    comments?: string;
}