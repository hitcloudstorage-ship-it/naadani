import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePlaceOrder } from "@/hooks/useQueries";
import { useCartStore } from "@/store/cart";
import type { OrderItem } from "@/types";
import { formatINR } from "@/utils/format";
import { Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Package, Phone } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const DELIVERY_THRESHOLD_PAISA = BigInt(49900);
const DELIVERY_CHARGE_PAISA = BigInt(4900);

interface FormValues {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  notes: string;
}

export default function Checkout() {
  const items = useCartStore((s) => s.items);
  const totalPaisa = useCartStore((s) => s.totalPaisa());
  const clearCart = useCartStore((s) => s.clearCart);
  const navigate = useNavigate();

  const isFreeDelivery = totalPaisa >= DELIVERY_THRESHOLD_PAISA;
  const deliveryPaisa = isFreeDelivery ? BigInt(0) : DELIVERY_CHARGE_PAISA;
  const grandTotal = totalPaisa + deliveryPaisa;

  const [orderId, setOrderId] = useState<string | null>(null);
  const { mutateAsync, isPending } = usePlaceOrder();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  if (items.length === 0 && !orderId) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center py-24 px-4 text-center"
        data-ocid="checkout.empty_state"
      >
        <span className="text-5xl mb-4">🛒</span>
        <h1 className="font-display font-bold text-2xl mb-2">Cart is empty</h1>
        <p className="text-muted-foreground mb-6">
          Add some items before checkout.
        </p>
        <Link to="/catalog">
          <Button size="lg" className="rounded-full px-8">
            Shop Now
          </Button>
        </Link>
      </div>
    );
  }

  if (orderId) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center"
        data-ocid="checkout.success_state"
      >
        <div className="w-24 h-24 rounded-full bg-secondary/40 flex items-center justify-center mb-6">
          <CheckCircle2 size={48} className="text-secondary-foreground" />
        </div>
        <h1 className="font-display font-bold text-3xl text-foreground mb-3">
          Order Placed! 🎉
        </h1>
        <p className="text-muted-foreground mb-2">Your Order ID is</p>
        <p className="font-mono font-bold text-lg bg-muted/60 rounded-xl px-6 py-3 mb-6 text-foreground">
          #{orderId}
        </p>
        <div className="flex items-center gap-3 bg-accent/30 border border-accent rounded-2xl px-6 py-4 mb-8 max-w-sm">
          <Phone size={20} className="text-primary flex-shrink-0" />
          <p className="text-sm text-foreground">
            Our team will call you within <strong>24 hours</strong> to confirm
            your order. Keep your phone handy!
          </p>
        </div>
        <Link to="/catalog" data-ocid="checkout.continue_shopping_link">
          <Button size="lg" className="rounded-full px-10">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: FormValues) => {
    try {
      const orderItems: OrderItem[] = items.map((item) => ({
        productId: item.productId,
        qty: BigInt(item.quantity),
      }));
      const fullAddress = `${data.address}, ${data.city} - ${data.pincode}${
        data.notes ? `. Notes: ${data.notes}` : ""
      }`;
      const result = await mutateAsync({
        customerName: data.fullName,
        phone: data.phone,
        address: fullAddress,
        items: orderItems,
      });
      clearCart();
      const newId = result.toString();
      setOrderId(newId);
      navigate({ to: "/checkout" });
    } catch (err) {
      console.error("Order placement failed:", err);
    }
  };

  return (
    <div
      className="max-w-screen-md mx-auto px-4 sm:px-6 py-8"
      data-ocid="checkout.page"
    >
      <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-6">
        Checkout
      </h1>

      {/* Order summary */}
      <div
        className="bg-card rounded-2xl border border-border p-5 mb-8"
        data-ocid="checkout.order_summary"
      >
        <div className="flex items-center gap-2 mb-4">
          <Package size={18} className="text-primary" />
          <h2 className="font-semibold">Order Summary</h2>
        </div>
        <div className="space-y-2 mb-4">
          {items.map((item) => (
            <div
              key={item.productId.toString()}
              className="flex justify-between text-sm"
            >
              <span className="text-muted-foreground">
                {item.name} × {item.quantity}
              </span>
              <span className="font-medium">
                {formatINR(item.price * BigInt(item.quantity))}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-3 flex justify-between items-center">
          <div className="text-sm">
            <span className="text-muted-foreground">Delivery: </span>
            {isFreeDelivery ? (
              <span className="font-semibold text-secondary-foreground">
                FREE
              </span>
            ) : (
              <span className="font-medium">{formatINR(deliveryPaisa)}</span>
            )}
          </div>
          <span className="font-bold text-primary text-lg">
            {formatINR(grandTotal)}
          </span>
        </div>
      </div>

      {/* COD banner */}
      <div className="flex items-start gap-3 bg-accent/30 border border-accent rounded-2xl px-5 py-4 mb-8">
        <span className="text-2xl flex-shrink-0">💰</span>
        <div>
          <p className="font-semibold text-foreground text-sm mb-1">
            Cash on Delivery
          </p>
          <p className="text-sm text-muted-foreground">
            Your order will be confirmed via phone call. Our team will reach out
            within 24 hours.
          </p>
        </div>
      </div>

      {/* Delivery form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        data-ocid="checkout.form"
        noValidate
      >
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            placeholder="Priya Sharma"
            data-ocid="checkout.full_name_input"
            {...register("fullName", {
              required: "Please enter your full name",
              minLength: { value: 2, message: "Name is too short" },
            })}
          />
          {errors.fullName && (
            <p
              className="text-destructive text-xs mt-1"
              data-ocid="checkout.full_name_field_error"
            >
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Mobile Number *</Label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-input bg-muted text-muted-foreground text-sm">
              +91
            </span>
            <Input
              id="phone"
              type="tel"
              placeholder="9876543210"
              className="rounded-l-none"
              data-ocid="checkout.phone_input"
              {...register("phone", {
                required: "Mobile number is required",
                pattern: {
                  value: /^[6-9]\d{9}$/,
                  message: "Please enter a valid 10-digit Indian mobile number",
                },
              })}
            />
          </div>
          {errors.phone && (
            <p
              className="text-destructive text-xs mt-1"
              data-ocid="checkout.phone_field_error"
            >
              {errors.phone.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="address">Delivery Address *</Label>
          <Textarea
            id="address"
            placeholder="House no., Street name, Locality..."
            rows={3}
            data-ocid="checkout.address_input"
            {...register("address", {
              required: "Please enter your delivery address",
              minLength: {
                value: 10,
                message: "Please enter a complete address",
              },
            })}
          />
          {errors.address && (
            <p
              className="text-destructive text-xs mt-1"
              data-ocid="checkout.address_field_error"
            >
              {errors.address.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              placeholder="Mumbai"
              data-ocid="checkout.city_input"
              {...register("city", { required: "City is required" })}
            />
            {errors.city && (
              <p
                className="text-destructive text-xs mt-1"
                data-ocid="checkout.city_field_error"
              >
                {errors.city.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pincode">Pincode *</Label>
            <Input
              id="pincode"
              placeholder="400001"
              maxLength={6}
              data-ocid="checkout.pincode_input"
              {...register("pincode", {
                required: "Pincode is required",
                pattern: {
                  value: /^[1-9]\d{5}$/,
                  message: "Enter a valid 6-digit pincode",
                },
              })}
            />
            {errors.pincode && (
              <p
                className="text-destructive text-xs mt-1"
                data-ocid="checkout.pincode_field_error"
              >
                {errors.pincode.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="notes">Special Instructions (optional)</Label>
          <Textarea
            id="notes"
            placeholder="Preferred delivery time, landmarks, etc."
            rows={2}
            data-ocid="checkout.notes_input"
            {...register("notes")}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full rounded-full mt-2"
          disabled={isPending}
          data-ocid="checkout.submit_button"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
              Placing Order...
            </span>
          ) : (
            "Place Order (COD)"
          )}
        </Button>
      </form>
    </div>
  );
}
