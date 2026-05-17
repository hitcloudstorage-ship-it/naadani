import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { Link, useRouter } from "@tanstack/react-router";
import { Baby, Menu, Search, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import Footer from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const router = useRouter();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/catalog", label: "Shop" },
  ];

  const isActive = (path: string) =>
    router.state.location.pathname === path ||
    (path !== "/" && router.state.location.pathname.startsWith(path));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-subtle">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            data-ocid="nav.mobile_menu_toggle"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="flex flex-col items-center"
            data-ocid="nav.logo_link"
          >
            <span className="font-display font-bold text-2xl tracking-tight text-primary leading-none">
              Naadani
            </span>
            <span className="text-[10px] text-muted-foreground tracking-wider leading-none mt-0.5">
              • बेबी प्रॉडक्स •
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted/60"
                }`}
                data-ocid={`nav.${link.label.toLowerCase()}_link`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link to="/catalog" data-ocid="nav.search_button">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Search products"
                className="hidden sm:flex"
              >
                <Search size={20} />
              </Button>
            </Link>
            <Link to="/cart" data-ocid="nav.cart_button">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label={`Cart — ${totalItems} items`}
              >
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <Badge
                    className="absolute -top-1.5 -right-1.5 h-5 w-5 p-0 text-[10px] flex items-center justify-center bg-primary text-primary-foreground"
                    data-ocid="nav.cart_badge"
                  >
                    {totalItems > 99 ? "99+" : totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <div
            className="md:hidden border-t border-border bg-card px-4 pb-4 pt-2"
            data-ocid="nav.mobile_menu"
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted/60"
                  }`}
                  data-ocid={`nav.mobile_${link.label.toLowerCase()}_link`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/cart"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-muted/60 transition-colors"
                data-ocid="nav.mobile_cart_link"
              >
                <ShoppingCart size={18} />
                Cart
                {totalItems > 0 && (
                  <Badge className="ml-auto bg-primary text-primary-foreground text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      <Footer />
    </div>
  );
}
