import ProductCard from "./ProductCard";

const products = [
  {
    _id: "restock-briefcase",
    name: "Nomad All-leather Briefcase",
    price: 60000,
    discountPrice: 59999,
    img: [
      "https://www.waldorleather.com/cdn/shop/products/custom_resized_efd69711-4b84-4a7b-a5ff-314f12042e6b.jpg?v=1769556766&width=990",
      "https://www.waldorleather.com/cdn/shop/products/custom_resized_efd69711-4b84-4a7b-a5ff-314f12042e6b.jpg?v=1769556766&width=990",
    ],
    colors: [
      { hex: "#c11b1b" },
      { hex: "#101010" },
      { hex: "#1f3f1f" },
      { hex: "#c9a300" },
      { hex: "#4a5ea3" },
    ],
    stock: 5,
  },
  {
    _id: "restock-weekender",
    name: "The Weekender \u2013 Luggage Bag",
    price: 60000,
    discountPrice: 59999,
    img: [
      "https://www.waldorleather.com/cdn/shop/products/8_9be8830e-3b68-4ddf-9631-be2ac9040522.jpg?v=1683289272&width=990",
      "https://www.waldorleather.com/cdn/shop/products/8_9be8830e-3b68-4ddf-9631-be2ac9040522.jpg?v=1683289272&width=990",
    ],
    colors: [
      { hex: "#c11b1b" },
      { hex: "#101010" },
      { hex: "#1f3f1f" },
      { hex: "#c9a300" },
      { hex: "#4a5ea3" },
    ],
    stock: 5,
  },
];

const RestockShowcase = () => {
  return (
    <div className="max-w-[1440px] mx-auto px-[clamp(20px,5vw,80px)] pb-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-[900px] mx-auto">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} loading={false} />
        ))}
      </div>
    </div>
  );
};

export default RestockShowcase;
