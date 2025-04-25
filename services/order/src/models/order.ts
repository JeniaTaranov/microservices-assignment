export interface NewOrder {
    userId: number;
    product: string;
    quantity: number;
    price: number;
}

export interface Order extends NewOrder {
    createdAt: string;
}
