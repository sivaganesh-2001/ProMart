import React, { useState, useEffect } from "react";
import axios from "axios";

const CATEGORY_API_URL = "http://localhost:8081/api/categories";
const PRODUCT_CATEGORY_API_URL = "http://localhost:8081/api/product-categories";

const ProductCategories = () => {
  const [topCategories, setTopCategories] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [selectedTopCategory, setSelectedTopCategory] = useState("");
  const [newProductCategory, setNewProductCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    fetchTopCategories();
    fetchProductCategories();
  }, []);

  const fetchTopCategories = async () => {
    try {
      const response = await axios.get(CATEGORY_API_URL);
      setTopCategories(response.data);
    } catch (error) {
      console.error("Error fetching top-level categories:", error);
    }
  };

  const fetchProductCategories = async () => {
    try {
      const response = await axios.get(PRODUCT_CATEGORY_API_URL);
      setProductCategories(response.data);
    } catch (error) {
      console.error("Error fetching product categories:", error);
    }
  };

  const addProductCategory = async () => {
    if (!selectedTopCategory || newProductCategory.trim() === "") return;
    try {
      await axios.post(PRODUCT_CATEGORY_API_URL, {
        topCategory: selectedTopCategory, // Store top category ID instead of name
        name: newProductCategory,
      });
      setNewProductCategory("");
      fetchProductCategories();
    } catch (error) {
      console.error("Error adding product category:", error);
    }
  };

  const deleteProductCategory = async (id) => {
    try {
      await axios.delete(`${PRODUCT_CATEGORY_API_URL}/${id}`);
      fetchProductCategories();
    } catch (error) {
      console.error("Error deleting product category:", error);
    }
  };

  const startEditing = (category) => {
    setEditingCategory(category.id);
    setEditText(category.name);
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`${PRODUCT_CATEGORY_API_URL}/${id}`, { name: editText });
      setEditingCategory(null);
      fetchProductCategories();
    } catch (error) {
      console.error("Error updating product category:", error);
    }
  };

  return (
    <div className="flex flex-col items-center w-full p-6">
      {/* Input Section */}
      <div className="w-1/3 bg-white p-6 rounded-lg shadow-md border mb-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Add Product Category</h2>

        <div className="flex flex-col gap-4">
          <select
            className="p-2 border rounded"
            value={selectedTopCategory}
            onChange={(e) => setSelectedTopCategory(e.target.value)}
          >
            <option value="">Select Top-Level Category</option>
            {topCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            className="p-2 border rounded"
            placeholder="Enter product category name"
            value={newProductCategory}
            onChange={(e) => setNewProductCategory(e.target.value)}
          />

          <button
            onClick={addProductCategory}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </div>

      {/* Product Categories List */}
      <div className="w-full bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-2xl font-bold mb-4 text-center">Product Categories</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left border">#</th>
              <th className="p-3 text-left border">Top-Level Category</th>
              <th className="p-3 text-left border">Product Category</th>
              <th className="p-3 text-center border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {productCategories.map((category, index) => {
              const topCategoryName = topCategories.find(
                (cat) => cat.id === category.topCategory
              )?.name || "Unknown";

              return (
                <tr key={category.id} className="border-b">
                  <td className="p-3 border">{index + 1}</td>
                  <td className="p-3 border">{topCategoryName}</td>
                  <td className="p-3 border">
                    {editingCategory === category.id ? (
                      <input
                        type="text"
                        className="border p-1 w-full"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                    ) : (
                      category.name
                    )}
                  </td>
                  <td className="p-3 text-center space-x-2 border">
                    {editingCategory === category.id ? (
                      <button
                        onClick={() => saveEdit(category.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => startEditing(category)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => deleteProductCategory(category.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
            {productCategories.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center p-3 border">
                  No product categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductCategories;
