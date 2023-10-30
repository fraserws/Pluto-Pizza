export interface Pizza {
  id: number;
  quantity: number;
  size: string;
  toppings: string[];
  price: number;
}
export interface Order {
  id: number;
  userId: string;
  status: string | null;
  orderNumber: string;
  pizzas: Pizza[];
  totalPrice: number;
  notes: string | null;
  address: string;
  deliveredAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
