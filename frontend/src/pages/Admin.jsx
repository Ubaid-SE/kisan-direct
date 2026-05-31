import { useState, useEffect } from "react";
import axios from "axios";

//  Base categories hamesha dropdown mein rahein gi
const BASE_CATEGORIES = [
  { value: "fruit", label: "🍎 Fruit" },
  { value: "vegetable", label: "🥦 Vegetable" },
  { value: "groceries", label: "🛒 Groceries" },
  { value: "homemade", label: "🏠 Home Made" },
];

function Admin() {

  const [isAuth, setIsAuth] = useState(false);
  const [login, setLogin] = useState({ username: "", password: "" });
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [extraCategories, setExtraCategories] = useState([]);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: { standard: "", premium: "", single: "" },
    quality: "Premium",
    image: "",
    stock: true,
    category: "fruit",
    unit: "kg",
    variant: "",   //  NEW: e.g. "900 grams", "Large", "450g"
    discount: ""
  });

const ADMIN_USER = import.meta.env.VITE_ADMIN_USER;
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS;

  // Fruit/Vegetable = standard+premium price, baaki = single price
  const isFreshCategory = form.category === "fruit" || form.category === "vegetable";

  // Fruit/Vegetable = Standard/Premium dropdown, baaki = variant text field
  const showVariantField = !isFreshCategory;

  const handleLogin = () => {
    if (login.username === ADMIN_USER && login.password === ADMIN_PASS) {
      setIsAuth(true);
    } else {
      alert("Wrong credentials");
    }
  };

  const fetchProducts = () => {
    axios.get("http://localhost:5000/api/products")
      .then(res => {
        setProducts(res.data);
        // DB se extra categories nikalo
        const baseValues = BASE_CATEGORIES.map(c => c.value);
        const allCats = res.data.map(p => p.category).filter(Boolean);
        const uniqueExtra = [...new Set(allCats)].filter(cat => !baseValues.includes(cat));
        setExtraCategories(uniqueExtra);
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    if (isAuth) fetchProducts();
  }, [isAuth]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "unsigned_preset");
    try {
      setUploading(true);
      const res = await axios.post("https://api.cloudinary.com/v1_1/dowqw9ike/image/upload", data);
      setForm(prev => ({ ...prev, image: res.data.secure_url }));
      setUploading(false);
    } catch (err) {
      alert("Upload failed");
      setUploading(false);
    }
  };

  const handleCategoryChange = (val) => {
    if (val === "__custom__") {
      setIsCustomCategory(true);
      setForm(prev => ({ ...prev, category: "" }));
    } else {
      setIsCustomCategory(false);
      setForm(prev => ({ ...prev, category: val }));
    }
  };

  const handleAdd = async () => {
    if (!form.name) { alert("Name required"); return; }
    if (!form.category) { alert("Category likhein"); return; }
    if (!form.unit) { alert("Unit likhein (kg, litre, piece...)"); return; }

    if (isFreshCategory) {
      if (!form.price.standard || !form.price.premium) {
        alert("Standard & Premium price required");
        return;
      }
    } else {
      if (!form.price.single) { alert("Price required"); return; }
    }

    const finalData = {
      ...form,
      price: isFreshCategory
        ? { standard: Number(form.price.standard), premium: Number(form.price.premium) }
        : Number(form.price.single),
      discount: form.discount ? Number(form.discount) : 0,
      unit: form.unit || "kg",
      variant: form.variant || ""
    };

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/products/${editingId}`, finalData);
        alert("Product Updated");
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/api/products", finalData);
        alert("Product Added");
      }

      fetchProducts();

      setForm({
        name: "",
        price: { standard: "", premium: "", single: "" },
        quality: "Premium",
        image: "",
        stock: true,
        category: "fruit",
        unit: "kg",
        variant: "",
        discount: ""
      });
      setIsCustomCategory(false);

    } catch (err) {
      console.log(err);
      alert("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const toggleStock = async (item) => {
    try {
      await axios.put(`http://localhost:5000/api/products/${item._id}`, { ...item, stock: !item.stock });
      fetchProducts();
    } catch (err) {
      alert("Stock update failed");
    }
  };

  //  LOGIN
  if (!isAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded shadow w-80 space-y-3">
          <h2 className="text-xl font-bold text-center">Admin Login</h2>
          <input placeholder="Username" className="border p-2 w-full rounded"
            onChange={(e) => setLogin({ ...login, username: e.target.value })} />
          <input type="password" placeholder="Password" className="border p-2 w-full rounded"
            onChange={(e) => setLogin({ ...login, password: e.target.value })} />
          <button onClick={handleLogin} className="bg-green-600 text-white w-full py-2 rounded">Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#f3f5f4] min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded shadow mb-6 space-y-3">
        <div className="grid md:grid-cols-2 gap-3">

          {/* NAME */}
          <input
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 w-full rounded"
          />

          {/* CATEGORY */}
          <div className="flex flex-col gap-1">
            <select
              value={isCustomCategory ? "__custom__" : form.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="border p-2 w-full rounded"
            >
              {BASE_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
              {extraCategories.length > 0 && (
                <optgroup label="── Aapki Custom Categories ──">
                  {extraCategories.map(cat => (
                    <option key={cat} value={cat}>
                      📦 {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </optgroup>
              )}
              <option value="__custom__">✏️ Custom Category</option>
            </select>

            {isCustomCategory && (
              <input
                placeholder="Category likhein (e.g. Dairy, Bakery, Breakfast...)"
                value={form.category}
                onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                className="border p-2 w-full rounded border-green-500 focus:outline-none focus:ring-2 focus:ring-green-300"
                autoFocus
              />
            )}
          </div>

          {/* UNIT */}
          <div className="flex flex-col gap-1">
            <input
              placeholder="Unit: kg, litre, piece, dozen..."
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="border p-2 w-full rounded"
            />
            <p className="text-xs text-gray-400">Quantity counter ke saath dikhega (1 kg, 2 litre...)</p>
          </div>

          {/*  VARIANT — sirf non-fruit/vegetable ke liye */}
          {showVariantField && (
            <div className="flex flex-col gap-1">
              <input
                placeholder="Size/Weight (optional): 900 grams, 450g, Large, Small, 1 litre..."
                value={form.variant}
                onChange={(e) => setForm({ ...form, variant: e.target.value })}
                className="border p-2 w-full rounded border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <p className="text-xs text-gray-400">
                meaurence
              </p>
            </div>
          )}

          {/* PRICE */}
          {isFreshCategory ? (
            <>
              <input
                placeholder="Standard Price (Rs.)"
                value={form.price.standard}
                onChange={(e) => setForm({ ...form, price: { ...form.price, standard: e.target.value } })}
                className="border p-2 w-full rounded"
              />
              <input
                placeholder="Premium Price (Rs.)"
                value={form.price.premium}
                onChange={(e) => setForm({ ...form, price: { ...form.price, premium: e.target.value } })}
                className="border p-2 w-full rounded"
              />
            </>
          ) : (
            <input
              placeholder="Price (Rs.)"
              value={form.price.single}
              onChange={(e) => setForm({ ...form, price: { ...form.price, single: e.target.value } })}
              className="border p-2 w-full rounded"
            />
          )}

          {/* DISCOUNT */}
          <input
            placeholder="Discount % (optional)"
            value={form.discount}
            onChange={(e) => setForm({ ...form, discount: e.target.value })}
            className="border p-2 w-full rounded"
          />

          {/* IMAGE */}
          <input type="file" onChange={handleImageUpload} className="border p-2 w-full rounded" />

        </div>

        {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
        {!uploading && form.image && (
          <img src={form.image} className="h-24 mt-2 rounded object-cover" />
        )}

        <button onClick={handleAdd} className="bg-green-600 text-white px-6 py-2 rounded font-semibold">
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </div>

      {/* PRODUCTS LIST */}
      <div className="space-y-3">
        {products.map(item => (
          <div key={item._id} className="bg-white p-3 rounded shadow flex justify-between items-center">
            <div className="flex gap-3 items-center">
              <img
                src={item.image}
                className="h-16 w-16 rounded object-cover"
                onError={(e) => { e.target.src = "https://placehold.co/64x64/e8f5e9/2e7d32?text=Img"; }}
              />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-xs text-gray-500 capitalize">
                  📂 {item.category} &nbsp;|&nbsp; ⚖️ {item.unit || "kg"}
                  {item.variant ? ` | 📏 ${item.variant}` : ""}
                </p>
                {typeof item.price === "object" ? (
                  <>
                    <p className="text-xs">Standard: Rs. {item.price?.standard}</p>
                    <p className="text-xs">Premium: Rs. {item.price?.premium}</p>
                  </>
                ) : (
                  <p className="text-xs">Rs. {item.price}</p>
                )}
                {item.discount > 0 && (
                  <p className="text-green-600 text-xs">{item.discount}% OFF</p>
                )}
              </div>
            </div>

            <div className="flex gap-2 flex-wrap justify-end">
              <button
                onClick={() => toggleStock(item)}
                className={`px-3 py-1 text-xs rounded text-white ${item.stock ? "bg-green-500" : "bg-red-500"}`}
              >
                {item.stock ? "In Stock" : "Out"}
              </button>
              <button onClick={() => handleDelete(item._id)} className="bg-black text-white px-3 py-1 text-xs rounded">
                Delete
              </button>
              <button
                onClick={() => {
                  const baseValues = BASE_CATEGORIES.map(c => c.value);
                  const isCustom = !baseValues.includes(item.category);
                  setIsCustomCategory(isCustom);
                  setForm({
                    ...item,
                    unit: item.unit || "kg",
                    variant: item.variant || "",
                    price: typeof item.price === "object"
                      ? { standard: item.price?.standard || "", premium: item.price?.premium || "", single: "" }
                      : { standard: "", premium: "", single: item.price }
                  });
                  setEditingId(item._id);
                }}
                className="bg-blue-500 text-white px-3 py-1 text-xs rounded"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;
