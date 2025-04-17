import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules
import pickle
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MBAModel:
    def __init__(self, rules_path='data/mba_rules.pkl'):
        """
        Initialize MBA model.
        Args:
            rules_path: Path to store/load rules.
        """
        self.rules = None
        self.frequent_items = None
        self.all_items = None  # Store all unique masterIds
        self.rules_path = rules_path

    def train(self, transactions):
        """
        Train MBA model using Apriori algorithm.
        Args:
            transactions: List of transactions (each a list of masterIds).
        """
        if not transactions:
            logger.warning("No transactions provided for training")
            self.rules = None
            self.frequent_items = None
            self.all_items = None
            return

        try:
            # Log dataset stats
            unique_items = sorted(set(item for trans in transactions for item in trans))
            self.all_items = unique_items
            logger.info(f"Dataset stats: {len(transactions)} transactions, {len(unique_items)} unique masterIds")

            # One-hot encode transactions
            encoded_vals = []
            for trans in transactions:
                labels = {item: 1 if item in trans else 0 for item in unique_items}
                encoded_vals.append(labels)
            
            encoded_df = pd.DataFrame(encoded_vals)
            logger.info(f"Encoded transactions into DataFrame: {encoded_df.shape}")

            # Apply Apriori algorithm
            frequent_itemsets = apriori(
                encoded_df,
                min_support=0.01,  # Adjust based on data
                use_colnames=True,
                low_memory=True
            )
            
            if frequent_itemsets.empty:
                logger.warning("No frequent itemsets found")
                self.rules = None
                self.frequent_items = None
                return
            
            # Store frequent items
            self.frequent_items = frequent_itemsets.sort_values('support', ascending=False)
            logger.info(f"Generated {len(frequent_itemsets)} frequent itemsets")

            # Generate association rules
            rules = association_rules(
                frequent_itemsets,
                metric="confidence",
                min_threshold=0.5  # Adjust based on needs
            )
            
            if rules.empty:
                logger.warning("No association rules generated")
                self.rules = None
                return
            
            self.rules = rules.sort_values('confidence', ascending=False)
            logger.info(f"Generated {len(rules)} association rules")

            # Save rules and frequent items
            os.makedirs(os.path.dirname(self.rules_path), exist_ok=True)
            with open(self.rules_path, 'wb') as f:
                pickle.dump({
                    'rules': self.rules,
                    'frequent_items': self.frequent_items,
                    'all_items': self.all_items
                }, f)
            logger.info(f"Saved rules, frequent items, and all items to {self.rules_path}")

        except Exception as e:
            logger.error(f"Error during training: {e}")
            self.rules = None
            self.frequent_items = None
            self.all_items = None

    def load_rules(self):
        """
        Load saved rules, frequent items, and all items from file.
        """
        try:
            if os.path.exists(self.rules_path):
                with open(self.rules_path, 'rb') as f:
                    data = pickle.load(f)
                    self.rules = data.get('rules')
                    self.frequent_items = data.get('frequent_items')
                    self.all_items = data.get('all_items')
                logger.info(f"Loaded rules, frequent items, and all items from {self.rules_path}")
            else:
                logger.warning(f"No rules found at {self.rules_path}")
                self.rules = None
                self.frequent_items = None
                self.all_items = None
        except Exception as e:
            logger.error(f"Error loading rules: {e}")
            self.rules = None
            self.frequent_items = None
            self.all_items = None

    def predict(self, master_ids, num_recommendations=5):
        """
        Predict exactly num_recommendations masterIds based on input masterIds.
        Args:
            master_ids: List of masterIds.
            num_recommendations: Number of recommendations to return (default 5).
        Returns:
            List of exactly num_recommendations masterIds.
        """
        if not master_ids:
            logger.warning("No masterIds provided for prediction")
            return self._get_fallback_recommendations(num_recommendations, [])

        if self.rules is None:
            self.load_rules()
            if self.rules is None:
                logger.warning("No rules available for prediction")
                return self._get_fallback_recommendations(num_recommendations, master_ids)

        try:
            recommendations = []
            # Collect recommendations from rules
            for master_id in master_ids:
                matching_rules = self.rules[
                    self.rules['antecedents'].apply(lambda x: master_id in x)
                ]
                for _, row in matching_rules.iterrows():
                    for consequent in row['consequents']:
                        if consequent not in master_ids:
                            recommendations.append((consequent, row['confidence']))

            # Sort by confidence and select top unique masterIds
            recommendations = sorted(recommendations, key=lambda x: x[1], reverse=True)
            unique_recommendations = []
            seen = set(master_ids)  # Exclude input masterIds
            for rec, _ in recommendations:
                if rec not in seen:
                    unique_recommendations.append(rec)
                    seen.add(rec)
                    if len(unique_recommendations) >= num_recommendations:
                        break

            # Fill with fallback recommendations if needed
            if len(unique_recommendations) < num_recommendations:
                logger.info(f"Found only {len(unique_recommendations)} rule-based recommendations; using fallback")
                fallback = self._get_fallback_recommendations(
                    num_recommendations - len(unique_recommendations),
                    master_ids + unique_recommendations
                )
                unique_recommendations.extend(fallback)

            # Ensure exactly num_recommendations
            unique_recommendations = unique_recommendations[:num_recommendations]
            if len(unique_recommendations) < num_recommendations:
                logger.warning(f"Could only generate {len(unique_recommendations)} recommendations")

            logger.info(f"Predicted {len(unique_recommendations)} recommendations for {master_ids}: {unique_recommendations}")
            return unique_recommendations

        except Exception as e:
            logger.error(f"Error during prediction: {e}")
            return self._get_fallback_recommendations(num_recommendations, master_ids)

    def _get_fallback_recommendations(self, num_recommendations, exclude_ids):
        """
        Return top frequent masterIds as fallback, excluding specified IDs.
        Args:
            num_recommendations: Number of recommendations needed.
            exclude_ids: List of masterIds to exclude.
        Returns:
            List of masterIds.
        """
        exclude_set = set(exclude_ids)
        candidates = self.all_items or []

        if self.frequent_items is not None and not self.frequent_items.empty:
            # Prioritize frequent items
            frequent = []
            for _, row in self.frequent_items.iterrows():
                for item in row['itemsets']:
                    if item not in exclude_set and item not in frequent:
                        frequent.append(item)
            candidates = frequent + [item for item in candidates if item not in frequent]

        # Select top items not in exclude_set
        result = [item for item in candidates if item not in exclude_set][:num_recommendations]
        
        if not result:
            logger.warning("No fallback recommendations available")
        return result