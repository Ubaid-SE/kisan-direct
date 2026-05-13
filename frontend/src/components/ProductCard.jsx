import { useState } from "react";

function ProductCard({ product, addToCart }) {

  // ✅ CATEGORY FLAGS
  const isFruitVeg =
    product.category === "fruit" ||
    product.category === "vegetable";

  const isGrocery = product.category === "groceries";
  const isHomemade = product.category === "homemade";

  // ✅ STATES
  const [selectedQuality, setSelectedQuality] = useState("Premium");
  const [variant, setVariant] = useState("Premium / Export Quality");
  const [qty, setQty] = useState(1);

  // ✅ PRICE LOGIC
  let selectedPrice;

  if (typeof product.price === "object") {
    selectedPrice =
      selectedQuality === "Premium"
        ? product.price?.premium
        : product.price?.standard;
  } else {
    selectedPrice = product.price;
  }

  // ✅ ADD TO CART
  const handleAdd = () => {

    let finalQuality = "Default";

    if (isFruitVeg) {
      finalQuality = variant; // dropdown based
    }

    if (isHomemade) {
      finalQuality = "Premium"; // fixed premium
    }

    const itemToAdd = {
      name: product.name,
      price: Number(selectedPrice),
      image: product.image,
      quality: finalQuality,
      qty: qty,

      type: isGrocery || isHomemade ? "other" : "product"
    };

    addToCart(itemToAdd);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 min-w-[220px]">

      {/* Image */}
      <img
        src={product.image}
        className="w-full h-32 object-cover rounded-lg"
      />

      {/* Badge */}
      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded">
        Fresh!
      </span>

      {/* Name */}
      <h2 className="mt-2 font-semibold text-sm">
        {product.name}
      </h2>

      {/* ✅ QUALITY TEXT */}
      {isFruitVeg && (
        <p className="text-xs text-gray-500">{variant}</p>
      )}

      {isHomemade && (
        <p className="text-xs text-gray-500">Premium</p>
      )}

      {/* ✅ DROPDOWN ONLY FOR FRUITS & VEGETABLES */}
      {isFruitVeg && (
        <select
          value={variant}
          onChange={(e) => {
            const val = e.target.value;
            setVariant(val);
            setSelectedQuality(
              val === "Premium / Export Quality" ? "Premium" : "Standard"
            );
          }}
          className="mt-2 w-full border rounded px-2 py-1 text-xs"
        >
          <option value="Premium / Export Quality">
            Premium / Export Quality
          </option>
          <option value="Standard Quality">
            Standard Quality
          </option>
        </select>
      )}

      {/* Price */}
      <p className="text-green-600 font-bold text-sm mt-1">
        Rs. {selectedPrice || 0}
      </p>

      {/* Quantity + Stock */}
      <div className="flex items-center justify-between mt-2 text-sm">

        <div className="flex items-center gap-2">
          <button
            onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
            className="px-2 bg-gray-200 rounded"
          >
            -
          </button>

          {/* ✅ UNIT LOGIC */}
          <span>
            {qty} {isGrocery ? "unit" : "kg"}
          </span>

          <button
            onClick={() => setQty(qty + 1)}
            className="px-2 bg-gray-200 rounded"
          >
            +
          </button>
        </div>

        {/* Stock */}
        <span
          className={`text-xs ${
            product.stock ? "text-green-500" : "text-red-500"
          }`}
        >
          {product.stock ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      {/* Button */}
      <button
        disabled={!product.stock}
        onClick={handleAdd}
        className={`mt-3 w-full py-1 rounded text-white text-sm
        ${
          product.stock
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Add to Cart
      </button>

    </div>
  );
}

export default ProductCard;