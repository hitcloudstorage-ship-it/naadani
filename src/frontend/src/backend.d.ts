import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Timestamp = bigint;
export interface PlaceOrderInput {
    customerName: string;
    address: string;
    phone: string;
    items: Array<OrderItem>;
}
export interface OrderItem {
    qty: bigint;
    productId: ProductId;
}
export interface OrderInquiry {
    id: OrderId;
    customerName: string;
    status: OrderStatus;
    createdAt: Timestamp;
    totalAmount: bigint;
    address: string;
    phone: string;
    items: Array<OrderItem>;
}
export type ProductId = bigint;
export type OrderId = bigint;
export interface Product {
    id: ProductId;
    stockStatus: StockStatus;
    name: string;
    createdAt: Timestamp;
    description: string;
    imageKey: ExternalBlob;
    category: Category;
    price: bigint;
}
export enum Category {
    Diapers = "Diapers",
    Gear = "Gear",
    Toys = "Toys",
    Clothing = "Clothing"
}
export enum OrderStatus {
    Confirmed = "Confirmed",
    Cancelled = "Cancelled",
    Pending = "Pending"
}
export enum StockStatus {
    OutOfStock = "OutOfStock",
    InStock = "InStock"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProduct(name: string, description: string, price: bigint, category: Category, imageKey: ExternalBlob, stockStatus: StockStatus): Promise<Product>;
    deleteProduct(id: ProductId): Promise<boolean>;
    getCallerUserRole(): Promise<UserRole>;
    getOrderInquiries(): Promise<Array<OrderInquiry>>;
    getProduct(id: ProductId): Promise<Product | null>;
    isCallerAdmin(): Promise<boolean>;
    listProducts(): Promise<Array<Product>>;
    listProductsByCategory(category: Category): Promise<Array<Product>>;
    placeOrderInquiry(input: PlaceOrderInput): Promise<OrderInquiry>;
    searchProducts(searchQuery: string): Promise<Array<Product>>;
    seedSampleProducts(): Promise<void>;
    updateOrderStatus(id: OrderId, status: OrderStatus): Promise<boolean>;
    updateProduct(id: ProductId, name: string, description: string, price: bigint, category: Category, imageKey: ExternalBlob, stockStatus: StockStatus): Promise<boolean>;
}
