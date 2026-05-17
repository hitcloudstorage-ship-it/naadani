import { Category } from "@/backend";
import { createActor } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronRight, MapPin, Package, ShieldCheck, Star } from "lucide-react";
import { motion } from "motion/react";

// ─── hooks ───────────────────────────────────────────────────────────────────
function useListProducts() {
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

// ─── data ────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    key: Category.Clothing,
    label: "Clothing",
    emoji: "👕",
    bg: "bg-primary/10",
    border: "border-primary/20",
  },
  {
    key: Category.Diapers,
    label: "Diapers",
    emoji: "🧷",
    bg: "bg-secondary/30",
    border: "border-secondary/40",
  },
  {
    key: Category.Gear,
    label: "Gear",
    emoji: "🛒",
    bg: "bg-accent/40",
    border: "border-accent/50",
  },
  {
    key: Category.Toys,
    label: "Toys",
    emoji: "🧸",
    bg: "bg-primary/5",
    border: "border-primary/10",
  },
];

const VALUE_PROPS = [
  {
    icon: <MapPin className="text-primary" size={28} />,
    title: "Made for India",
    desc: "Curated for Indian families, Indian climate, and Indian budgets.",
  },
  {
    icon: <ShieldCheck className="text-secondary-foreground" size={28} />,
    title: "Safe & Certified",
    desc: "All products are BIS / IS certified and tested for infant safety.",
  },
  {
    icon: <Package className="text-accent-foreground" size={28} />,
    title: "COD Available",
    desc: "Cash on delivery across India. No card needed — order with confidence.",
  },
];

