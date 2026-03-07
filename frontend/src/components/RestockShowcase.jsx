import ProductCard from "./ProductCard";

const RestockShowcase = () => {
  const products = [
    {
      _id: "restock-briefcase",
      name: "Nomad All-leather Briefcase",
      price: 60000,
      discountPrice: 59999, // shows SAVE 0%
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
      name: "The Weekender – Luggage Bag",
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

  return (
    <section className="bg-[var(--prada-off-white)] px-4 pb-16 pt-6" aria-labelledby="restock-title">
      <div className="mx-auto flex max-w-[1100px] flex-col items-center text-center">
        <div className="mt-10 grid w-full justify-center gap-8 md:grid-cols-2 md:gap-10">
          {products.map((product) => (
            <div key={product._id} className="flex justify-center">
              <ProductCard product={product} loading={false} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RestockShowcase;
