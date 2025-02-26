import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase"; // Firebase storage
import MainLayout from "../../components/layouts/SellerLayout";
import Footer from "../../components/Footer";

// Validation Schema using Yup
const schema = yup.object().shape({
  productName: yup.string().required("Product name is required"),
  category: yup.string().required("Category is required"),
  brand: yup.string().required("Brand is required"),
  price: yup.number().typeError("Price must be a number").required("Price is required"),
  stock: yup.number().typeError("Stock must be a number").required("Stock is required"),
  unit: yup.string().required("Unit is required"),
  description: yup.string().nullable(),
  image: yup.mixed().required("Image is required"),
});

const AddProducts = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  // Fetch seller ID by email
  const fetchSellerIdByEmail = async (email) => {
    try {
      const response = await axios.get(`http://localhost:8081/api/sellers/${email}`);
      console.log(response.data.id);
      return response.data.id; // Assuming the response contains the seller ID
    
    } catch (error) {
      throw new Error("Failed to fetch seller ID");
    }
  };

  // Upload image to Firebase and return its URL
  const uploadImageToFirebase = async (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `products/${file.name}`);
      const metadata = { contentType: file.type };
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);
  
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.error("Image upload failed:", error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  // Handle image preview and set value correctly
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setValue("image", file, { shouldValidate: true });
    } else {
      setImagePreview(null);
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");

    try {
      if (!data.image) {
        throw new Error("Please select an image before submitting.");
      }

      // Upload image to Firebase and get the URL
      const imageUrl = await uploadImageToFirebase(data.image);
      console.log("Image uploaded:", imageUrl);

      // Get the seller's email from local storage
      const sellerEmail = localStorage.getItem("sellerEmail");
    
      // Fetch the seller ID using the email
      const sellerId = await fetchSellerIdByEmail(sellerEmail);
  
      // Prepare product data with image URL and sellerId
      const productData = {
        productName: data.productName,
        category: data.category,
        brand: data.brand,
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        unit: data.unit,
        description: data.description || "",
        imageUrl: imageUrl,
        sellerId: sellerId, // Include sellerId in product data
        sellerEmail:sellerEmail,
        soldCount: 0, // Initialize soldCount
        createdAt: new Date().toISOString(), // Set createdAt to current date
        totalRevenue: 0, // Initialize totalRevenue
        averageSellingPrice: parseFloat(data.price), // Set averageSellingPrice to the price
        customerRetentionRate: 0, // Initialize customerRetentionRate
        dailySales: {}, // Initialize dailySales as an empty object
      };

      console.log("Product data being sent:", productData);

      // Send data to backend
      await axios.post(`http://localhost:8081/api/products/`, productData);

      alert("Product added successfully!");
      reset();
      setImagePreview(null);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
       {/* Centered Heading */}
  <div className="w-full flex justify-center mt-6">
    <h1 className="text-3xl font-bold text-gray-800">Add Product</h1>
  </div>
      <div className="w-full max-w-6xl p-10 bg-white shadow-lg rounded-lg grid grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="col-span-2 ml-10">
          
          {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium">Product Name *</label>
              <input type="text" {...register("productName")} className="w-full border rounded-md p-2" />
              <p className="text-red-500 text-xs">{errors.productName?.message}</p>
            </div>

            <div>
              <label className="block text-sm font-medium">Brand *</label>
              <input type="text" {...register("brand")} className="w-full border rounded-md p-2" />
              <p className="text-red-500 text-xs">{errors.brand?.message}</p>
            </div>

            <div>
              <label className="block text-sm font-medium">Stock *</label>
              <input type="number" {...register("stock")} className="w-full border rounded-md p-2" />
              <p className="text-red-500 text-xs">{errors.stock?.message}</p>
            </div>

            <div>
              <label className="block text-sm font-medium">Unit *</label>
              <select {...register("unit")} className="w-full border rounded-md p-2">
                <option value="">Select Unit</option>
                <option value="Piece">Piece</option>
                <option value="Kg">Kg</option>
                <option value="Litre">Litre</option>
                <option value="Meter">Meter</option>
                <option value="Box">Box</option>
              </select>
              <p className="text-red-500 text-xs">{errors.unit?.message}</p>
            </div>

            <div>
              <label className="block text-sm font-medium">Price (₹) *</label>
              <input type="number" {...register("price")} className="w-full border rounded-md p-2" />
              <p className="text-red-500 text-xs">{errors.price?.message}</p>
            </div>

            <div>
              <label className="block text-sm font-medium">Category *</label>
              <select {...register("category")} className="w-full border rounded-md p-2">
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Groceries">Groceries</option>
                <option value="Books">Books</option>
                <option value="Furniture">Furniture</option>
              </select>
              <p className="text-red-500 text-xs">{errors.category?.message}</p>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium">Description</label>
              <textarea {...register("description")} className="w-full border rounded-md p-2" />
            </div>

            <div className="col-span-2">
              <button
                type="submit"
                className={`w-full py-2 rounded-md ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} text-white`}
                disabled={loading}
              >
                {loading ? "Adding Product..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>

        {/* Image Upload Section */}
        <div className="flex flex-col items-center justify-center border p-20 rounded-lg bg-gray-100">
          <label className="block text-sm font-medium">Product Image *</label>
          <input type="file" className="w-full" onChange={handleImageChange} />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="mt-2 w-48 h-48 object-cover border-2 border-gray-300 rounded-lg"
            />
          )}
        </div>
      </div>
   
    </MainLayout>
  );
};

export default AddProducts;