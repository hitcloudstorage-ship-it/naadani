import { Category, OrderStatus, StockStatus, createActor } from "@/backend";
import { ExternalBlob } from "@/backend";
import type { OrderInquiry, Product } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useProducts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useOrderInquiries() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<OrderInquiry[]>({
    queryKey: ["orderInquiries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrderInquiries();
    },
    enabled: !!actor && !isFetching,
  });
}

export interface CreateProductInput {
  name: string;
  description: string;
  priceRupees: number;
  category: Category;
  imageFile: File | null;
  stockStatus: StockStatus;
}

export function useCreateProduct() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateProductInput) => {
      if (!actor) throw new Error("Not connected");
      let blob: ExternalBlob;
      if (input.imageFile) {
        const bytes = new Uint8Array(await input.imageFile.arrayBuffer());
        blob = ExternalBlob.fromBytes(bytes);
      } else {
        blob = ExternalBlob.fromURL("");
      }
      return actor.createProduct(
        input.name,
        input.description,
        BigInt(Math.round(input.priceRupees * 100)),
        input.category,
        blob,
        input.stockStatus,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export interface UpdateProductInput {
  id: bigint;
  name: string;
  description: string;
  priceRupees: number;
  category: Category;
  imageFile: File | null;
  existingBlob: ExternalBlob | null;
  stockStatus: StockStatus;
}

export function useUpdateProduct() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateProductInput) => {
      if (!actor) throw new Error("Not connected");
      let blob: ExternalBlob;
      if (input.imageFile) {
        const bytes = new Uint8Array(await input.imageFile.arrayBuffer());
        blob = ExternalBlob.fromBytes(bytes);
      } else if (input.existingBlob) {
        blob = input.existingBlob;
      } else {
        blob = ExternalBlob.fromURL("");
      }
      return actor.updateProduct(
        input.id,
        input.name,
        input.description,
        BigInt(Math.round(input.priceRupees * 100)),
        input.category,
        blob,
        input.stockStatus,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useDeleteProduct() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteProduct(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useSeedProducts() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      return actor.seedSampleProducts();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });
}

export function useUpdateOrderStatus() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: OrderStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateOrderStatus(id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orderInquiries"] }),
  });
}

export function usePlaceOrder() {
  const { actor } = useActor(createActor);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: import("@/types").PlaceOrderInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.placeOrderInquiry({
        customerName: input.customerName,
        phone: input.phone,
        address: input.address,
        items: input.items,
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["orderInquiries"] }),
  });
}

export { Category, OrderStatus, StockStatus };
