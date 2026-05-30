import { useCart } from "../context/CartContext";
import { useState } from "react";

const CartDrawer = ({ open, setOpen }) => {
  const {
    cart,
    increaseQty,
    decreaseQty,
    removeFromCart,
  } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // SPLIT KR DIA CART KO
  const products = cart.filter(item => item.type !== "other");
  const others = cart.filter(item => item.type === "other");

  //  SIRF PRODUCTS KI PRICE CALCULATE KARO (other items ki price nahi hoti)
  const productsTotal = products.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    return sum + price * item.qty;
  }, 0);

  // FREE DELIVERY LOGIC
const freeDeliveryThreshold = 1499;

const remainingAmount = freeDeliveryThreshold - productsTotal;

const hasFreeDelivery = productsTotal >= freeDeliveryThreshold;

const getTotalDisplay = () => {
  //  BOTH PRODUCTS + OTHER ITEMS
  if (products.length > 0 && others.length > 0) {
    if (hasFreeDelivery) {
      return `Rs. ${productsTotal} + Market Price + FREE Delivery`;
    } else {
      return `Rs. ${productsTotal} + Market Price + Delivery Charges 50-199(Based on Location)`;
    }
  }

  //  ONLY PRODUCTS
  else if (products.length > 0) {
    if (hasFreeDelivery) {
      return `Rs. ${productsTotal} + FREE Delivery`;
    } else {
      return `Rs. ${productsTotal} + Delivery Charges 50-199(Based on Location)`;
    }
  }

  //  ONLY OTHER ITEMS
  else {
    return `Market Price + Delivery Charges`;
  }
};
  //  WHATSAPP MESSAGE — same smart format
  const handleOrder = () => {
    if (!name || !phone || !address) {
      alert("Please fill all details");
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

    // Smart total in WhatsApp message
    if (products.length > 0 && others.length > 0) {
      message += `💰 *Total: Rs. ${productsTotal} + Market Price + Delivery Charges*\n`;
    } else if (products.length > 0) {
      message += `💰 *Total: Rs. ${productsTotal} + Delivery Charges*\n`;
    } else {
      message += `💰 *Total: Market Price + Delivery Charges*\n`;
    }

    if (products.length > 0) {
      message += `\n🚚 Delivery Slot: 9AM–11AM or 4PM–6PM`;
    } else {
      message += `\n🚚 Delivery: Flexible (Market Items)`;
    }

    message += `\n\n👤 *Name:* ${name}`;
    message += `\n📞 *Phone:* ${phone}`;
    message += `\n📍 *Address:* ${address}`;

    const whatsappNumber = "923229404392";
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 flex flex-col
      ${open ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* HEADER */}
      <div className="p-4 border-b flex justify-between">
        <h2 className="font-bold">Your Cart</h2>
        <button onClick={() => setOpen(false)}>✕</button>
      </div>

      {/* ITEMS */}
<div className="p-4 overflow-y-auto max-h-[45vh] md:max-h-[35vh]">
        {cart.length === 0 && (
          <p className="text-sm text-gray-500">Cart is empty</p>
        )}

        {/* 🍎 PRODUCTS */}
        {products.length > 0 && (
          <>
            <h3 className="text-xs font-semibold text-green-700 mb-2">
              Fruits & Vegetables
            </h3>
            {products.map((item, i) => (
              <div key={i} className="mb-3 text-xs border-b pb-2">
                <div className="flex justify-between">
                  <span>{item.name} ({item.quality})</span>
                  <button onClick={() => removeFromCart(item.name, item.quality)}>✕</button>
                </div>
                <div className="flex justify-between mt-1">
                  <div className="flex gap-2 items-center">
                    <button onClick={() => decreaseQty(item.name, item.quality)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => increaseQty(item.name, item.quality)}>+</button>
                  </div>
                  <span className="text-green-600 font-semibold">
                    Rs. {(Number(item.price) || 0) * item.qty}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}

        {/* 🛒 OTHER ITEMS */}
        {others.length > 0 && (
          <>
            <h3 className="text-xs font-semibold text-blue-600 mt-3 mb-2">
              Other Items
            </h3>
            {others.map((item, i) => (
              <div key={i} className="mb-2 text-xs border-b pb-2">
                <div className="flex justify-between items-center">
                  <span>{item.name}</span>
                  <button onClick={() => removeFromCart(item.name, item.quality)}>✕</button>
                </div>
                {/* ✅ Other items ke liye "Market Price" show karo */}
                <p className="text-gray-400 mt-0.5">Market Price</p>
              </div>
            ))}
          </>
        )}

      </div>

{/* FORM + FOOTER */}
<div className="p-3 border-t space-y-2">

  <input
    placeholder="Your Name"
    className="w-full border p-1.5 text-xs rounded"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />

  <input
    placeholder="Phone Number"
    className="w-full border p-1.5 text-xs rounded"
    value={phone}
    onChange={(e) => setPhone(e.target.value)}
  />

  <textarea
    rows={2}
    placeholder="Address"
    className="w-full border p-1.5 text-xs rounded"
    value={address}
    onChange={(e) => setAddress(e.target.value)}
  />

        {/* ✅ SMART TOTAL — NaN kabhi nahi aayega */}
        <p className="font-semibold text-sm">
          Total: {getTotalDisplay()}
        </p>

        {/* ✅ FREE DELIVERY MESSAGE */}
{products.length > 0 && (
  <div className="mt-2">
    {!hasFreeDelivery ? (
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
        <p className="text-xs text-orange-700 font-medium">
          🚚 Add Rs. {remainingAmount} more to unlock FREE delivery
        </p>

        {/* PROGRESS BAR */}
        <div className="w-full bg-orange-100 h-2 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(
                (productsTotal / freeDeliveryThreshold) * 100,
                100
              )}%`,
            }}
          ></div>
        </div>
      </div>
    ) : (
      <div className="bg-green-50 border border-green-200 rounded-lg p-2">
        <p className="text-xs text-green-700 font-semibold">
          🎉 You unlocked FREE delivery!
        </p>
      </div>
    )}
  </div>
)}

        <button
          onClick={handleOrder}
          className="w-full bg-green-600 text-white py-2 rounded mt-2"
        >
          Checkout on WhatsApp
        </button>

        {/* DELIVERY SLOTS */}
       {/* DELIVERY SLOTS */}
{products.length > 0 && (
  <div className="bg-green-50 border border-green-200 rounded-lg p-2">
    
    <h3 className="text-xs font-semibold text-green-700 mb-1">
      Delivery Schedule
    </h3>

    <div className="grid grid-cols-2 gap-1 text-[10px]">
      <div className="border p-1 rounded text-center bg-white">
        8 AM – 11 AM
      </div>

      <div className="border p-1 rounded text-center bg-white">
        4 PM – 6 PM
      </div>
    </div>

    <p className="text-[9px] text-gray-500 mt-1 leading-tight">
      📌 Orders are delivered in time slots for efficiency except instant orders.
    </p>

  </div>
)}


      </div>
    </div>
  );
};

export default CartDrawer;
