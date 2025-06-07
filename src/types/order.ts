export interface Order {
    id: number;
    for_name: string;
    for_email: string;
    order_date: string;
    status: 'pending' | 'completed' | 'cancelled';
    total: number;
    created_at?: string;
    updated_at?: string;
} 