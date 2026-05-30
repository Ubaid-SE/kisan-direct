import express from "express";
import Product from "../models/Product.mjs";

const router = express.Router();


// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ADD product
router.post("/", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// UPDATE product (FIX FOR STOCK TOGGLE)
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//  DELETE product (FIX FOR DELETE BUTTON)
router.delete("/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


export default router;