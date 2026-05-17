import { Category, createActor } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types";
import { formatINR } from "@/utils/format";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// ── Category config ────────────────────────────────────────────────────────
const CATEGORIES: { label: string; value: "All" | Category }[] = [
  { label: "All", value: "All" },
  { label: "Clothing", value: Category.Clothing },
  { label: "Diapers", value: Category.Diapers },
  { label: "Gear", value: Category.Gear },
  { label: "Toys", value: Category.Toys },
];

const CATEGORY_BADGE: Record<string, string> = {
  Clothing: "bg-primary/10 text-primary border-primary/20",
  Diapers: "bg-accent/20 text-accent-foreground border-accent/30",
  Gear: "bg-secondary/20 text-secondary-foreground border-secondary/30",
  Toys: "bg-muted text-muted-foreground border-muted-foreground/20",
};

const CATEGORY_GRADIENT: Record<string, string> = {
  Clothing: "from-primary/10 via-primary/5 to-transparent",
  Diapers: "from-accent/20 via-accent/10 to-transparent",
  Gear: "from-secondary/20 via-secondary/10 to-transparent",
  Toys: "from-muted via-muted/50 to-transparent",
};

// ── Query hook ─────────────────────────────────────────────────────────────
function useProducts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProducts() as Promise<Product[]>;
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Debounce hook ──────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ── Skeleton card ──────────────────────────────────────────────────────────
function ProductCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-card border border-border">
      <Skeleton className="aspect-square w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-16 rounded-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        <Skeleton className="h-9 w-full rounded-xl" />
      </div>
    </div>
  );
}

// ── Product card ───────────────────────────────────────────────────────────
function ProductCard({ product, index }: { product: Product; index: number }) {
  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);
  const inCart = cartItems.some((i) => i.productId === product.id);
  const isOutOfStock = product.stockStatus === "OutOfStock";
  const catKey =
    typeof product.category === "string"
      ? product.category
      : Object.keys(product.category)[0];
  const badgeCls = CATEGORY_BADGE[catKey] ?? "bg-muted text-muted-foreground";
  const gradientCls =
    CATEGORY_GRADIENT[catKey] ?? "from-muted via-muted/50 to-muted";
  const imageUrl = product.imageKey ? product.imageKey.getDirectURL() : "";

  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isOutOfStock) return;
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl,
        quantity: 1,
      });
    },
    [addItem, product, isOutOfStock, imageUrl],
  );

  return (
    <Link
      to="/catalog/$productId"
      params={{ productId: String(product.id) }}
      data-ocid={`catalog.item.${index + 1}`}
      className="group block bg-card rounded-2xl overflow-hidden shadow-card border border-border hover:shadow-md hover:-translate-y-0.5 transition-smooth"
    >
      {/* Image */}
      <div
        className={`relative aspect-square bg-gradient-to-br ${gradientCls} overflow-hidden`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl opacity-40">
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
        {/* Stock badge overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center">
            <span className="bg-card/90 text-foreground text-xs font-semibold px-3 py-1 rounded-full">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        {/* Category + stock row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${badgeCls}`}
          >
            {catKey}
          </span>
          <span
            className={`ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-full ${
              isOutOfStock
                ? "bg-destructive/10 text-destructive border border-destructive/20"
                : "bg-secondary/20 text-secondary-foreground border border-secondary/30"
            }`}
            data-ocid={`catalog.item.${index + 1}.stock`}
          >
            {isOutOfStock ? "Out of Stock" : "In Stock"}
          </span>
        </div>

        {/* Name */}
        <p className="text-sm font-semibold text-foreground line-clamp-2 leading-snug min-h-[2.5rem]">
          {product.name}
        </p>

        {/* Price */}
        <p className="text-base font-bold text-primary">
          {formatINR(product.price)}
        </p>

        {/* Add to cart */}
        <Button
          type="button"
          size="sm"
          className="w-full rounded-xl text-xs font-semibold gap-1.5 transition-smooth"
          variant={inCart ? "secondary" : "default"}
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          data-ocid={`catalog.item.${index + 1}.add_button`}
        >
          <ShoppingCart size={13} />
          {inCart ? "Added ✓" : isOutOfStock ? "Unavailable" : "Add to Cart"}
        </Button>
      </div>
    </Link>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function Catalog() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | Category>("All");
  const debouncedSearch = useDebounce(search, 300);
  const { data: products = [], isLoading } = useProducts();

  const filtered = products.filter((p) => {
    const matchesSearch =
      !debouncedSearch ||
      p.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(debouncedSearch.toLowerCase());
    const catKey =
      typeof p.category === "string" ? p.category : Object.keys(p.category)[0];
    const matchesCategory =
      activeCategory === "All" || catKey === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div
      className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8"
      data-ocid="catalog.page"
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-1">
          Shop All Products
        </h1>
        <p className="text-muted-foreground text-sm">
          Premium baby essentials for Indian families
        </p>
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="search"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 h-10 rounded-xl border border-input bg-background px-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          data-ocid="catalog.search_input"
        />
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <Button
              key={String(c.value)}
              size="sm"
              variant={activeCategory === c.value ? "default" : "outline"}
              onClick={() => setActiveCategory(c.value)}
              className="h-9 text-xs rounded-xl"
              data-ocid={`catalog.filter.${c.label.toLowerCase()}_tab`}
            >
              {c.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          data-ocid="catalog.loading_state"
        >
          {[
            "sk-0",
            "sk-1",
            "sk-2",
            "sk-3",
            "sk-4",
            "sk-5",
            "sk-6",
            "sk-7",
            "sk-8",
            "sk-9",
          ].map((id) => (
            <ProductCardSkeleton key={id} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-24 text-center"
          data-ocid="catalog.empty_state"
        >
          <span className="text-5xl mb-4">🔍</span>
          <h2 className="font-display font-semibold text-lg text-foreground mb-2">
            No products found
          </h2>
          <p className="text-muted-foreground text-sm">
            Try a different search or category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((p, i) => (
            <ProductCard key={String(p.id)} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
