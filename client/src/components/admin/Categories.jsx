import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8081/api/categories"; // Backend API

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editText, setEditText] = useState("");

  // Fetch categories from the backend
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_URL);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Add Category
  const addCategory = async () => {
    if (newCategory.trim() === "") return;
    try {
      await axios.post(API_URL, { name: newCategory });
      setNewCategory("");
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  // Delete Category
  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // Edit Category
  const startEditing = (category) => {
    setEditingCategory(category.id);
    setEditText(category.name);
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`${API_URL}/${id}`, { name: editText });
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  return (
    <div className="flex-1 p-6">
      <h2 className="text-3xl font-bold mb-6">Manage Categories</h2>

      {/* Add Category */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="p-2 border rounded w-full"
          placeholder="Enter category name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button onClick={addCategory} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>

      {/* Categories List */}
      <div className="bg-white p-4 rounded shadow-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">#</th>
              <th className="p-3 text-left">Category Name</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category.id} className="border-b">
                <td className="p-3">{index + 1}</td>
                <td className="p-3">
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
                <td className="p-3 text-center space-x-2">
                  {editingCategory === category.id ? (
                    <button
                      onClick={() => saveEdit(category.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => startEditing(category)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center p-3">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories;