import Storage "mo:caffeineai-object-storage/Storage";
import CommonTypes "common";

module {
  public type Category = {
    #Clothing;
    #Diapers;
    #Gear;
    #Toys;
  };

  public type StockStatus = {
    #InStock;
    #OutOfStock;
  };

  public type Product = {
    id : CommonTypes.ProductId;
    name : Text;
    description : Text;
    price : Nat; // in paise (smallest INR unit)
    category : Category;
    imageKey : Storage.ExternalBlob;
    stockStatus : StockStatus;
    createdAt : CommonTypes.Timestamp;
  };
};
