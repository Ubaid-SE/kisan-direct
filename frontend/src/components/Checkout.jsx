import { useState } from "react";
import { useCart } from "../context/CartContext";

function Checkout() {
  const { cart, clearCart } = useCart();

  const [form, setForm] = useState({ name: "", phone: "", address: "" });
  const [success, setSuccess] = useState(false);

  // ✅ SPLIT CART
  const products = cart.filter(item => item.type !== "other");
  const others = cart.filter(item => item.type === "other");

  // ✅ SIRF PRODUCTS KI PRICE
  const productsTotal = products.reduce((sum, item) => {
    return sum + (Number(item.price) || 0) * item.qty;
  }, 0);

  // ✅ SMART TOTAL STRING
  const getTotalDisplay = () => {
    if (products.length > 0 && others.length > 0) {
      return `Rs. ${productsTotal} + Market Price + Delivery Charges`;
    } else if (products.length > 0) {
      return `Rs. ${productsTotal} + Delivery Charges`;
    } else {
      return `Market Price + Delivery Charges`;
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOrder = () => {
    if (!form.name || !form.phone || !form.address) {
      alert("Please fill all fields");
      return;
    }
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    let message = `🛒 *New Order — Kisan Direct*\n\n`;

    if (products.length > 0) {
      message += `🍎 *Fruits & Vegetables*\n`;
      products.forEach(item => {
        const itemTotal = (Number(item.price) || 0) * item.qty;
        message += `• ${item.name} (${item.quality}) x${item.qty}kg — Rs. ${itemTotal}\n`;
      });
      message += `\n`;
    }

    if (others.length > 0) {
      message += `🛒 *Other Items (Market Price)*\n`;
      others.forEach(item => {
        message += `• ${item.name}\n`;
      });
      message += `\n`;
    }

    // ✅ Smart total in message
    if (products.length > 0 && others.length > 0) {
      message += `💰 *Total: Rs. ${productsTotal} + Market Price + Delivery Charges*\n`;
    } else if (products.length > 0) {
      message += `💰 *Total: Rs. ${productsTotal} + Delivery Charges*\n`;
    } else {
      message += `💰 *Total: Market Price + Delivery Charges*\n`;
    }

    message += `\n👤 *Name:* ${form.name}`;
    message += `\n📞 *Phone:* ${form.phone}`;
    message += `\n📍 *Address:* ${form.address}`;

    const whatsappURL = `https://wa.me/923229404392?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");

    clearCart();
    setForm({ name: "", phone: "", address: "" });
    setSuccess(true);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm mt-4">
      <h3 className="font-semibold mb-3">Checkout</h3>

      {success && (
        <p className="text-green-600 text-sm mb-3">✅ Order placed successfully!</p>
      )}

      <input
        type="text" name="name" value={form.name}
        placeholder="Your Name" onChange={handleChange}
        className="w-full border p-2 rounded mb-2 text-sm"
      />
      <input
        type="text" name="phone" value={form.phone}
        placeholder="Phone Number" onChange={handleChange}
        className="w-full border p-2 rounded mb-2 text-sm"
      />
      <textarea
        name="address" value={form.address}
        placeholder="Delivery Address" onChange={handleChange}
        className="w-full border p-2 rounded mb-2 text-sm"
      />

      {/* ✅ SMART TOTAL — NaN nahi aayega */}
      <p className="text-sm font-semibold mb-3">
        Total: {getTotalDisplay()}
      </p>

      <button
        onClick={handleOrder}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
      >
        Place Order on WhatsApp
      </button>
    </div>
  );
}

export default Checkout;
