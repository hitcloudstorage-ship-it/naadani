import CommonTypes "common";

module {
  public type OrderStatus = {
    #Pending;
    #Confirmed;
    #Cancelled;
  };

  public type OrderItem = {
    productId : CommonTypes.ProductId;
    qty : Nat;
  };

  public type OrderInquiry = {
    id : CommonTypes.OrderId;
    customerName : Text;
    phone : Text;
    address : Text;
    items : [OrderItem];
    totalAmount : Nat; // in paise
    status : OrderStatus;
    createdAt : CommonTypes.Timestamp;
  };

  // Input type for placing an order — no id/status/createdAt (set by backend)
  public type PlaceOrderInput = {
    customerName : Text;
    phone : Text;
    address : Text;
    items : [OrderItem];
  };
};
