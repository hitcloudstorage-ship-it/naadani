import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { formatINR } from "@/utils/format";
import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";

const DELIVERY_THRESHOLD_PAISA = BigInt(49900);
const DELIVERY_CHARGE_PAISA = BigInt(4900);

export default function Cart() {
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalPaisa = useCartStore((s) => s.totalPaisa());

  const isFreeDelivery = totalPaisa >= DELIVERY_THRESHOLD_PAISA;
  const deliveryPaisa = isFreeDelivery ? BigInt(0) : DELIVERY_CHARGE_PAISA;
  const grandTotal = totalPaisa + deliveryPaisa;

  if (items.length === 0) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center py-24 px-4 text-center"
        data-ocid="cart.empty_state"
      >
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <ShoppingBag size={40} className="text-primary" />
        </div>
        <h1 className="font-display font-bold text-2xl text-foreground mb-2">
          Your cart is empty
        </h1>
        <p className="text-muted-foreground mb-8 max-w-xs">
          Looks like you haven't added any products yet. Explore our range of
          gentle baby essentials!
        </p>
        <Link to="/catalog" data-ocid="cart.start_shopping_link">
          <Button size="lg" className="rounded-full px-8">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div
      className="max-w-screen-lg mx-auto px-4 sm:px-6 py-8"
      data-ocid="cart.page"
    >
      <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-6">
        Your Cart
        <span className="ml-2 text-base font-normal text-muted-foreground">
          ({items.length} {items.length === 1 ? "item" : "items"})
        </span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items */}
        <div className="flex-1 space-y-4" data-ocid="cart.list">
          {items.map((item, idx) => (
            <div
              key={item.productId.toString()}
              className="bg-card rounded-2xl border border-border p-4 flex gap-4 items-start"
              data-ocid={`cart.item.${idx + 1}`}
            >
              {/* Product image */}
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">
                    🍼
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground truncate">
                  {item.name}
                </h3>
                <p className="text-primary font-semibold mt-1">
                  {formatINR(item.price)}
                </p>

                {/* Qty controls */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1 bg-muted/60 rounded-full px-1 py-1">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-card transition-colors disabled:opacity-40"
                      disabled={item.quantity <= 1}
                      onClick={() =>
                        updateQty(item.productId, item.quantity - 1)
                      }
                      data-ocid={`cart.qty_minus.${idx + 1}`}
                    >
                      <Minus size={14} />
                    </button>
                    <span
                      className="w-6 text-center text-sm font-semibold"
                      data-ocid={`cart.qty.${idx + 1}`}
                    >
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Increase quantity"
                      className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-card transition-colors disabled:opacity-40"
                      disabled={item.quantity >= 10}
                      onClick={() =>
                        updateQty(item.productId, item.quantity + 1)
                      }
                      data-ocid={`cart.qty_plus.${idx + 1}`}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    type="button"
                    aria-label="Remove item"
                    className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                    onClick={() => removeItem(item.productId)}
                    data-ocid={`cart.delete_button.${idx + 1}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Item total */}
              <div className="text-right flex-shrink-0">
                <span className="font-semibold text-foreground">
                  {formatINR(item.price * BigInt(item.quantity))}
                </span>
              </div>
            </div>
          ))}

          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline mt-2"
            data-ocid="cart.continue_shopping_link"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* Order summary sidebar */}
        <div className="lg:w-80">
          <div
            className="bg-card rounded-2xl border border-border p-6 sticky top-20"
            data-ocid="cart.order_summary"
          >
            <h2 className="font-display font-bold text-lg mb-5">
              Order Summary
            </h2>

            {/* COD badge */}
            <div className="flex items-center gap-2 bg-accent/30 border border-accent rounded-xl px-4 py-3 mb-5">
              <span className="text-xl">💰</span>
              <span className="text-sm font-medium text-foreground">
                Cash on Delivery available
              </span>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatINR(totalPaisa)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                {isFreeDelivery ? (
                  <span className="text-secondary-foreground font-semibold">
                    FREE
                  </span>
                ) : (
                  <span className="font-medium">
                    {formatINR(deliveryPaisa)}
                  </span>
                )}
              </div>
              {!isFreeDelivery && (
                <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg px-3 py-2">
                  Add {formatINR(DELIVERY_THRESHOLD_PAISA - totalPaisa)} more
                  for FREE delivery
                </p>
              )}
            </div>

            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-xl text-primary">
                  {formatINR(grandTotal)}
                </span>
              </div>
            </div>

            <Link to="/checkout" data-ocid="cart.checkout_button">
              <Button size="lg" className="w-full rounded-full">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
