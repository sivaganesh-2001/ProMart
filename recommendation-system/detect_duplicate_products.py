import pymongo
import pandas as pd
from bson import ObjectId  # Import ObjectId for MongoDB updates
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# **Step 1: Connect to MongoDB**
client = pymongo.MongoClient("mongodb+srv://msivaganesh1115:sivaganesh@promart.pqerg.mongodb.net/?retryWrites=true&w=majority&appName=promart")
db = client["promart_db"]
products_collection = db["products"]
master_products_collection = db["master_products"]

# **Step 2: Fetch All Products**
products = list(products_collection.find({}, {"_id": 1, "productName": 1, "brand": 1}))
if not products:
    print("❌ No products to process.")
    exit()

df = pd.DataFrame(products).fillna("")  # Handle missing values

# **Step 3: Preprocess Product Names**
def preprocess_text(text):
    return text.lower().strip()  # Convert to lowercase and strip spaces

df["processedText"] = df.apply(lambda row: f"{row['productName']} {row['brand']}", axis=1)
df["processedText"] = df["processedText"].apply(preprocess_text)

# **Step 4: Compute TF-IDF and Cosine Similarity**
vectorizer = TfidfVectorizer(stop_words="english")
tfidf_matrix = vectorizer.fit_transform(df["processedText"])
similarity_matrix = cosine_similarity(tfidf_matrix)

# **Step 5: Group Similar Products into Clusters**
threshold = 0.8  # Similarity threshold
clusters = {}  # Store product clusters
product_to_master = {}  # Track master ID for each product
assigned = set()  # Track assigned products

for i, row in df.iterrows():
    product_id = str(row["_id"])  # Convert to string for mapping
    
    if product_id in assigned:
        continue  # Skip already grouped products

    # Create a new master product ID
    new_master_id = f"m{len(clusters) + 1}"
    clusters[new_master_id] = {product_id}  # Add the first product to the cluster
    product_to_master[product_id] = new_master_id
    assigned.add(product_id)

    # Check similarity with other products
    for j in range(len(df)):
        if i != j and similarity_matrix[i, j] > threshold:
            similar_product_id = str(df.iloc[j]["_id"])
            if similar_product_id not in assigned:
                clusters[new_master_id].add(similar_product_id)
                product_to_master[similar_product_id] = new_master_id
                assigned.add(similar_product_id)

# **Step 6: Upsert Master Products into MongoDB**
for master_id, product_ids in clusters.items():
    master_products_collection.update_one(
        {"_id": master_id},
        {"$set": {"productIds": list(product_ids)}},
        upsert=True  # If master_id exists, update it; otherwise, insert a new one
    )

# **Step 7: Update Individual Products with Master ID**
bulk_updates = [
    pymongo.UpdateOne(
        {"_id": ObjectId(product_id)},  #  Convert product_id to ObjectId
        {"$set": {"masterId": master_id}}
    )
    for product_id, master_id in product_to_master.items()
]

if bulk_updates:
    result = products_collection.bulk_write(bulk_updates)
    print(f" {result.modified_count} products updated with masterId.")

# **Step 8: Debugging Prints**
print("\n🔍 Sample Master ID Assignments:")
for product_id, master_id in list(product_to_master.items())[:5]:  # Show first 5
    print(f"Product: {product_id} -> Master ID: {master_id}")

print("\n Script execution completed successfully.")
