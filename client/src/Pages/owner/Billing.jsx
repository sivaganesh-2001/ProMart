import { useState, useEffect, useRef, useCallback } from "react";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import MainLayout from "../../components/layouts/MainLayout";
import Footer from "../../components/Footer";
import debounce from "lodash.debounce";

const BillingPage = () => {
  const [customer, setCustomer] = useState({ name: "", mobile: "" });
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(5); // Default tax 5%
  const productNameRef = useRef(null);
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const [newProduct, setNewProduct] = useState({
    productName: "",
    price: "",
    quantity: 1,
    stock: 0,
    id: "", // Add an id field to store the actual product ID
  });
  const sellerEmail = localStorage.getItem("sellerEmail");
  const [shopId, setShopId] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [orderDate, setOrderDate] = useState("");

  // Calculate total amount whenever products change
  useEffect(() => {
    const total = products.reduce((sum, item) => sum + item.quantity * item.price, 0);
    setTotalAmount(total);
  }, [products]);

  // Add a new product to the list
  const addProduct = () => {
    if (!newProduct.productName || !newProduct.price || !newProduct.id) {
      alert("Please fill in all product fields."); // Alert if fields are missing
      return; 
    }

    setProducts((prevProducts) => [
      ...prevProducts,
      {
        ...newProduct,
        price: parseFloat(newProduct.price) || 0,
        quantity: parseFloat(newProduct.quantity) || 1,
      },
    ]);

    setNewProduct({ productName: "", price: "", quantity: 1, stock: 0, id: "" }); // Reset id
    productNameRef.current?.focus();
  };

  // Generate the bill and save it
  const generateBill = async () => {
    if (!customer.name || !customer.mobile || products.length === 0) {
      alert("Please fill in all customer fields and add at least one product."); // Alert if fields are missing
      return;
    }

    setLoading(true);
    const billData = {
      customer: customer.name,
      sellerId: sellerEmail,
      items: products.map((product) => ({
        productId: product.id, // Use the actual product ID
        quantity: product.quantity,
        price: product.price,
      })),
      totalAmount,
      phone: customer.mobile,
      orderDate: orderDate || new Date().toISOString(),
      billGeneratedTime: new Date().toISOString(),
    };

    try {
      const response = await axios.post("http://localhost:8081/api/billing/offline/save", billData);
      console.log("Bill saved:", response.data);
      alert("Bill saved successfully!");

      // Reduce stock levels
      const productQuantities = products.reduce((acc, product) => {
        acc[product.id] = (acc[product.id] || 0) + Number(product.quantity); // Ensure cumulative quantity
        return acc;
      }, {});
  
      console.log("productQuantities", productQuantities);
  
      // Send to backend
      await axios.post("http://localhost:8081/api/products/reduceStock", productQuantities);
      console.log("Stock reduced successfully");
  
      // Clear products after successful order
      setProducts([]);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to generate bill: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch shop ID based on seller email
  useEffect(() => {
    const fetchShopId = async () => {
      if (!sellerEmail) {
        console.error("No seller email found in local storage.");
        return;
      }

      try {
        const shopResponse = await axios.get(`http://localhost:8081/api/sellers/${sellerEmail}`);
        setShopId(shopResponse.data.id);
      } catch (error) {
        console.error("Error fetching shop details", error);
      }
    };

    fetchShopId();
  }, [sellerEmail]);

  // Fetch popular products for the shop
  useEffect(() => {
    const fetchPopularProducts = async () => {
      if (!shopId) return;
      try {
        const response = await axios.get(`http://localhost:8081/api/sellers/${shopId}/products`);
        setPopularProducts(response.data);
      } catch (error) {
        console.error("Error fetching popular products:", error);
      }
    };

    fetchPopularProducts();
  }, [shopId]);

  // Update dropdown position for suggestions
  useEffect(() => {
    if (productNameRef.current && suggestions.length > 0) {
      const rect = productNameRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [suggestions]);

  // Fetch products based on search query
  const fetchProducts = async (query) => {
    if (!query || !shopId) {
      setSuggestions(popularProducts);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8081/api/sellers/${shopId}/products/search?query=${query}`);
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching product suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchProducts = useCallback(debounce(fetchProducts, 300), [shopId]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewProduct((prev) => ({ ...prev, productName: value }));
    debouncedFetchProducts(value);
  };

  const selectProduct = (product) => {
    setNewProduct({
      productName: product.productName,
      price: product.price.toFixed(2),
      quantity: 1,
      stock: product.stock,
      id: product.id, // Set the actual product ID
    });
    setSuggestions([]);
  };

  const updateQuantity = (id, qty) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) =>
        p.id === id
          ? { ...p, quantity: isNaN(parseFloat(qty)) ? 1 : parseFloat(qty) }
          : p
      )
    );
  };

  const removeProduct = (id) => {
    setProducts((prevProducts) => prevProducts.filter((p) => p.id !== id));
  };

  const subtotal = products.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const taxAmount = ((subtotal - discountAmount) * tax) / 100;
  const finalTotal = subtotal - discountAmount + taxAmount;

  return (
    <MainLayout>
      <div className="w-full max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-6">Billing System - Promart</h2>

          {/* Customer Details */}
          <div className="bg-gray-100 p-4 rounded mb-6">
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block font-bold">Customer Name</label>
                <input
                  type="text"
                  className="border p-2 w-full rounded"
                  value={customer.name}
                  onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  required
                  tabIndex="1" // Make it accessible via tab
                />
              </div>
              <div className="w-1/2">
                <label className="block font-bold">Mobile No</label>
                <input
                  type="tel"
                  className="border p-2 w-full rounded"
                  value={customer.mobile}
                  onChange={(e) => setCustomer({ ...customer, mobile: e.target.value })}
                  required
                  tabIndex="2" // Make it accessible via tab
                />
              </div>
            </div>
          </div>

          {/* Product Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full border-collapse text-left">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 border">S.No</th>
                  <th className="p-3 border">Product</th>
                  <th className="p-3 border">Price</th>
                  <th className="p-3 border">Quantity</th>
                  <th className="p-3 border">Total</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, index) => (
                  <tr key={p.id} className="border">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{p.productName}</td>
                    <td className="p-3">₹{p.price.toFixed(2)}</td>
                    <td className="p-3">{p.quantity}</td>
                    <td className="p-3">₹{(p.price * p.quantity).toFixed(2)}</td>
                    <td className="p-3">
                      <button onClick={() => removeProduct(p.id)} className="text-red-500">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Product Input Row */}
                <tr className="border bg-gray-100">
                  <td className="p-3">{products.length + 1}</td>
                  <td className="p-3 relative">
                    <input
                      type="text"
                      ref={productNameRef}
                      className="border p-2 w-full rounded"
                      placeholder="Search product..."
                      value={newProduct.productName}
                      onChange={handleInputChange}
                      required
                      tabIndex="3" // Make it accessible via tab
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      className="border p-2 w-20 rounded text-center"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      required
                      tabIndex="4" // Make it accessible via tab
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      className="border p-2 w-16 rounded text-center"
                      value={newProduct.quantity}
                      onChange={(e) => {
                        const quantity = parseFloat(e.target.value);
                        if (quantity > newProduct.stock) {
                          alert(`Only ${newProduct.stock} items available in stock`);
                          return;
                        }
                        setNewProduct({ ...newProduct, quantity });
                      }}
                      required
                      tabIndex="5" // Make it accessible via tab
                    />
                  </td>
                  <td className="p-3">-</td>
                  <td className="p-3">
                    <button onClick={addProduct} className="bg-blue-500 text-white px-4 py-2 rounded">
                      Add
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Suggestion Dropdown */}
          {suggestions.length > 0 && (
            <ul
              ref={dropdownRef}
              className="absolute bg-white border rounded shadow-lg max-h-60 overflow-y-auto z-50"
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
              }}
            >
              {suggestions.map((item) => (
                <li
                  key={item.id}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => selectProduct(item)}
                >
                  {item.productName} - ₹{item.price}
                </li>
              ))}
            </ul>
          )}

          {/* Totals Section */}
          <div className="bg-gray-100 p-4 rounded mt-4">
            <div className="flex justify-between mb-2">
              <label className="font-bold">Total MRP:</label>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <label className="font-bold">Discount ({discount}%):</label>
              <span>- ₹{discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <label className="font-bold">Tax ({tax}%):</label>
              <span>+ ₹{taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold mt-2 border-t pt-2">
              <label>Final Total:</label>
              <span>₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Discount & Tax Input */}
          <div className="bg-gray-100 p-4 rounded mt-4 flex justify-between">
            <div>
              <label>Discount (%)</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                className="border p-2 w-16 rounded ml-2"
                required
                tabIndex="6" // Make it accessible via tab
              />
            </div>
            <div>
              <label>Tax (%)</label>
              <input
                type="number"
                value={tax}
                onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                className="border p-2 w-16 rounded ml-2"
                required
                tabIndex="7" // Make it accessible via tab
              />
            </div>
          </div>
          <button
            onClick={generateBill}
            className="bg-green-500 text-white w-full py-2 rounded font-bold mt-4"
            tabIndex="8" // Make it accessible via tab
          >
            Generate Bill
          </button>
        </div>
      </div>
      <Footer />
    </MainLayout>
  );
};

export default BillingPage;