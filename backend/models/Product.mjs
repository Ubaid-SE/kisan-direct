import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },

  // Flexible price — object (standard/premium) ya direct number
  price: { type: mongoose.Schema.Types.Mixed },

  quality: { type: String, default: "Standard" },
  stock: { type: Boolean, default: true },
  image: { type: String },

  // Category — koi bhi string
  category: { type: String, default: "fruit" },

  discount: { type: Number },

  // Unit — kg, litre, piece, etc.
  unit: { type: String, default: "kg" },

  // ✅ NEW: Variant — admin likhega: "900 grams", "450g", "Large", "Small", "1 litre" etc.
  // Sirf non-fruit/vegetable categories ke liye
  variant: { type: String, default: "" }

}, { timestamps: true });

export default mongoose.model("Product", productSchema);
