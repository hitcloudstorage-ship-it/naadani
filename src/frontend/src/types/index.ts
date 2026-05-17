import type {
  Category,
  ExternalBlob,
  OrderStatus,
  StockStatus,
} from "@/backend";

export type { Category, OrderStatus, StockStatus, ExternalBlob };

export interface Product {
  id: bigint;
  name: string;
  description: string;
  price: bigint;
  category: Category;
  imageKey: ExternalBlob;
  stockStatus: StockStatus;
  createdAt: bigint;
}

export interface CartItem {
  productId: bigint;
  name: string;
  price: bigint;
  imageUrl: string;
  quantity: number;
}

export interface OrderItem {
  productId: bigint;
  qty: bigint;
}

export interface OrderInquiry {
  id: bigint;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalAmount: bigint;
  status: OrderStatus;
  createdAt: bigint;
}

export interface PlaceOrderInput {
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
}
