import pickle
import numpy as np
import tensorflow as tf
import pandas as pd
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class Recommender:
    def __init__(self, model_path, user_mapping_path, item_mapping_path, dataset_path='data/dataset.csv'):
        # Load the model
        try:
            self.model = tf.keras.models.load_model(model_path)
            logger.info(f"Model loaded successfully from {model_path}")
        except Exception as e:
            logger.error(f"Failed to load model from {model_path}: {str(e)}")
            raise

        # Load mappings
        try:
            with open(user_mapping_path, 'rb') as f:
                self.user_id_mapping = pickle.load(f)
            with open(item_mapping_path, 'rb') as f:
                self.item_id_mapping = pickle.load(f)
            logger.info(f"Loaded {len(self.user_id_mapping)} users and {len(self.item_id_mapping)} items")
        except Exception as e:
            logger.error(f"Failed to load mappings: {str(e)}")
            raise

        # Number of items
        self.num_items = len(self.item_id_mapping)
        logger.info(f"Total items: {self.num_items}")

        # Reverse item mapping for converting indices back to masterIds
        self.reverse_item_mapping = {i: v for v, i in self.item_id_mapping.items()}

        # Load dataset for user-item interactions
        try:
            self.df = pd.read_csv(dataset_path)
            self.df.rename(columns={'email': 'user', 'masterId': 'item'}, inplace=True)
            self.df['user_id'] = self.df['user'].map(self.user_id_mapping)
            self.df['item_id'] = self.df['item'].map(self.item_id_mapping)
            # Drop rows with unmapped users or items
            self.df.dropna(subset=['user_id', 'item_id'], inplace=True)
            logger.info(f"Dataset loaded with {self.df.shape[0]} interactions")
        except Exception as e:
            logger.error(f"Failed to load dataset from {dataset_path}: {str(e)}")
            raise

    def recommend_top_n(self, email, n=50):  # Default to 50 products
        if email not in self.user_id_mapping:
            logger.warning(f"Email {email} not found in user_id_mapping")
            return {"error": "Email not found in training data."}

        user_id = self.user_id_mapping[email]
        logger.info(f"User {email} mapped to ID {user_id}")

        # Items the user already interacted with
        interacted_items = set(self.df[self.df['user'] == email]['item_id'].values)
        logger.info(f"User interacted with {len(interacted_items)} items: {interacted_items}")

        # Predict scores for items not yet interacted
        candidate_items = np.array([i for i in range(self.num_items) if i not in interacted_items])
        if len(candidate_items) == 0:
            logger.warning(f"No candidate items for {email} (all items interacted)")
            return {"error": "No new items to recommend."}
        elif len(candidate_items) < n:
            logger.info(f"Only {len(candidate_items)} candidate items available, less than requested {n}")

        user_ids = np.full_like(candidate_items, user_id)

        # Make predictions
        try:
            predictions = self.model.predict([user_ids, candidate_items], verbose=0).flatten()
            logger.info(f"Predicted scores for {len(predictions)} items")
        except Exception as e:
            logger.error(f"Prediction failed for {email}: {str(e)}")
            return {"error": f"Prediction error: {str(e)}"}

        # Top N predictions (or fewer if not enough candidates)
        top_n = min(n, len(candidate_items))  # Adjust if fewer candidates than n
        top_indices = predictions.argsort()[-top_n:][::-1]
        top_item_ids = candidate_items[top_indices]
        top_master_ids = [self.reverse_item_mapping[i] for i in top_item_ids]
        logger.info(f"Top {top_n} recommendations for {email}: {top_master_ids}")

        return {"email": email, "recommendations": top_master_ids}