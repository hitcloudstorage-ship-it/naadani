import AdminGuard from "@/components/AdminGuard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  OrderStatus,
  useOrderInquiries,
  useProducts,
} from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { ClipboardList, Package, ShoppingBag, TrendingUp } from "lucide-react";

function AdminDashboardContent() {
  const { data: products, isLoading: loadingProducts } = useProducts();
  const { data: orders, isLoading: loadingOrders } = useOrderInquiries();

  const totalProducts = products?.length ?? 0;
  const pendingOrders =
    orders?.filter((o) => o.status === OrderStatus.Pending).length ?? 0;
  const totalOrders = orders?.length ?? 0;
  const confirmedOrders =
    orders?.filter((o) => o.status === OrderStatus.Confirmed).length ?? 0;

  const stats = [
    {
      label: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "text-primary",
      bg: "bg-primary/10",
      loading: loadingProducts,
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      icon: ClipboardList,
      color: "text-muted-foreground",
      bg: "bg-muted",
      loading: loadingOrders,
    },
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      color: "text-secondary-foreground",
      bg: "bg-secondary/50",
      loading: loadingOrders,
    },
    {
      label: "Confirmed Orders",
      value: confirmedOrders,
      icon: TrendingUp,
      color: "text-secondary-foreground",
      bg: "bg-secondary/20",
      loading: loadingOrders,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8" data-ocid="admin.page">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-1">
          Welcome back, Admin 👋
        </h1>
        <p className="text-muted-foreground text-sm">
          Here's a quick overview of your Naadani.in store.
        </p>
      </div>

      {/* Stats */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        data-ocid="admin.stats"
      >
        {stats.map((s) => (
          <Card
            key={s.label}
            className="p-4 flex flex-col gap-3 shadow-card border-border"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg}`}
            >
              <s.icon size={20} className={s.color} />
            </div>
            {s.loading ? (
              <>
                <Skeleton className="h-7 w-12" />
                <Skeleton className="h-4 w-20" />
              </>
            ) : (
              <>
                <p className={`font-display font-bold text-2xl ${s.color}`}>
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </>
            )}
          </Card>
        ))}
      </div>

      {/* Quick Nav */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        data-ocid="admin.quick_nav"
      >
        <Card className="p-6 shadow-card border-border hover:shadow-md transition-smooth group">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <Package size={24} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display font-semibold text-lg text-foreground mb-1">
                Manage Products
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                Add, edit, or remove products. Upload images and manage stock.
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {loadingProducts ? "—" : `${totalProducts} products`}
                </Badge>
              </div>
            </div>
          </div>
          <Link to="/admin/products" data-ocid="admin.products_link">
            <Button className="w-full mt-4" variant="outline">
              Go to Products
            </Button>
          </Link>
        </Card>

        <Card className="p-6 shadow-card border-border hover:shadow-md transition-smooth group">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center shrink-0">
              <ClipboardList size={24} className="text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-display font-semibold text-lg text-foreground mb-1">
                Order Inquiries
              </h2>
              <p className="text-sm text-muted-foreground mb-4">
                View and manage customer orders. Update statuses and track
                fulfilment.
              </p>
              <div className="flex items-center gap-2">
                {pendingOrders > 0 && (
                  <Badge className="text-xs bg-primary text-primary-foreground hover:bg-primary/90">
                    {pendingOrders} pending
                  </Badge>
                )}
                <Badge variant="secondary" className="text-xs">
                  {loadingOrders ? "—" : `${totalOrders} total`}
                </Badge>
              </div>
            </div>
          </div>
          <Link to="/admin/orders" data-ocid="admin.orders_link">
            <Button className="w-full mt-4" variant="outline">
              Go to Orders
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

export default function Admin() {
  return (
    <AdminGuard>
      <AdminDashboardContent />
    </AdminGuard>
  );
}
