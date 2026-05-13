import ProductCard from "./ProductCard";
import mango from "../assets/hero.png"; // temp image

const productsData = [
  {
    id: 1,
    name: "Mango Chaunsa",
    quality: "Premium / Export Quality",
    price: 220,
    stock: true,
    image: mango,
  },
  {
    id: 2,
    name: "Mango Dusehri",
    quality: "Standard Quality",
    price: 180,
    stock: true,
    image: mango,
  },
  {
    id: 3,
    name: "Mango Langra",
    quality: "Economy Quality",
    price: 120,
    stock: false,
    image: mango,
  },
];

const Products = ({ addToCart }) => {
  return (
    <div className="px-10 py-10">
      <h1 className="text-2xl font-bold mb-6">Shop Fruits</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {productsData.map((item) => (
          <ProductCard key={item.id} product={item} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
};

export default Products;