import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../../components/layouts/SellerLayout"; // Main Layout Wrapper

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [brand, setBrand] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const [editingProductId, setEditingProductId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    productName: "",
    brand: "",
    price: 0,
    stock: 0,
    unit: "",
    description: "",
    netQuantity: "",
  });

  const [loading, setLoading] = useState(true);

  // Get sellerEmail from local storage
  const sellerEmail = localStorage.getItem("sellerEmail");

  // Fetch products from the backend
  useEffect(() => {
    const fetchShopDetails = async () => {
      if (!sellerEmail) {
        console.error("No seller email found in local storage.");
        return;
      }

      try {
        const shopResponse = await axios.get(
          `http://localhost:8081/api/sellers/${sellerEmail}`
        );

        const productsResponse = await axios.get(
          `http://localhost:8081/api/sellers/${shopResponse.data.id}/products`
        );
        setProducts(productsResponse.data);



      } catch (error) {
        console.error("Error fetching shop and products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopDetails();
  }, [sellerEmail]);

  // Handle Delete Product
  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        console.log('productId',productId);
        console.log('seller',sellerEmail)
        await axios.delete(`http://localhost:8081/api/products/${productId}/seller/${sellerEmail}`);
        setProducts(products.filter((product) => product.id !== productId));
        setFilteredProducts(filteredProducts.filter((product) => product.id !== productId));
        alert("Product deleted successfully!");
        console.log('deleted')
      } catch (error) {
        console.log('not deleted')
        console.error("Error deleting product:", error);
        alert("Failed to delete product.");
       
      }
    }
  };

  // Stock status logic
  const getStockStatus = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock > 0 && stock <= 20) return "Low Stock";
    return "In Stock";
  };

  // Handle Filtering
  useEffect(() => {
    let filtered = products;

    if (brand) {
      filtered = filtered.filter((product) => product.brand === brand);
    }

    if (stockStatus) {
      filtered = filtered.filter((product) => getStockStatus(product.stock) === stockStatus);
    }

    if (sortOrder) {
      filtered = [...filtered].sort((a, b) =>
        sortOrder === "Low to High" ? a.price - b.price : b.price - a.price
      );
    }

    setFilteredProducts(filtered);
  }, [brand, stockStatus, sortOrder, products]);

  // Handle Edit Product
  const handleEditClick = (product) => {
    setEditingProductId(product.id);
    setEditFormData({
      productName: product.productName,
      brand: product.brand,
      price: product.price,
      stock: product.stock,
      unit: product.unit,
      description: product.description,
      netQuantity: product.netQuantity,
    });
  };

  const handleSaveClick = async () => {
    try {
      const updatedProduct = await axios.put(
        `http://localhost:8081/api/products/${editingProductId}`,
        editFormData
      );

      setProducts(
        products.map((product) =>
          product.id === updatedProduct.data.id ? updatedProduct.data : product
        )
      );
      setEditingProductId(null);
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product.");
    }
  };

  const handleCancelClick = () => {
    setEditingProductId(null);
    setEditFormData({
      productName: "",
      brand: "",
      price: 0,
      stock: 0,
      unit: "",
      description: "",
      netQuantity: "",
    });
  };

  return (
    <MainLayout>
      <div className="w-full max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        {/* Top Banner */}
        <div className="bg-green-600 text-white p-6 rounded-lg text-center">
          <h1 className="text-2xl font-bold">🛒 Grocery Products</h1>
          <p className="text-sm mt-1">Manage your grocery store inventory easily!</p>
        </div>

        {/* Sorting & Filtering Section */}
        <div className="flex space-x-4 mt-4 mb-6">
          <select className="border p-2 rounded w-1/3" onChange={(e) => setBrand(e.target.value)}>
            <option value="">All Brands</option>
            {Array.from(new Set(products.map((product) => product.brand))).map((brandName) => (
              <option key={brandName} value={brandName}>{brandName}</option>
            ))}
          </select>

          <select className="border p-2 rounded w-1/3" onChange={(e) => setStockStatus(e.target.value)}>
            <option value="">All Stock Status</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          <select className="border p-2 rounded w-1/3" onChange={(e) => setSortOrder(e.target.value)}>
            <option value="">Sort By Price</option>
            <option value="Low to High">Low to High</option>
            <option value="High to Low">High to Low</option>
          </select>
        </div>

        {/* Product Table */}
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Image</th>
              <th className="border p-2 text-left">Title</th>
              <th className="border p-2">Brand</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Net Quantity</th>
              <th className="border p-2">Stock </th>
              <th className="border p-2">Stock Status</th>
              <th className="border p-2">Update</th>
              <th className="border p-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border">
                <td className="border p-2">
                  <img src={product.imageUrl} alt={product.productName} className="w-12 h-12 rounded-lg" />
                </td>
                <td className="border p-2">
                  {editingProductId === product.id ? (
                    <input
                      type="text"
                      value={editFormData.productName}
                      onChange={(e) => setEditFormData({ ...editFormData, productName: e.target.value })}
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    <span className="font-semibold">{product.productName}</span>
                  )}
                  <br />
                  <span className="text-sm text-gray-500">
                    {/* {editingProductId === product.id ? (
                      <textarea
                        value={editFormData.netQuantity}
                        onChange={(e) => setEditFormData({ ...editFormData, netQuantity: e.target.value})}
                        className="border p-1 rounded w-full"
                      />
                    ) : (
                   `${product.netQuantity} ${product.unit}`
              
                    )

                    } */}
                  </span>
                </td>
                <td className="border p-2">
                  {editingProductId === product.id ? (
                    <input
                      type="text"
                      value={editFormData.brand}
                      onChange={(e) => setEditFormData({ ...editFormData, brand: e.target.value })}
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    product.brand
                  )}
                </td>
                <td className="border p-2">
                  {editingProductId === product.id ? (
                    <input
                      type="number"
                      value={editFormData.price}
                      onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    `₹${product.price}`
                  )}
                </td>
                <td className="border p-2">
                  {editingProductId === product.id ? (
                    <input
                      type="text"
                      value={editFormData.netQuantity}
                      onChange={(e) => setEditFormData({ ...editFormData, netQuantity: e.target.value })}
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    `${product.netQuantity} ${product.unit}` // Show netQuantity with unit
                  )}
                </td>
                <td className="border p-2">
                  {editingProductId === product.id ? (
                    <input
                      type="number"
                      value={editFormData.stock}
                      onChange={(e) => setEditFormData({ ...editFormData, stock: e.target.value })}
                      className="border p-1 rounded w-full"
                    />
                  ) : (
                    `${product.stock}`
                  )}
                </td>
                <td className="border p-2">
                  {editingProductId === product.id ? (
                    <button
                      onClick={handleSaveClick}
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <span
                      className={`px-2 py-1 rounded ${
                        getStockStatus(product.stock) === "Out of Stock"
                          ? "bg-red-500 text-white"
                          : getStockStatus(product.stock) === "Low Stock"
                          ? "bg-yellow-500 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {getStockStatus(product.stock)}
                    </span>
                  )}
                </td>
                <td className="border p-2">
                  {editingProductId === product.id ? (
                    <button
                      onClick={handleCancelClick}
                      className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditClick(product)}
                      className="text-blue-600"
                    >
                      Update
                    </button>
                  )}
                </td>
                <td className="border p-2 text-red-600 cursor-pointer" onClick={() => handleDelete(product.id)}>
                  Delete
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
};

export default Products;
 