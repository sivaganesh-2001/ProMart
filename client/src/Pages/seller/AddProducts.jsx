import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase"; // Firebase storage
import MainLayout from "../../components/layouts/SellerLayout";

// Validation Schema using Yup
const schema = yup.object().shape({
  productName: yup.string().required("Product name is required"),
  brand: yup.string().required("Brand is required"),
  price: yup.number().typeError("Price must be a number").required("Price is required"),
  stock: yup.number().typeError("Stock must be a number").required("Stock is required"),
  unit: yup.string().required("Unit is required"),
  netQuantity: yup.string().required("Net Quantity is required"),
  image: yup.mixed().required("Image is required"),
  topCategory: yup.string().required("Top category is required"),
  productCategory: yup.string().required("Product category is required"),
});

const AddProducts = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [topCategories, setTopCategories] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [selectedTopCategory, setSelectedTopCategory] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  // Watch the form values for debugging
  const watchedValues = watch();

  // Fetch top categories
  useEffect(() => {
    const fetchTopCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/categories");
        console.log("Top Categories Response:", response.data); // Debug
        setTopCategories(response.data);
      } catch (error) {
        console.error("Error fetching top categories:", error);
      }
    };

    fetchTopCategories();
  }, []);

  // Fetch product categories based on selected top category
  useEffect(() => {
    const fetchProductCategories = async () => {
      if (selectedTopCategory) {
        try {
          const response = await axios.get(`http://localhost:8081/api/product-categories/topCategory?topCategory=${selectedTopCategory}`);
          // console.log("Product Categories Response:", response.data); // Debug
          setProductCategories(response.data);
        } catch (error) {
          console.error("Error fetching product categories:", error);
        }
      } else {
        setProductCategories([]);
      }
    };

    fetchProductCategories();
  }, [selectedTopCategory]);

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
        alert("Please upload an image.");
        setLoading(false);
        return;
      }

      const imageUrl = await uploadImageToFirebase(data.image);
      console.log("Image uploaded:", imageUrl);

      const sellerEmail = localStorage.getItem("sellerEmail");
      const sellerRes = await axios.get(`http://localhost:8081/api/sellers/${sellerEmail}`);
      const sellerId = sellerRes.data.id;

      // Debug all form data
      console.log("All Form Data:", data);
      console.log("Product Category Value:", data.productCategory);

      const productData = {
        productName: data.productName,
        brand: data.brand,
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        unit: data.unit,
        netQuantity: parseInt(data.netQuantity),
        imageUrl: imageUrl,
        sellerEmail: sellerEmail,
        sellerId: sellerId,
        soldCount: 0,
        createdAt: new Date().toISOString(),
        totalRevenue: 0,
        averageSellingPrice: parseFloat(data.price),
        customerRetentionRate: 0,
        dailySales: {},
        topCategory: data.topCategory, // This should already be an ID
        productCategory: data.productCategory, // Ensure this is also an ID
      };

      console.log("Product data being sent:", productData);

      await axios.post("http://localhost:8081/api/products/", productData);

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
      <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            Add New Product
          </h1>
          <p className="text-gray-600 text-center mt-2">
            Fill in the details below to list your product.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("productName")}
                      className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    {errors.productName && (
                      <p className="mt-1 text-red-500 text-xs">{errors.productName.message}</p>
                    )}
                  </div>

                  {/* Brand */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Brand <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("brand")}
                      className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    {errors.brand && (
                      <p className="mt-1 text-red-500 text-xs">{errors.brand.message}</p>
                    )}
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register("price")}
                      className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    {errors.price && (
                      <p className="mt-1 text-red-500 text-xs">{errors.price.message}</p>
                    )}
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Stock <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      {...register("stock")}
                      className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    {errors.stock && (
                      <p className="mt-1 text-red-500 text-xs">{errors.stock.message}</p>
                    )}
                  </div>

                  {/* Unit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Unit <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("unit")}
                      className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                      <option value="">Select Unit</option>
                      <option value="Piece">Piece</option>
                      <option value="mg">MilliGram</option>
                      <option value="Kg">KiloGram</option>
                      <option value="ml">MilliLitre</option>
                      <option value="L">Litre</option>
                      <option value="Meter">Meter</option>
                      <option value="Box">Box</option>
                    </select>
                    {errors.unit && (
                      <p className="mt-1 text-red-500 text-xs">{errors.unit.message}</p>
                    )}
                  </div>

                  {/* Net Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Net Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("netQuantity")}
                      className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    {errors.netQuantity && (
                      <p className="mt-1 text-red-500 text-xs">{errors.netQuantity.message}</p>
                    )}
                  </div>
                </div>

{/* Category Dropdowns at the Bottom */}
<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
  {/* Top Category Dropdown */}
  <div>
    <label className="block text-sm font-medium text-gray-700">
      Top Category <span className="text-red-500">*</span>
    </label>
    <select
      {...register("topCategory")}
      onChange={(e) => {
        const selectedValue = e.target.value;
        console.log("Selected Top Category ID:", selectedValue); // Debug
        setSelectedTopCategory(selectedValue);
        setValue("topCategory", selectedValue);
        setValue("productCategory", ""); // Reset product category
      }}
      className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
    >
      <option value="">Select Top Category</option>
      {topCategories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
    {errors.topCategory && (
      <p className="mt-1 text-red-500 text-xs">{errors.topCategory.message}</p>
    )}
  </div>

  {/* Product Category Dropdown */}
  <div>
    <label className="block text-sm font-medium text-gray-700">
      Product Category <span className="text-red-500">*</span>
    </label>
    <select
      {...register("productCategory")}
      onChange={(e) => {
        const selectedValue = e.target.value;
        console.log("Selected Product Category ID:", selectedValue); // Debug
        setValue("productCategory", selectedValue);
      }}
      className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
    >
      <option value="">Select Product Category</option>
      {productCategories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
    {errors.productCategory && (
      <p className="mt-1 text-red-500 text-xs">{errors.productCategory.message}</p>
    )}
  </div>
</div>


                <button
                  type="submit"
                  className={`w-full py-3 rounded-md text-white font-semibold transition-all ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Adding Product...
                    </span>
                  ) : (
                    "Add Product"
                  )}
                </button>
              </form>
            </div>

            {/* Image Upload Section */}
            <div className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-lg border border-dashed border-gray-300 hover:border-blue-500 transition">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image <span className="text-red-500">*</span>
              </label>
              <div className="relative w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                />
                <div className="flex items-center justify-center w-full h-32 bg-gray-200 rounded-md">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-md"
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <svg
                        className="mx-auto h-12 w-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                        />
                      </svg>
                      <p>Upload Image</p>
                    </div>
                  )}
                </div>
              </div>
              {errors.image && (
                <p className="mt-1 text-red-500 text-xs">{errors.image.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddProducts;