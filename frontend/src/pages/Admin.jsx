import { useState, useEffect } from "react";
import axios from "axios";

function Admin() {

  // ✅ STATES
  const [isAuth, setIsAuth] = useState(false);
  const [login, setLogin] = useState({ username: "", password: "" });

  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: { standard: "", premium: "", single: "" }, // ✅ UPDATED
    quality: "Premium",
    image: "",
    stock: true,
    category: "fruit",
    discount: ""
  });

  const [uploading, setUploading] = useState(false);

  const ADMIN_USER = "KDC";
  const ADMIN_PASS = "Kdc160905";

  // ✅ CATEGORY CHECK
  const isFreshCategory =
    form.category === "fruit" || form.category === "vegetable";

  // ✅ LOGIN
  const handleLogin = () => {
    if (login.username === ADMIN_USER && login.password === ADMIN_PASS) {
      setIsAuth(true);
    } else {
      alert("Wrong credentials");
    }
  };

  // ✅ FETCH
  const fetchProducts = () => {
    axios.get("http://localhost:5000/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    if (isAuth) fetchProducts();
  }, [isAuth]);

  // ✅ IMAGE UPLOAD
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "unsigned_preset");

    try {
      setUploading(true);

      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dowqw9ike/image/upload",
        data
      );

      setForm({ ...form, image: res.data.secure_url });
      setUploading(false);

    } catch (err) {
      console.log(err);
      alert("Upload failed");
      setUploading(false);
    }
  };

  // ✅ ADD / UPDATE
  const handleAdd = async () => {

    // ✅ VALIDATION FIX
    if (!form.name) {
      alert("Name required");
      return;
    }

    if (isFreshCategory) {
      if (!form.price.standard || !form.price.premium) {
        alert("Standard & Premium price required");
        return;
      }
    } else {
      if (!form.price.single) {
        alert("Price required");
        return;
      }
    }

    // ✅ FINAL PRICE OBJECT
    const finalData = {
      ...form,
      price: isFreshCategory
        ? {
            standard: Number(form.price.standard),
            premium: Number(form.price.premium)
          }
        : Number(form.price.single)
    };

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/products/${editingId}`,
          finalData
        );
        alert("Product Updated");
        setEditingId(null);
      } else {
        await axios.post(
          "http://localhost:5000/api/products",
          finalData
        );
        alert("Product Added");
      }

      fetchProducts();

      // RESET
      setForm({
        name: "",
        price: { standard: "", premium: "", single: "" },
        quality: "Premium",
        image: "",
        stock: true,
        category: "fruit",
        discount: ""
      });

    } catch (err) {
      console.log(err);
      alert("Operation failed");
    }
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setProducts(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Delete failed");
    }
  };

  // ✅ TOGGLE STOCK
  const toggleStock = async (item) => {
    try {
      await axios.put(
        `http://localhost:5000/api/products/${item._id}`,
        {
          ...item,
          stock: !item.stock
        }
      );
      fetchProducts();
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Stock update failed");
    }
  };

  // 🔒 LOGIN UI
  if (!isAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded shadow w-80 space-y-3">
          <h2 className="text-xl font-bold text-center">Admin Login</h2>

          <input
            placeholder="Username"
            className="border p-2 w-full"
            onChange={(e)=>setLogin({...login, username:e.target.value})}
          />

          <input
            type="password"
            placeholder="Password"
            className="border p-2 w-full"
            onChange={(e)=>setLogin({...login, password:e.target.value})}
          />

          <button
            onClick={handleLogin}
            className="bg-green-600 text-white w-full py-2 rounded"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // ✅ ADMIN PANEL
  return (
    <div className="p-6 bg-[#f3f5f4] min-h-screen">

      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      {/* FORM */}
      <div className="bg-white p-4 rounded shadow mb-6 space-y-3">

        <div className="grid md:grid-cols-2 gap-3">

          <input
            placeholder="Name"
            value={form.name}
            onChange={(e)=>setForm({...form, name:e.target.value})}
            className="border p-2 w-full"
          />

          {/* ✅ CONDITIONAL PRICE UI */}
          {isFreshCategory ? (
            <>
              <input
                placeholder="Standard Price"
                value={form.price.standard}
                onChange={(e)=>
                  setForm({
                    ...form,
                    price: { ...form.price, standard: e.target.value }
                  })
                }
                className="border p-2 w-full"
              />

              <input
                placeholder="Premium Price"
                value={form.price.premium}
                onChange={(e)=>
                  setForm({
                    ...form,
                    price: { ...form.price, premium: e.target.value }
                  })
                }
                className="border p-2 w-full"
              />
            </>
          ) : (
            <input
              placeholder="Price"
              value={form.price.single}
              onChange={(e)=>
                setForm({
                  ...form,
                  price: { ...form.price, single: e.target.value }
                })
              }
              className="border p-2 w-full"
            />
          )}

          <input
            type="file"
            onChange={handleImageUpload}
            className="border p-2 w-full"
          />

          <select
            value={form.category}
            onChange={(e)=>setForm({...form, category:e.target.value})}
            className="border p-2 w-full"
          >
            <option value="fruit">Fruit</option>
            <option value="vegetable">Vegetable</option>
            <option value="groceries">Groceries</option>
            <option value="homemade">Home Made</option>
          </select>

          <input
            placeholder="Discount %"
            value={form.discount}
            onChange={(e)=>setForm({...form, discount:e.target.value})}
            className="border p-2 w-full"
          />

        </div>

        {uploading ? (
          <p>Uploading...</p>
        ) : (
          form.image && (
            <img src={form.image} className="h-24 mt-2 rounded" />
          )
        )}

        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {editingId ? "Update Product" : "Add Product"}
        </button>

      </div>

      {/* PRODUCTS */}
      <div className="space-y-3">

        {products.map(item => (
          <div key={item._id} className="bg-white p-3 rounded shadow flex justify-between items-center">

            <div className="flex gap-3 items-center">
              <img src={item.image} className="h-16 w-16 rounded object-cover" />

              <div>
                <p className="font-semibold">{item.name}</p>

                {typeof item.price === "object" ? (
                  <>
                    <p>Standard: Rs. {item.price?.standard}</p>
                    <p>Premium: Rs. {item.price?.premium}</p>
                  </>
                ) : (
                  <p>Rs. {item.price}</p>
                )}

                {item.discount && (
                  <p className="text-green-600 text-xs">
                    {item.discount}% OFF
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-2">

              <button
                onClick={()=>toggleStock(item)}
                className={`px-3 py-1 text-xs rounded text-white ${
                  item.stock ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {item.stock ? "In Stock" : "Out"}
              </button>

              <button
                onClick={()=>handleDelete(item._id)}
                className="bg-black text-white px-3 py-1 text-xs rounded"
              >
                Delete
              </button>

              <button
                onClick={() => {
                  setForm({
                    ...item,
                    price:
                      typeof item.price === "object"
                        ? {
                            standard: item.price?.standard || "",
                            premium: item.price?.premium || "",
                            single: ""
                          }
                        : {
                            standard: "",
                            premium: "",
                            single: item.price
                          }
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