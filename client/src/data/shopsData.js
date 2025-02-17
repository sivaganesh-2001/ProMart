const shopsData = [
  {
    id: 1,
    name: "Siva Stores",
    image: "./images/image1.jpeg",
    rating: 4.5,
    distance: 1.2,
    category: ["Grocery", "Electronics"], // Multiple categories
    products: [
      { id: 1, name: "Aashirvad Flour", description: "Aashirvad wheat flour", image: "/images/aashirvad.jpeg", price: 200 },
      { id: 2, name: "Sunflower oil", description: "Mr. Gold Sunflower Oil", image: "/images/sunflower_oil.jpeg", price: 500 }
    ]
  },
  {
    id: 2,
    name: "Ganesh Stores",
    image: "./images/image2.jpeg",
    rating: 4.0,
    distance: 3.4,
    category: ["Electronics"], // Single category
    products: [
      { id: 1, name: "Product C", description: "Description of Product C", image: "/images/sunflower_oil.jpeg", price: 200 },
      { id: 2, name: "Product D", description: "Description of Product D", image: "/images/aashirvad.jpeg", price: 510 }
    ]
  },
  {
    id: 3,
    name: "Daily Needs Supermarket",
    rating: 4.2,
    distance: 1.9,
    category: ["Grocery"], // Single category
    image: "./images/image3.jpeg",
  },
  {
    id: 4,
    name: "Spices & Masala House",
    rating: 4.7,
    distance: 2.8,
    category: ["Spices", "Grocery"], // Multiple categories
    image: "./images/image4.jpeg",
  },
];

export default shopsData;
