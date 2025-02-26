import React, { useState, useEffect } from "react";
import { db } from "../firebase"; // Adjust path based on your project structure
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

function Addresses() {
  const [name, setName] = useState(""); // Customer Name
  const [prevName, setPrevName] = useState(""); // Store previous name for comparison
  const [addressFields, setAddressFields] = useState({
    doorNo: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [phone, setPhone] = useState(""); // Phone Number
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [customerEmail, setCustomerEmail] = useState("");
  const [docId, setDocId] = useState(null);

    useEffect(() => {
      // Fetch user email from local storage
      const userInfo = JSON.parse(localStorage.getItem("userInfoF"));
      if (userInfo && userInfo.email) {
        setCustomerEmail(userInfo.email);
        fetchCustomerDetails(userInfo.email);
      } else {
        setLoading(false);
      }
    }, []);

    // Fetch user details from Firestore
    const fetchCustomerDetails = async (email) => {
      try {
        const usersCollection = collection(db, "users");
        const q = query(usersCollection, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          setDocId(userDoc.id); // Save Firestore Document ID
          const userData = userDoc.data();

          // Set Customer Name & Store Previous Name
          setName(userData.name || "");
          setPrevName(userData.name || ""); // Store the initial name for comparison

          // Split stored address into separate fields if it exists
          if (userData.address) {
            const addressParts = userData.address.split(", ");
            setAddressFields({
              doorNo: addressParts[0] || "",
              area: addressParts[1] || "",
              city: addressParts[2] || "",
              state: addressParts[3] || "",
              pincode: addressParts[4] || "",
            });
          }
          setPhone(userData.phone || "");
        } else {
          console.log("No matching document found for the email:", email);
        }
      } catch (error) {
        console.error("Error fetching customer details:", error);
      }
      setLoading(false);
    };

    // Handle Input Change
    const handleChange = (e) => {
      setAddressFields({ ...addressFields, [e.target.name]: e.target.value });
    };

    const handlePhoneChange = (e) => {
      setPhone(e.target.value);
    };

    const handleNameChange = (e) => {
      setName(e.target.value);
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
      e.preventDefault();

      if (phone.length !== 10) {
        alert("Phone number must be 10 digits.");
        return;
      }

      // Merge address fields into a single string
      const mergedAddress = `${addressFields.doorNo}, ${addressFields.area}, ${addressFields.city}, ${addressFields.state}, ${addressFields.pincode}`;

      try {
        if (docId) {
          const userRef = doc(db, "users", docId);
          await updateDoc(userRef, { name, address: mergedAddress, phone });

          setIsEditing(false);
        } else {
          alert("Error: No matching user document found.");
        }
      } catch (error) {
        console.error("Error saving details:", error);
      }

    // Prepare Data for Backend
    const customerData = {
      customerName: name.trim(),
      customerEmail: customerEmail.trim(),
    };

    console.log("Sending data to backend:", customerData);

    try {
      const response = await fetch("http://localhost:8081/api/customers/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      });

      const responseData = await response.text(); // Read response

      if (response.ok) {
        alert("Address and Name saved successfully!");
        console.log("Customer details saved successfully in backend!", responseData);
        setPrevName(name.trim()); // Update previous name after successful save
      } else {
        console.error("Failed to save customer details. Response:", responseData);
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
    }
  };

  return (
    <div className="container mx-auto max-w-lg p-6 bg-white shadow-md rounded-lg mt-6">
      <h2 className="text-xl font-semibold text-center mb-4">Your Address</h2>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : (
        <>
          {!isEditing ? (
            // Show Existing Details if Available
            name || phone || addressFields.doorNo ? (
              <div className="border p-4 rounded-md bg-gray-100">
                <p className="text-gray-800"><strong>Name:</strong> {name || "Not Provided"}</p>
                <p className="text-gray-800"><strong>Phone:</strong> {phone || "Not Provided"}</p>
                <p className="text-gray-800"><strong>Address:</strong></p>
                <p className="text-gray-600">
                  {addressFields.doorNo && `${addressFields.doorNo}, ${addressFields.area}, ${addressFields.city}, ${addressFields.state}, ${addressFields.pincode}`}
                </p>
                <button
                  className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-4"
                  onClick={() => setIsEditing(true)}
                >
                  Update Details
                </button>
              </div>
            ) : (
              // If No Details Exist, Show "Add Details"
              <p
                className="text-blue-500 text-center cursor-pointer"
                onClick={() => setIsEditing(true)}
              >
                + Add Details
              </p>
            )
          ) : (
            // Form for Editing Details
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-gray-700">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={handleNameChange}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>

              {["doorNo", "area", "city", "state", "pincode"].map((field) => (
                <div key={field}>
                  <label className="block text-gray-700">
                    {field.charAt(0).toUpperCase() + field.slice(1)}:
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={addressFields[field]}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
              ))}

              <div>
                <label className="block text-gray-700">Phone Number:</label>
                <input
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full border p-2 rounded"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  required
                />
              </div>

              <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
                Save Details
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}

export default Addresses;
