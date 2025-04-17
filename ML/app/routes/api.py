from flask import Blueprint, request, jsonify
from app.recommendations.market_basket.mba_model import MBAModel
from app.recommendations.market_basket.data_service import fetch_transactions
from app.config import Config
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

api = Blueprint('api', __name__)
mba_model = MBAModel()

@api.route('/mba/train', methods=['GET'])
def train_mba():
    """
    Trigger MBA model training.
    """
    try:
        transactions = fetch_transactions(Config.SPRING_API_URL)
        mba_model.train(transactions)
        return jsonify({"message": "MBA model trained successfully"})
    except Exception as e:
        logger.error(f"Error training MBA model: {e}")
        return jsonify({"error": "Failed to train MBA model"}), 500

@api.route('/mba/predict', methods=['POST'])
def predict_mba():
    """
    Predict MBA recommendations.
    Expects JSON: {"masterIds": ["master1", "master2"]}
    Returns exactly 5 recommendations.
    """
    try:
        data = request.get_json()
        if not data or 'masterIds' not in data:
            return jsonify({"error": "Missing masterIds in request"}), 400
        
        master_ids = data['masterIds']
        if not isinstance(master_ids, list) or not master_ids:
            return jsonify({"error": "masterIds must be a non-empty list"}), 400
        
        recommendations = mba_model.predict(master_ids, num_recommendations=20)
        if len(recommendations) < 5:
            logger.warning(f"Only {len(recommendations)} recommendations returned for {master_ids}")
        return jsonify({"recommendations": recommendations})
    except Exception as e:
        logger.error(f"Error predicting MBA recommendations: {e}")
        return jsonify({"error": "Failed to predict recommendations"}), 500

# Add your existing collaborative filtering routes here, e.g.:
# @api.route('/collaborative/recommend', methods=['POST'])
# def collaborative_recommend():
#     ...