import AdminGuard from "@/components/AdminGuard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  OrderStatus,
  useOrderInquiries,
  useProducts,
  useUpdateOrderStatus,
} from "@/hooks/useQueries";
import type { OrderInquiry } from "@/types";
import { formatINR } from "@/utils/format";
import { ClipboardList, MapPin, Phone, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type StatusFilter = "All" | OrderStatus;

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "All", label: "All Orders" },
  { value: OrderStatus.Pending, label: "Pending" },
  { value: OrderStatus.Confirmed, label: "Confirmed" },
  { value: OrderStatus.Cancelled, label: "Cancelled" },
];

function statusBadge(status: OrderStatus) {
  switch (status) {
    case OrderStatus.Pending:
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-0 text-xs">
          Pending
        </Badge>
      );
    case OrderStatus.Confirmed:
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 text-xs">
          Confirmed
        </Badge>
      );
    case OrderStatus.Cancelled:
      return (
        <Badge className="bg-red-100 text-red-600 hover:bg-red-100 border-0 text-xs">
          Cancelled
        </Badge>
      );
  }
}

function formatDate(ts: bigint): string {
  const ms = Number(ts / BigInt(1_000_000));
  return new Date(ms).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function OrderCard({
  order,
  productMap,
  index,
}: {
  order: OrderInquiry;
  productMap: Map<bigint, string>;
  index: number;
}) {
  const updateMutation = useUpdateOrderStatus();

  async function handleStatusChange(newStatus: string) {
    try {
      await updateMutation.mutateAsync({
        id: order.id,
        status: newStatus as OrderStatus,
      });
      toast.success("Order status updated.");
    } catch {
      toast.error("Could not update order status.");
    }
  }

  return (
    <Card
      className="p-4 md:p-5 shadow-card border-border"
      data-ocid={`admin_orders.item.${index}`}
    >
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-semibold text-foreground text-sm">
              Order #{String(order.id)}
            </span>
            {statusBadge(order.status)}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatDate(order.createdAt)}
          </p>
        </div>
        {/* Status update */}
        <div className="shrink-0">
          <Select
            value={order.status}
            onValueChange={handleStatusChange}
            disabled={updateMutation.isPending}
          >
            <SelectTrigger
              className="w-36 h-8 text-xs"
              data-ocid={`admin_orders.status_select.${index}`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={OrderStatus.Pending}>Pending</SelectItem>
              <SelectItem value={OrderStatus.Confirmed}>Confirmed</SelectItem>
              <SelectItem value={OrderStatus.Cancelled}>Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Customer info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
        <div className="flex items-start gap-1.5 text-sm">
          <User size={14} className="text-muted-foreground mt-0.5 shrink-0" />
          <span className="text-foreground font-medium">
            {order.customerName}
          </span>
        </div>
        <div className="flex items-start gap-1.5 text-sm">
          <Phone size={14} className="text-muted-foreground mt-0.5 shrink-0" />
          <span className="text-foreground">{order.phone}</span>
        </div>
        <div className="flex items-start gap-1.5 text-sm sm:col-span-2">
          <MapPin size={14} className="text-muted-foreground mt-0.5 shrink-0" />
          <span className="text-muted-foreground">{order.address}</span>
        </div>
      </div>

      {/* Items */}
      <div className="bg-muted/40 rounded-lg p-3 mb-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Items
        </p>
        <ul className="space-y-1">
          {order.items.map((item, i) => (
            <li
              key={`${order.id}-item-${item.productId}`}
              className="flex items-center justify-between text-sm"
              data-ocid={`admin_orders.item.${index}.order_item.${i + 1}`}
            >
              <span className="text-foreground">
                {productMap.get(item.productId) ??
                  `Product #${String(item.productId)}`}
              </span>
              <span className="text-muted-foreground ml-2">
                × {String(item.qty)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Order Total</span>
        <span className="font-display font-bold text-primary text-base">
          {formatINR(order.totalAmount)}
        </span>
      </div>
    </Card>
  );
}

function AdminOrdersContent() {
  const { data: orders = [], isLoading } = useOrderInquiries();
  const { data: products = [] } = useProducts();
  const [filter, setFilter] = useState<StatusFilter>("All");

  const productMap = new Map<bigint, string>(
    products.map((p) => [p.id, p.name]),
  );

  const filtered =
    filter === "All" ? orders : orders.filter((o) => o.status === filter);

  const pendingCount = orders.filter(
    (o) => o.status === OrderStatus.Pending,
  ).length;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8" data-ocid="admin_orders.page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="flex-1">
          <h1 className="font-display font-bold text-2xl text-foreground">
            Order Inquiries
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {isLoading ? (
              "Loading…"
            ) : (
              <>
                {orders.length} total
                {pendingCount > 0 && (
                  <span className="ml-2 text-amber-600 font-medium">
                    · {pendingCount} pending
                  </span>
                )}
              </>
            )}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div
        className="flex gap-2 flex-wrap mb-6"
        data-ocid="admin_orders.filter"
      >
        {STATUS_FILTERS.map((f) => {
          const count =
            f.value === "All"
              ? orders.length
              : orders.filter((o) => o.status === f.value).length;
          return (
            <Button
              key={f.value}
              size="sm"
              variant={filter === f.value ? "default" : "outline"}
              onClick={() => setFilter(f.value)}
              className="h-8 text-xs"
              data-ocid={`admin_orders.filter.${f.value.toLowerCase()}_tab`}
            >
              {f.label}
              <span className="ml-1.5 opacity-70">({count})</span>
            </Button>
          );
        })}
      </div>

      {/* Orders list */}
      {isLoading ? (
        <div className="space-y-4" data-ocid="admin_orders.loading_state">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-5 space-y-3">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-16 w-full" />
            </Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="text-center py-16 text-muted-foreground"
          data-ocid="admin_orders.empty_state"
        >
          <ClipboardList size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">
            {filter === "All"
              ? "No orders yet"
              : `No ${filter.toLowerCase()} orders`}
          </p>
          <p className="text-sm mt-1">
            {filter === "All"
              ? "Customer orders will appear here once they start placing inquiries."
              : "Try a different filter to see more orders."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order, idx) => (
            <OrderCard
              key={String(order.id)}
              order={order}
              productMap={productMap}
              index={idx + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminOrders() {
  return (
    <AdminGuard>
      <AdminOrdersContent />
    </AdminGuard>
  );
}
