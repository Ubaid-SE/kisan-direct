import { useState } from "react";
import { useCart } from "../context/CartContext";

const AddOnSection = () => {
  const [extraItem, setExtraItem] = useState("");
  const { addToCart } = useCart();

  const handleAdd = () => {
    if (!extraItem) return;

    addToCart({
      name: extraItem,
      price: "Rs.0", // later tum dynamic charges laga sakte ho
      quality: "Other Item",
      qty: 1,
      type: "other" // 👈 IMPORTANT
    });

    setExtraItem("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 mt-6">

      <h2 className="text-lg font-bold text-green-700 mb-2">
        Need Something Else?
      </h2>

      <p className="text-sm text-gray-600 mb-4">
        We can also pick up additional items from the market on your order and deliver Instantly.
      </p>
      {/* CATEGORY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs text-center mb-4">

        <div className="border rounded-lg p-3">🥚<br/>Eggs & Dairy</div>
        <div className="border rounded-lg p-3">🍞<br/>Bread & Bakery</div>
        <div className="border rounded-lg p-3">🥫<br/>Groceries</div>
        <div className="border rounded-lg p-3">🍫<br/>Snacks</div>
        <div className="border rounded-lg p-3">💊<br/> Medicines</div>

      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="e.g. Eggs, Bread, Medicine"
          value={extraItem}
          onChange={(e) => setExtraItem(e.target.value)}
          className="flex-1 border rounded px-3 py-2 text-sm"
        />

        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 rounded text-sm"
        >
          Add
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-3">
*Items are sourced from local stores. Prices may vary. Medicines are limited to basic OTC items only.
      </p>

    </div>
  );
};

export default AddOnSection;