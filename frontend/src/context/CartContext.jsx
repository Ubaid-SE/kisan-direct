import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {

  // ✅ LOAD FROM LOCAL STORAGE
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ SAVE TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ ADD TO CART (FIXED + STRONG MATCHING)
  const addToCart = (item) => {
    const existing = cart.find(
      (p) =>
        p.name === item.name &&
        p.quality === item.quality
    );

    if (existing) {
      setCart(cart.map(p =>
        p.name === item.name && p.quality === item.quality
          ? { ...p, qty: p.qty + (item.qty || 1) }
          : p
      ));
    } else {
      setCart([...cart, {
        ...item,
        qty: item.qty || 1,
        price: Number(item.price) // ✅ ensure number
      }]);
    }
  };

  // ✅ INCREASE QTY
  const increaseQty = (name, quality) => {
    setCart((prev) =>
      prev.map((p) =>
        p.name === name && p.quality === quality
          ? { ...p, qty: p.qty + 1 }
          : p
      )
    );
  };

  // ✅ DECREASE QTY
  const decreaseQty = (name, quality) => {
    setCart((prev) =>
      prev.map((p) =>
        p.name === name && p.quality === quality && p.qty > 1
          ? { ...p, qty: p.qty - 1 }
          : p
      )
    );
  };

  // ✅ REMOVE ITEM
  const removeFromCart = (name, quality) => {
    setCart((prev) =>
      prev.filter((p) => !(p.name === name && p.quality === quality))
    );
  };

  // ✅ CLEAR CART
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // ✅ TOTAL PRICE (FIXED)
  const totalPrice = cart.reduce((acc, item) => {
    return acc + item.price * item.qty;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};