// ─── sub-components ──────────────────────────────────────────────────────────
function ProductCard({ product, index }: { product: Product; index: number }) {
  const addItem = useCartStore((s) => s.addItem);
  const price = Number(product.price);

  function formatPrice(paisa: number) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(Math.round(paisa / 100));
  }

  function handleAddToCart() {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageKey.getDirectURL(),
      quantity: 1,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      data-ocid={`product.item.${index + 1}`}
    >
      <Card className="group overflow-hidden border border-border shadow-card hover:shadow-md transition-smooth bg-card flex flex-col">
        {/* Image */}
        <Link
          to="/catalog/$productId"
          params={{ productId: String(product.id) }}
          data-ocid={`product.detail_link.${index + 1}`}
        >
          <div className="relative aspect-square overflow-hidden bg-muted/40">
            <img
              src={product.imageKey.getDirectURL()}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/assets/images/placeholder.svg";
              }}
            />
            {product.stockStatus === "InStock" ? null : (
              <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs">
                Out of Stock
              </Badge>
            )}
          </div>
        </Link>

        <div className="p-3 flex flex-col gap-2 flex-1">
          <Link
            to="/catalog/$productId"
            params={{ productId: String(product.id) }}
          >
            <p className="font-medium text-sm text-foreground line-clamp-2 hover:text-primary transition-colors">
              {product.name}
            </p>
          </Link>

          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={12}
                className={
                  s <= 4 ? "fill-primary text-primary" : "text-muted-foreground"
                }
              />
            ))}
          </div>

          <p className="font-display font-bold text-base text-primary mt-auto">
            {formatPrice(price)}
          </p>

          <Button
            size="sm"
            className="w-full text-xs font-medium"
            onClick={handleAddToCart}
            disabled={product.stockStatus !== "InStock"}
            data-ocid={`product.add_to_cart.${index + 1}`}
          >
            Add to Cart
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden border border-border bg-card">
      <Skeleton className="aspect-square w-full" />
      <div className="p-3 flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-8 w-full" />
      </div>
    </Card>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const { data: products = [], isLoading } = useListProducts();
  const featured = products.slice(0, 6);

  const scrollToCategories = () => {
    document
      .getElementById("categories")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div data-ocid="home.page">
      {/* ── 1. Hero ──────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/20 to-secondary/20"
        data-ocid="home.hero_section"
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 md:py-16 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Text */}
          <motion.div
            className="flex-1 text-center md:text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 font-medium px-3 py-1">
              🇮🇳 Made for Indian Families
            </Badge>
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-foreground leading-tight mb-4">
              <span className="text-primary">सबके लिए</span>
              <br />
              <span>नन्हें खुशियाँ</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-2 max-w-md mx-auto md:mx-0">
              Small joys for everyone
            </p>
            <p className="text-base text-muted-foreground mb-8 max-w-md mx-auto md:mx-0">
              Premium baby products for Indian families. Delivered with love.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link to="/catalog" data-ocid="home.hero_shop_now_button">
                <Button
                  size="lg"
                  className="w-full sm:w-auto font-semibold px-8 shadow-card"
                >
                  Shop Now
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-primary/30 text-primary hover:bg-primary/5 font-semibold px-8"
                onClick={scrollToCategories}
                data-ocid="home.hero_browse_categories_button"
              >
                Browse Categories
              </Button>
            </div>
          </motion.div>

          {/* Hero image */}
          <motion.div
            className="flex-1 w-full max-w-sm md:max-w-none"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <img
              src="/assets/generated/hero-baby.dim_1200x600.jpg"
              alt="Happy Indian baby with premium Naadani products"
              className="w-full rounded-2xl shadow-card object-cover"
              style={{ maxHeight: 400 }}
            />
          </motion.div>
        </div>

        {/* Decorative blob */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
      </section>

      {/* ── Trust strip ──────────────────────────────────────────── */}
      <div
        className="bg-primary text-primary-foreground py-2.5"
        data-ocid="home.trust_strip"
      >
        <div className="max-w-screen-xl mx-auto px-4 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm font-medium">
          <span>🚚 Free shipping above ₹499</span>
          <span className="hidden sm:inline text-primary-foreground/40">|</span>
          <span>💵 Cash on Delivery</span>
          <span className="hidden sm:inline text-primary-foreground/40">|</span>
          <span>🔄 Easy Returns</span>
        </div>
      </div>

      {/* ── 2. Category Grid ─────────────────────────────────────── */}
      <section
        id="categories"
        className="py-14 bg-background"
        data-ocid="home.categories_section"
      >
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display font-bold text-3xl text-foreground mb-2">
              Shop by Category
            </h2>
            <p className="text-muted-foreground">
              Find exactly what your little one needs
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                data-ocid={`home.category_card.${i + 1}`}
              >
                <Link
                  to="/catalog"
                  search={{ category: cat.key }}
                  className="block"
                >
                  <Card
                    className={`group flex flex-col items-center justify-center gap-3 p-6 sm:p-8 border ${cat.border} ${cat.bg} hover:shadow-card transition-smooth cursor-pointer text-center`}
                  >
                    <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-smooth">
                      {cat.emoji}
                    </span>
                    <span className="font-display font-semibold text-base text-foreground">
                      {cat.label}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-smooth">
                      Shop <ChevronRight size={12} />
                    </span>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Featured Products ─────────────────────────────────── */}
      <section className="py-14 bg-muted/30" data-ocid="home.featured_section">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <motion.div
            className="flex items-end justify-between mb-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="font-display font-bold text-3xl text-foreground mb-1">
                Featured Products
              </h2>
              <p className="text-muted-foreground">
                Hand-picked picks for your bundle of joy
              </p>
            </div>
            <Link
              to="/catalog"
              className="hidden sm:flex items-center gap-1 text-sm text-primary font-medium hover:underline"
              data-ocid="home.view_all_link"
            >
              View all <ChevronRight size={14} />
            </Link>
          </motion.div>

          {isLoading ? (
            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
              data-ocid="home.featured_loading_state"
            >
              {["sk-0", "sk-1", "sk-2", "sk-3", "sk-4", "sk-5"].map((id) => (
                <ProductCardSkeleton key={id} />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <div
              className="text-center py-16 text-muted-foreground"
              data-ocid="home.featured_empty_state"
            >
              <span className="text-5xl mb-4 block">🛍️</span>
              <p className="font-medium">Products loading soon — stay tuned!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {featured.map((p, i) => (
                <ProductCard key={String(p.id)} product={p} index={i} />
              ))}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link to="/catalog" data-ocid="home.view_all_mobile_link">
              <Button
                variant="outline"
                className="border-primary/30 text-primary"
              >
                View All Products <ChevronRight size={14} className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. Brand Story – Why Naadani? ───────────────────────── */}
      <section className="py-14 bg-background" data-ocid="home.brand_section">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display font-bold text-3xl text-foreground mb-2">
              Why Naadani?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Naadani means innocence — that pure, childlike wonder every parent
              wants to protect. We built this store for that feeling.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {VALUE_PROPS.map((vp, i) => (
              <motion.div
                key={vp.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                data-ocid={`home.value_prop.${i + 1}`}
              >
                <Card className="p-6 border border-border bg-card shadow-card hover:shadow-md transition-smooth">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-muted/60 flex items-center justify-center">
                      {vp.icon}
                    </div>
                    <h3 className="font-display font-semibold text-lg text-foreground">
                      {vp.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {vp.desc}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
