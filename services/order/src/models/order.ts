export interface NewOrder {
    user_id: number;
    product_name: string;
    amount: number;
}

export interface Order extends NewOrder {
    id: number;
    createdAt: string;
}
