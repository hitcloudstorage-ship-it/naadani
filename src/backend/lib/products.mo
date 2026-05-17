import Map "mo:core/Map";
import Storage "mo:caffeineai-object-storage/Storage";
import CommonTypes "../types/common";
import ProductTypes "../types/products";

module {
  public type ProductMap = Map.Map<CommonTypes.ProductId, ProductTypes.Product>;

  public func listAll(products : ProductMap) : [ProductTypes.Product] {
    products.values().toArray();
  };

  public func getById(products : ProductMap, id : CommonTypes.ProductId) : ?ProductTypes.Product {
    products.get(id);
  };

  public func listByCategory(products : ProductMap, category : ProductTypes.Category) : [ProductTypes.Product] {
    products.values().filter(func(p) { p.category == category }).toArray();
  };

  public func search(products : ProductMap, searchTerm : Text) : [ProductTypes.Product] {
    let lowerQuery = searchTerm.toLower();
    products.values().filter(func(p) {
      p.name.toLower().contains(#text lowerQuery) or p.description.toLower().contains(#text lowerQuery)
    }).toArray();
  };

  public func create(
    products : ProductMap,
    state : { var nextProductId : CommonTypes.ProductId },
    name : Text,
    description : Text,
    price : Nat,
    category : ProductTypes.Category,
    imageKey : Storage.ExternalBlob,
    stockStatus : ProductTypes.StockStatus,
    createdAt : CommonTypes.Timestamp,
  ) : ProductTypes.Product {
    let id = state.nextProductId;
    state.nextProductId += 1;
    let product : ProductTypes.Product = { id; name; description; price; category; imageKey; stockStatus; createdAt };
    products.add(id, product);
    product;
  };

  public func update(
    products : ProductMap,
    id : CommonTypes.ProductId,
    name : Text,
    description : Text,
    price : Nat,
    category : ProductTypes.Category,
    imageKey : Storage.ExternalBlob,
    stockStatus : ProductTypes.StockStatus,
  ) : Bool {
    switch (products.get(id)) {
      case (?existing) {
        products.add(id, { existing with name; description; price; category; imageKey; stockStatus });
        true;
      };
      case null { false };
    };
  };

  public func remove(products : ProductMap, id : CommonTypes.ProductId) : Bool {
    switch (products.get(id)) {
      case (?_) { products.remove(id); true };
      case null { false };
    };
  };

  public func seedSamples(
    products : ProductMap,
    state : { var nextProductId : CommonTypes.ProductId },
    now : CommonTypes.Timestamp,
  ) : () {
    // Only seed if no products exist
    if (not products.isEmpty()) { return };

    // Helper to add a product
    let add = func(name : Text, description : Text, price : Nat, category : ProductTypes.Category) {
      let id = state.nextProductId;
      state.nextProductId += 1;
      products.add(id, {
        id;
        name;
        description;
        price;
        category;
        imageKey = "" : Blob;
        stockStatus = #InStock;
        createdAt = now;
      });
    };

    // Clothing — 4 products
    add("Organic Cotton Jhabla Set", "Soft, breathable jhabla set for newborns and infants. Made from 100% GOTS-certified organic cotton. Perfect for India's warm climate.", 39900, #Clothing);
    add("Baby Kurta Pyjama Set", "Adorable kurta pyjama set in pure cotton for festive occasions. Available in pastel shades. Gentle on baby's delicate skin.", 59900, #Clothing);
    add("Cotton Onesie 3-Pack", "Pack of 3 comfortable cotton onesies with snap buttons. Easy nappy changes. Ideal for everyday wear.", 89900, #Clothing);
    add("Muslin Swaddle Blanket Set", "Set of 2 large muslin swaddle wraps. Ultra-soft, breathable fabric perfect for Indian summers and monsoons.", 74900, #Clothing);

    // Diapers — 4 products
    add("Premium Diapers Pack (Size S)", "Pack of 50 premium diapers for babies 4-8 kg. Wetness indicator, up to 12-hour protection. Dermatologically tested.", 84900, #Diapers);
    add("Cloth Diaper with Inserts", "Reusable cloth diaper with 2 absorbent inserts. Eco-friendly, cost-saving choice. Adjustable snaps fit 3-15 kg.", 64900, #Diapers);
    add("Diaper Rash Cream 100g", "Natural zinc oxide cream for preventing and treating diaper rash. Free from parabens and harsh chemicals. Paediatrician approved.", 29900, #Diapers);
    add("Biodegradable Diaper Pack (Size M)", "Pack of 40 plant-based biodegradable diapers for babies 6-11 kg. Bamboo core, hypoallergenic lining.", 99900, #Diapers);

    // Gear — 4 products
    add("Ergonomic Baby Carrier", "Structured baby carrier with wide padded waist belt. Supports newborn to toddler (3.5-20 kg). Hip-healthy design, keeps baby close.", 249900, #Gear);
    add("Foldable Baby Stroller", "Lightweight stroller with one-hand fold. Reclining seat, sunshade canopy, and storage basket. Suitable from 6 months.", 599900, #Gear);
    add("Baby Bath Tub with Sling", "Contoured baby bath tub with removable soft sling for newborns. Non-slip base, easy-drain plug.", 149900, #Gear);
    add("Portable Baby Cot", "Foldable travel cot with breathable mesh sides. Includes carry bag. Fits standard cot mattress. Ideal for grandparents' home.", 349900, #Gear);

    // Toys — 4 products
    add("Wooden Rattles Set", "Set of 4 hand-finished wooden rattles in natural non-toxic paint. Stimulates sensory development. Safe for 0+ months.", 64900, #Toys);
    add("Soft Fabric Activity Book", "Crinkle, squeak, and sensory fabric book with 10 interactive pages. Encourages tactile exploration for 6-24 months.", 49900, #Toys);
    add("Stacking Rings Toy", "Classic colourful stacking rings with smooth rounded edges. BPA-free plastic. Develops motor skills and colour recognition.", 39900, #Toys);
    add("Musical Elephant Plush", "Soft plush elephant that plays gentle Indian lullabies when squeezed. Machine washable. Suitable from birth.", 89900, #Toys);
  };
};
