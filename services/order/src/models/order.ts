export interface NewOrder {
    userId: number;
    product: string;
    quantity: number;
}

export interface Order extends NewOrder {
    id: number;
    createdAt: string;
}
