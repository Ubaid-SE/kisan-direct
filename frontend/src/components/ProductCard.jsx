import { useState } from "react";

function ProductCard({ product, addToCart }) {

  const isFruitVeg =
    product.category === "fruit" ||
    product.category === "vegetable";

  const unit = product.unit || "kg";
  const variant = product.variant || ""; // e.g. "900 grams", "Large", "450g"

  const [selectedQuality, setSelectedQuality] = useState("Premium");
  const [variantLabel, setVariantLabel] = useState("Premium / Export Quality");
  const [qty, setQty] = useState(1);

  // Price logic
  let selectedPrice;
  if (typeof product.price === "object") {
    selectedPrice =
      selectedQuality === "Premium"
        ? product.price?.premium ?? product.price?.standard
        : product.price?.standard ?? product.price?.premium;
  } else {
    selectedPrice = product.price;
  }

  // Discount
  const discountPercent = Number(product.discount || 0);
  const finalPrice =
    discountPercent > 0
      ? Math.round(selectedPrice - (selectedPrice * discountPercent) / 100)
      : selectedPrice;

  const handleAdd = () => {
    addToCart({
      name: product.name,
      price: Number(finalPrice || 0),
      image: product.image,
      quality: isFruitVeg ? variantLabel : (variant || "Default"),
      qty: qty,
      unit: unit,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col">

      {/* Image */}
      <img
        src={product.image}
        className="w-full h-40 object-cover object-center rounded-lg"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/300x200/e8f5e9/2e7d32?text=Fresh!";
        }}
      />

      {/* Fresh badge */}
      <span className="mt-2 inline-block text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded w-fit">
        Fresh!
      </span>

      {/* Name */}
      <h2 className="mt-1 font-semibold text-sm">{product.name}</h2>

      {/*  Fruit/Veg: Standard/Premium dropdown */}
      {isFruitVeg && (
        <>
          <p className="text-xs text-gray-500 mt-0.5">{variantLabel}</p>
          <select
            value={variantLabel}
            onChange={(e) => {
              const val = e.target.value;
              setVariantLabel(val);
              setSelectedQuality(val === "Premium / Export Quality" ? "Premium" : "Standard");
            }}
            className="mt-2 w-full border rounded px-2 py-1 text-xs"
          >
            <option value="Premium / Export Quality">Premium</option>
            <option value="Standard Quality">Standard Quality</option>
          </select>
        </>
      )}

      {/*  Non fruit/veg: variant badge (e.g. "900 grams", "Large") */}
      {!isFruitVeg && variant && (
        <span className="mt-1 inline-block text-[10px] bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded w-fit">
          {variant}
        </span>
      )}

      {/* Price */}
      <div className="mt-2">
        {discountPercent > 0 ? (
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-green-600 font-bold text-sm">Rs. {finalPrice}</p>
            <p className="text-gray-400 line-through text-xs">Rs. {selectedPrice}</p>
            <span className="text-[10px] bg-red-100 text-red-600 px-1 rounded">{discountPercent}% OFF</span>
          </div>
        ) : (
          <p className="text-green-600 font-bold text-sm">Rs. {selectedPrice || 0}</p>
        )}
      </div>

      {/*  Quantity row */}
      <div className="flex items-center justify-between mt-2 text-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
            className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded font-bold text-base"
          >-</button>

          {/* ✅ Sirf qty number + unit — variant alag badge pe dikh raha hai */}
          <span className="text-xs font-medium">{qty} {unit}</span>

          <button
            onClick={() => setQty(qty + 1)}
            className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded font-bold text-base"
          >+</button>
        </div>

        <span className={`text-xs ${product.stock ? "text-green-500" : "text-red-500"}`}>
          {product.stock ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      {/* Button */}
      <button
        disabled={!product.stock}
        onClick={handleAdd}
        className={`mt-3 w-full py-2 rounded text-white text-sm font-medium
          ${product.stock ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
      >
        Add to Cart
      </button>

    </div>
  );
}

export default ProductCard;
