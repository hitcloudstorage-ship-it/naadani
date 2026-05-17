import AccessControl "mo:caffeineai-authorization/access-control";
import Storage "mo:caffeineai-object-storage/Storage";
import CommonTypes "../types/common";
import ProductTypes "../types/products";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import ProductsLib "../lib/products";
import Map "mo:core/Map";

mixin (
  accessControlState : AccessControl.AccessControlState,
  products : Map.Map<CommonTypes.ProductId, ProductTypes.Product>,
  state : { var nextProductId : CommonTypes.ProductId },
) {
  // Public — any visitor
  public query func listProducts() : async [ProductTypes.Product] {
    ProductsLib.listAll(products);
  };

  public query func getProduct(id : CommonTypes.ProductId) : async ?ProductTypes.Product {
    ProductsLib.getById(products, id);
  };

  public query func listProductsByCategory(category : ProductTypes.Category) : async [ProductTypes.Product] {
    ProductsLib.listByCategory(products, category);
  };

  public query func searchProducts(searchQuery : Text) : async [ProductTypes.Product] {
    ProductsLib.search(products, searchQuery);
  };

  // Admin-only
  public shared ({ caller }) func createProduct(
    name : Text,
    description : Text,
    price : Nat,
    category : ProductTypes.Category,
    imageKey : Storage.ExternalBlob,
    stockStatus : ProductTypes.StockStatus,
  ) : async ProductTypes.Product {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorised: Only admins can create products");
    };
    ProductsLib.create(products, state, name, description, price, category, imageKey, stockStatus, Time.now());
  };

  public shared ({ caller }) func updateProduct(
    id : CommonTypes.ProductId,
    name : Text,
    description : Text,
    price : Nat,
    category : ProductTypes.Category,
    imageKey : Storage.ExternalBlob,
    stockStatus : ProductTypes.StockStatus,
  ) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorised: Only admins can update products");
    };
    ProductsLib.update(products, id, name, description, price, category, imageKey, stockStatus);
  };

  public shared ({ caller }) func deleteProduct(id : CommonTypes.ProductId) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorised: Only admins can delete products");
    };
    ProductsLib.remove(products, id);
  };

  public shared ({ caller }) func seedSampleProducts() : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorised: Only admins can seed products");
    };
    ProductsLib.seedSamples(products, state, Time.now());
  };
};
