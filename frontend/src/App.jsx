import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import { useState, useEffect } from "react";
import axios from "axios";
import AddOnSection from "./components/AddOnSection";
import CartDrawer from "./components/CartDrawer";
import fruits from "./assets/fruits.png";
import TopBar from "./components/TopBar";
import Navbar from "./components/Navbar";
import { useCart } from "./context/CartContext";
import Checkout from "./components/Checkout";
import ProductCard from "./components/ProductCard";

// Known categories ke liye emoji
const CATEGORY_EMOJI = {
  fruit: "🍎",
  vegetable: "🥦",
  groceries: "🛒",
  homemade: "🏠",
  dairy: "🥛",
  meat: "🥩",
  bakery: "🍞",
  fish: "🐟",
  spices: "🌶️",
};

const getCategoryEmoji = (cat) => CATEGORY_EMOJI[cat?.toLowerCase()] || "📦";

// Display label
const getCategoryLabel = (cat) => {
  if (!cat) return "";
  const labels = {
    fruit: "Fruits",
    vegetable: "Vegetables",
    groceries: "Groceries",
    homemade: "Homemade Items (7 Days pre-order)",
  };
  return labels[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
};

function App() {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  //  Known order pehle, phir naye categories automatically
  const knownOrder = ["fruit", "vegetable", "groceries", "homemade"];

  const allCategories = [
    ...knownOrder.filter(cat => products.some(p => p.category === cat)),
    ...products
      .map(p => p.category)
      .filter((cat, idx, arr) =>
        !knownOrder.includes(cat) && arr.indexOf(cat) === idx
      )
  ];

  //  Search filter
  const filterBySearch = (productList) => {
    if (!searchQuery.trim()) return productList;
    const q = searchQuery.toLowerCase().trim();
    return productList.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q)
    );
  };

  const noResults = searchQuery.trim() &&
    allCategories.every(cat =>
      filterBySearch(products.filter(p => p.category === cat)).length === 0
    );

  const { addToCart } = useCart();

  // Dynamic Section component
  const Section = ({ category }) => {
    const data = filterBySearch(products.filter(p => p.category === category));
    if (searchQuery.trim() && data.length === 0) return null;

    return (
      <div id={category} className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">
            {getCategoryEmoji(category)} {getCategoryLabel(category)}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pb-2">
          {data.length === 0 ? (
            <p className="text-sm text-gray-400">No items</p>
          ) : (
            data.map((item, i) => (
              <div key={i} className="w-full">
                <ProductCard product={item} addToCart={addToCart} />
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="bg-[#f3f5f4] font-sans">
            <TopBar />
            <Navbar
              setOpen={setOpen}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              categories={allCategories}
            />

            <div className="max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                <div className="md:col-span-9 space-y-4 md:space-y-6">

                  {/* HERO */}
                  {!searchQuery && (
                    <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6">
                      <div className="flex flex-col-reverse md:grid md:grid-cols-2 items-center gap-4">
                        <div className="text-center md:text-left">
                          <h1 className="text-2xl md:text-4xl font-bold text-green-700 leading-tight">
                            Farm Fresh Fruits & Vegetables
                          </h1>
                          <h2 className="text-lg md:text-2xl font-semibold mt-1">Direct from Farmers</h2>
                          <p className="text-gray-600 mt-1 text-xs md:text-sm">Fresh, Affordable & Delivered to Your Doorstep</p>
                          <p className="text-green-600 mt-1 font-medium text-xs md:text-sm">Master Fruit Farm, Toba Tek Singh</p>
                          <p className="text-[10px] md:text-xs text-gray-500 mt-2">
                            ✔ Same Day Delivery | ✔ Fresh Guarantee | ✔ Cash on Delivery
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-3 text-xs text-center md:text-left">
                            <div>⭐ 100+ Happy Customers</div>
                            <div>🚚 Delivery in Faisalabad</div>
                            <div>🌾 Direct From Farmers</div>
                          </div>
                        </div>
                        <div>
                          <img src={fruits} alt="fruits" className="w-full h-48 md:h-80 object-cover rounded-xl" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* OFFER */}
                  {!searchQuery && (
                    <div className="bg-green-100 border border-green-200 p-3 md:p-4 rounded-xl flex items-center gap-3 shadow-sm">
                      <span className="bg-yellow-400 px-3 py-1 rounded text-white text-xs font-semibold">SPECIAL OFFER</span>
                      <p className="text-gray-700 text-xs md:text-sm">
                        We also buy grocery and other items which you want from the market & deliver to your door step same day —
                        <span className="text-green-700 font-semibold"> With little Charges!</span>
                      </p>
                    </div>
                  )}

                  {/* SEARCH HEADER */}
                  {searchQuery && (
                    <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm">
                      <p className="text-sm text-gray-600">
                        Results for: <span className="font-semibold text-green-700">"{searchQuery}"</span>
                      </p>
                      <button onClick={() => setSearchQuery("")} className="text-xs text-gray-400 hover:text-red-500">
                        Clear ×
                      </button>
                    </div>
                  )}

                  {/* NO RESULTS */}
                  {noResults && (
                    <div className="text-center py-16">
                      <p className="text-4xl mb-3">🔍</p>
                      <p className="text-gray-500 text-sm">
                        No products found for <span className="font-semibold">"{searchQuery}"</span>
                      </p>
                      <button onClick={() => setSearchQuery("")} className="mt-3 text-green-600 text-sm underline">
                        Show all products
                      </button>
                    </div>
                  )}

                  {/*  DYNAMIC SECTIONS — API se jo bhi category aaye automatically section banta hai */}
                  {allCategories.map(cat => (
                    <Section key={cat} category={cat} />
                  ))}

                  {!searchQuery && <AddOnSection />}

                </div>
              </div>

              {/* INFO */}
              <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 mt-8">
                <div className="space-y-4 text-sm">
                  <div className="flex gap-3 items-start">
                    <div className="text-green-600 text-xl">🔄</div>
                    <div>
                      <h3 className="font-semibold">Return Policy</h3>
                      <p className="text-gray-600 text-xs">Not satisfied with quality? Return on the spot. We'll replace it or refund you.</p>
                    </div>
                  </div>
                  <hr />
                  <div className="flex gap-3 items-start">
                    <div className="text-green-600 text-xl">✔️</div>
                    <div>
                      <h3 className="font-semibold">Instant Delivery</h3>
                      <p className="text-gray-600 text-xs">Market items delivered instantly (9AM–11PM)</p>
                    </div>
                  </div>
                  <hr />
                  <div className="flex gap-3 items-center">
                    <div className="text-green-600 text-xl">🎁</div>
                    <div>
                      <h3 className="font-semibold">Payment Method</h3>
                      <p className="text-green-600 font-bold text-base">Cash on Delivery / Online</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="bg-green-800 text-white mt-16 py-8">
                <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-6 text-sm">
                  <div>
                    <h3 className="font-bold text-base mb-1">Kisan Direct</h3>
                    <p className="text-gray-200">Fresh produce directly from farms</p>
                  </div>
                  <div>
                    <p>📍 Faisalabad</p>
                    <p className="mt-1">📞 0322-9404392</p>
                  </div>
                  <div>
                    <p>Monthly Subscription also available</p>
                    <p className="mt-1">On time Delivery</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 text-sm">Follow Us</h4>
                    <div className="flex flex-col gap-3">
                      <a href="https://www.instagram.com/kisan_direct?igsh=MTZzOW5mNHF0cHZwNg==" target="_blank" rel="noopener noreferrer"
                        style={{ display:"flex", alignItems:"center", gap:"10px", background:"linear-gradient(45deg,#f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)", color:"#fff", padding:"9px 16px", borderRadius:"10px", textDecoration:"none", fontWeight:"600", fontSize:"13px", width:"fit-content" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                        Instagram
                      </a>
                      <a href="https://www.tiktok.com/@kisan_direct?_r=1&_t=ZS-96J36h3vVll" target="_blank" rel="noopener noreferrer"
                        style={{ display:"flex", alignItems:"center", gap:"10px", background:"#010101", border:"1px solid #333", color:"#fff", padding:"9px 16px", borderRadius:"10px", textDecoration:"none", fontWeight:"600", fontSize:"13px", width:"fit-content" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.79a4.85 4.85 0 0 1-1.01-.1z" fill="#ffffff"/>
                        </svg>
                        TikTok
                      </a>
                    </div>
                  </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 mt-6 border-t border-green-700 pt-4">
                  <p className="text-xs text-gray-300">© 2026 Kisan Direct — All rights reserved</p>
                </div>
              </div>

            </div>
            <CartDrawer open={open} setOpen={setOpen} />
          </div>
        } />

        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
