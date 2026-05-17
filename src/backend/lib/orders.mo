import Map "mo:core/Map";
import CommonTypes "../types/common";
import OrderTypes "../types/orders";

module {
  public type OrderMap = Map.Map<CommonTypes.OrderId, OrderTypes.OrderInquiry>;

  public func place(
    orders : OrderMap,
    state : { var nextOrderId : CommonTypes.OrderId },
    input : OrderTypes.PlaceOrderInput,
    totalAmount : Nat,
    now : CommonTypes.Timestamp,
  ) : OrderTypes.OrderInquiry {
    let id = state.nextOrderId;
    state.nextOrderId += 1;
    let inquiry : OrderTypes.OrderInquiry = {
      id;
      customerName = input.customerName;
      phone = input.phone;
      address = input.address;
      items = input.items;
      totalAmount;
      status = #Pending;
      createdAt = now;
    };
    orders.add(id, inquiry);
    inquiry;
  };

  public func listAll(orders : OrderMap) : [OrderTypes.OrderInquiry] {
    orders.values().toArray();
  };

  public func updateStatus(
    orders : OrderMap,
    id : CommonTypes.OrderId,
    status : OrderTypes.OrderStatus,
  ) : Bool {
    switch (orders.get(id)) {
      case (?existing) {
        orders.add(id, { existing with status });
        true;
      };
      case null { false };
    };
  };
};
