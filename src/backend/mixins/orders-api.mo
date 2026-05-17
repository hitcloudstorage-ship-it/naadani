import AccessControl "mo:caffeineai-authorization/access-control";
import CommonTypes "../types/common";
import OrderTypes "../types/orders";
import ProductTypes "../types/products";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import OrdersLib "../lib/orders";
import Map "mo:core/Map";

mixin (
  accessControlState : AccessControl.AccessControlState,
  orders : Map.Map<CommonTypes.OrderId, OrderTypes.OrderInquiry>,
  state : { var nextOrderId : CommonTypes.OrderId },
  products : Map.Map<CommonTypes.ProductId, ProductTypes.Product>, // for price lookup
) {
  // Public — any visitor can place a COD order inquiry
  public shared func placeOrderInquiry(input : OrderTypes.PlaceOrderInput) : async OrderTypes.OrderInquiry {
    // Calculate total from product catalogue
    var total : Nat = 0;
    for (item in input.items.values()) {
      switch (products.get(item.productId)) {
        case (?product) { total += product.price * item.qty };
        case null { Runtime.trap("Product not found: " # item.productId.toText()) };
      };
    };
    OrdersLib.place(orders, state, input, total, Time.now());
  };

  // Admin-only
  public shared ({ caller }) func getOrderInquiries() : async [OrderTypes.OrderInquiry] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorised: Only admins can view order inquiries");
    };
    OrdersLib.listAll(orders);
  };

  public shared ({ caller }) func updateOrderStatus(
    id : CommonTypes.OrderId,
    status : OrderTypes.OrderStatus,
  ) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorised: Only admins can update order status");
    };
    OrdersLib.updateStatus(orders, id, status);
  };
};
