import { FaLeaf, FaTruck, FaMoneyBillWave, FaUndo } from "react-icons/fa";

function Hero() {
  return (
    <div className="bg-[#f3f5f4] px-4 md:px-6 py-4">

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl mx-auto">

        {/* LEFT */}
        <div className="md:col-span-9 bg-white p-6 md:p-8 rounded-2xl shadow-sm grid md:grid-cols-2 gap-6 items-center">

          {/* TEXT */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-green-700 leading-tight">
              Farm Fresh Fruits & Vegetables
            </h1>

            <h2 className="text-xl md:text-2xl font-semibold mt-2">
              Direct from Farmers
            </h2>

            <p className="text-gray-600 mt-2 text-sm">
              Fresh, affordable & delivered to your doorstep
            </p>

            <p className="text-green-600 mt-2 font-medium text-sm">
              Master Fruit Farm, Toba Tek Singh
            </p>

            {/* FEATURES */}
            <div className="grid grid-cols-4 gap-4 mt-6 text-xs text-gray-600">
              <div className="flex flex-col items-center gap-1">
                <FaLeaf /> Direct From Farm
              </div>
              <div className="flex flex-col items-center gap-1">
                <FaTruck /> Fresh
              </div>
              <div className="flex flex-col items-center gap-1">
                <FaMoneyBillWave /> Reasonable Prices
              </div>
              <div className="flex flex-col items-center gap-1">
                <FaUndo /> Easy Return
              </div>
            </div>

            <button className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow">
              Order on WhatsApp
            </button>
          </div>

          {/* IMAGE */}
          <div>
            <img
              src="{fruits}"
              className="w-full h-64 md:h-80 object-cover rounded-xl"
            />
          </div>

        </div>

        {/* RIGHT SIDEBAR */}
        <div className="md:col-span-3 space-y-4">

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="font-semibold text-sm">Return Policy</h3>
            <p className="text-xs text-gray-600 mt-1">
              Return within 24 hours
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="font-semibold text-sm">Delivery Charges</h3>
            <p className="text-xs text-gray-600 mt-1">
              Rs. 50 - 149
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <h3 className="font-semibold text-sm">Minimum Order</h3>
            <p className="text-green-600 font-bold mt-1">
              Rs. 499
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Hero;