import { useCart } from "../context/CartContext";
import logo from "../assets/logo.png";
import { FaShoppingCart, FaMapMarkerAlt } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";

function Navbar({ setOpen, searchQuery, setSearchQuery }) {

  const { cart } = useCart();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white shadow-sm border-b">

      {/* MAIN NAV */}
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">

        {/* LOGO */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="Kisan Direct" className="h-10" />
          <div>
            <h1 className="text-green-700 font-bold text-lg leading-none">
              KISAN DIRECT
            </h1>
            <p className="text-xs text-gray-500">Farm Fresh To You</p>
          </div>
        </div>

        {/* ✅ SEARCH BAR — ab kaam karta hai */}
        <div className="hidden md:flex items-center border rounded-full px-4 py-2 w-96 bg-gray-50 focus-within:border-green-500 transition-colors">
          <FiSearch className="text-gray-500 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search fruits, vegetables, category..."
            className="bg-transparent outline-none ml-2 w-full text-sm"
          />
          {/* ✅ Clear button — search clear karne ke liye */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-gray-400 hover:text-gray-600 ml-1 text-lg leading-none"
            >
              ×
            </button>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4 text-sm">
          <div className="hidden md:flex items-center gap-1 text-gray-600">
            <FaMapMarkerAlt /> Faisalabad
          </div>

          {/* CART */}
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

      {/* ✅ MOBILE SEARCH — mobile pe bhi kaam kare */}
      <div className="flex md:hidden items-center border rounded-full px-4 py-2 mx-4 mb-2 bg-gray-50 focus-within:border-green-500 transition-colors">
        <FiSearch className="text-gray-500 flex-shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search fruits & vegetables..."
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

      {/* MENU */}
      <div className="flex gap-4 overflow-x-auto text-sm px-6 pb-2">
        <span onClick={() => scrollToSection("fruits")} className="cursor-pointer hover:text-green-600">Fruits</span>
        <span onClick={() => scrollToSection("vegetables")} className="cursor-pointer hover:text-green-600">Vegetables</span>
        <span onClick={() => scrollToSection("groceries")} className="cursor-pointer hover:text-green-600">Groceries</span>
        <span onClick={() => scrollToSection("homemade")} className="cursor-pointer hover:text-green-600">Home Made</span>
      </div>

    </div>
  );
}

export default Navbar;
