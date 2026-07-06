import { useCart } from "../context/CartContext";
import logo from "../assets/Logo.png";
import { FaShoppingCart, FaMapMarkerAlt, FaShieldAlt } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

// Category display label
const getCategoryLabel = (cat) => {
  const labels = {
    fruit: "Fruits",
    vegetable: "Vegetables",
    groceries: "Groceries",
    homemade: "Home Made",
  };
  return labels[cat] || cat.charAt(0).toUpperCase() + cat.slice(1);
};

function Navbar({ setOpen, searchQuery, setSearchQuery, categories = [] }) {

  const { cart } = useCart();

  // Scroll to section
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-white shadow-sm border-b sticky top-0 z-50">

      {/* MAIN NAV */}
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">

        {/* LOGO */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <img src={logo} alt="Kisan Direct" className="h-10" />
          <div>
            <h1 className="text-green-700 font-bold text-lg leading-none">KISAN DIRECT</h1>
            <p className="text-xs text-gray-500">Farm Fresh To You</p>
          </div>
        </div>

        {/* SEARCH BAR — desktop */}
        <div className="hidden md:flex items-center border rounded-full px-4 py-2 w-96 bg-gray-50 focus-within:border-green-500 transition-colors">
          <FiSearch className="text-gray-500 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, categories..."
            className="bg-transparent outline-none ml-2 w-full text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-gray-400 hover:text-gray-600 ml-1 text-lg leading-none"
            >
              ×
            </button>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4 text-sm">
          <div className="hidden md:flex items-center gap-1 text-gray-600">
            <FaMapMarkerAlt /> Faisalabad
          </div>

          {/* ADMIN PANEL BUTTON */}
          <a
            href="/admin"
            className="hidden md:flex items-center gap-1.5 border border-green-600 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
          >
            <FaShieldAlt className="text-green-600" />
            Admin Panel
          </a>

          <div className="relative cursor-pointer" onClick={() => setOpen(true)}>
            <FaShoppingCart className="text-xl" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                {cart.length}
              </span>
            )}
          </div>
        </div>
      </div>

      {/*  MOBILE SEARCH */}
      <div className="flex md:hidden items-center border rounded-full px-4 py-2 mx-4 mb-2 bg-gray-50 focus-within:border-green-500 transition-colors">
        <FiSearch className="text-gray-500 flex-shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products, categories..."
          className="bg-transparent outline-none ml-2 w-full text-sm"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600 ml-1 text-lg leading-none">
            ×
          </button>
        )}
      </div>

      {/* MOBILE ADMIN PANEL LINK */}
      <div className="flex md:hidden justify-center pb-2">
        <a
          href="/admin"
          className="flex items-center gap-1.5 border border-green-600 text-green-700 px-3 py-1 rounded-lg text-xs font-medium hover:bg-green-50 transition-colors"
        >
          <FaShieldAlt className="text-green-600" />
          Admin Panel
        </a>
      </div>

      {/*  DYNAMIC MENU — jo categories DB mein hain wahi buttons dikhenge */}
      <div className="flex gap-1 overflow-x-auto text-sm px-6 pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => scrollToSection(cat)}
            className="whitespace-nowrap px-3 py-1 rounded-full hover:bg-green-100 hover:text-green-700 transition-colors text-gray-600 text-xs font-medium"
          >
            {getCategoryLabel(cat)}
          </button>
        ))}
      </div>

    </div>
  );
}

export default Navbar;