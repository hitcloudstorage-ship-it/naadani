import { createActor } from "@/backend";
import { Category, StockStatus } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types";
import { formatINR } from "@/utils/format";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronRight,
  Home,
  Minus,
  PackageX,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const CATEGORY_COLORS: Record<Category, string> = {
  [Category.Clothing]: "bg-primary/10 text-primary border-primary/20",
  [Category.Diapers]:
    "bg-secondary/20 text-secondary-foreground border-secondary/30",
  [Category.Gear]: "bg-muted text-muted-foreground border-muted-foreground/20",
  [Category.Toys]: "bg-accent/20 text-accent-foreground border-accent/30",
};

const CATEGORY_GRADIENT: Record<Category, string> = {
  [Category.Clothing]: "from-primary/10 via-primary/5 to-transparent",
  [Category.Diapers]: "from-secondary/20 via-secondary/10 to-transparent",
  [Category.Gear]: "from-muted via-muted/50 to-transparent",
  [Category.Toys]: "from-accent/20 via-accent/10 to-transparent",
};

function ProductDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        {["crumb-0", "crumb-1", "crumb-2", "crumb-3"].map((id, i) => (
          <div key={id} className="flex items-center gap-2">
            <Skeleton className="h-4 w-16 rounded" />
            {i < 3 && <Skeleton className="h-3 w-3 rounded" />}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <Skeleton className="aspect-square rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-10 w-3/4 rounded" />
          <Skeleton className="h-8 w-32 rounded" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-2/3 rounded" />
          </div>
          <Skeleton className="h-12 w-36 rounded-xl" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div
      data-ocid="product_detail.error_state"
      className="max-w-md mx-auto px-4 py-20 text-center"
    >
      <div className="mb-6 flex justify-center">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
          <PackageX className="w-12 h-12 text-muted-foreground" />
        </div>
      </div>
      <h2 className="font-display text-2xl font-bold text-foreground mb-3">
        Product Not Found
      </h2>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        Oops! We couldn't find this product. It may have been removed or is no
        longer available.
      </p>
      <Button asChild className="gap-2">
        <Link to="/catalog" data-ocid="product_detail.catalog_link">
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>
      </Button>
    </div>
  );
}

export default function ProductDetail() {
  const { productId } = useParams({ from: "/catalog/$productId" });
  const id = BigInt(productId);
  const { actor, isFetching } = useActor(createActor);
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);
  const [qty, setQty] = useState(1);

  const { data: product, isLoading } = useQuery<Product | null>({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!actor) return null;
      const result = await actor.getProduct(id);
      if (Array.isArray(result) && result.length > 0)
        return result[0] as Product;
      return null;
    },
    enabled: !!actor && !isFetching,
  });

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return <NotFound />;
  }

  const catKey =
    typeof product.category === "string"
      ? product.category
      : Object.keys(product.category)[0];
  const gradientCls =
    CATEGORY_GRADIENT[product.category as Category] ??
    "from-muted via-muted/50 to-muted";
  const colorCls =
    CATEGORY_COLORS[product.category as Category] ??
    "bg-muted text-muted-foreground border-border";
  const imageUrl = product.imageKey?.getDirectURL?.() ?? "";
  const isOutOfStock = product.stockStatus === StockStatus.OutOfStock;
  const inCart = cartItems.some((i) => i.productId === product.id);

  function handleAddToCart() {
    if (!product || isOutOfStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl,
      quantity: qty,
    });
    toast.success(`${product.name} added to cart!`);
  }

  return (
    <div
      className="max-w-5xl mx-auto px-4 py-8"
      data-ocid="product_detail.page"
    >
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-foreground transition-colors">
          <Home size={14} />
        </Link>
        <ChevronRight size={12} />
        <Link
          to="/catalog"
          className="hover:text-foreground transition-colors"
          data-ocid="product_detail.catalog_breadcrumb"
        >
          Shop
        </Link>
        <ChevronRight size={12} />
        <span className="text-foreground font-medium truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={`aspect-square rounded-2xl overflow-hidden bg-gradient-to-br ${gradientCls} relative`}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-8xl opacity-30">
                {catKey === "Clothing"
                  ? "👶"
                  : catKey === "Diapers"
                    ? "🍼"
                    : catKey === "Gear"
                      ? "🛒"
                      : "🧸"}
              </span>
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center">
              <span className="bg-card/90 text-foreground text-sm font-semibold px-4 py-2 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col gap-4"
        >
          <span
            className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full border ${colorCls}`}
          >
            {catKey}
          </span>

          <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground leading-snug">
            {product.name}
          </h1>

          <p className="font-display font-bold text-3xl text-primary">
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              minimumFractionDigits: 0,
            }).format(Number(product.price) / 100)}
          </p>

          <span
            className={`self-start text-xs font-semibold px-2.5 py-1 rounded-full ${
              isOutOfStock
                ? "bg-destructive/10 text-destructive border border-destructive/20"
                : "bg-secondary/20 text-secondary-foreground border border-secondary/30"
            }`}
            data-ocid="product_detail.stock_badge"
          >
            {isOutOfStock ? "Out of Stock" : "In Stock"}
          </span>

          <p className="text-muted-foreground text-sm leading-relaxed">
            {product.description}
          </p>

          {/* Qty + Add to cart */}
          {!isOutOfStock && (
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center border border-input rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-foreground hover:bg-muted transition-colors"
                  aria-label="Decrease quantity"
                  data-ocid="product_detail.qty_decrease_button"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-medium text-sm">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="px-3 py-2 text-foreground hover:bg-muted transition-colors"
                  aria-label="Increase quantity"
                  data-ocid="product_detail.qty_increase_button"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 h-11 rounded-xl font-semibold text-sm transition-smooth ${
                  inCart
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
                data-ocid="product_detail.add_to_cart_button"
              >
                <ShoppingCart size={16} />
                {inCart ? "Added to Cart ✓" : "Add to Cart"}
              </button>
            </div>
          )}

          <Link
            to="/catalog"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mt-2"
            data-ocid="product_detail.back_to_shop_link"
          >
            <ArrowLeft size={14} />
            Back to Shop
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
