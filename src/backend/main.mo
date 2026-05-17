import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import CommonTypes "types/common";
import ProductTypes "types/products";
import OrderTypes "types/orders";
import ProductsMixin "mixins/products-api";
import OrdersMixin "mixins/orders-api";

actor {
  // Authorization state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Object storage infrastructure
  include MixinObjectStorage();

  // Shared mutable counters
  let productState = { var nextProductId : CommonTypes.ProductId = 0 };
  let orderState = { var nextOrderId : CommonTypes.OrderId = 0 };

  // Domain state
  let products = Map.empty<CommonTypes.ProductId, ProductTypes.Product>();
  let orders = Map.empty<CommonTypes.OrderId, OrderTypes.OrderInquiry>();

  // Domain mixins
  include ProductsMixin(accessControlState, products, productState);
  include OrdersMixin(accessControlState, orders, orderState, products);
};
