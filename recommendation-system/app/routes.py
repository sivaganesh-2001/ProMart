from flask import Blueprint, request, jsonify, render_template
from flask_cors import CORS
from .recommender import Recommender
import logging

main = Blueprint('main', __name__)
CORS(main)  # Enable CORS for this blueprint

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialize recommender
try:
    recommender = Recommender(
        model_path='app/models/ncf_model.h5',
        user_mapping_path='app/models/user_id_mapping.pkl',
        item_mapping_path='app/models/item_id_mapping.pkl'
    )
except Exception as e:
    logger.error(f"Failed to initialize Recommender: {str(e)}")
    raise

@main.route('/')
def index():
    return render_template('index.html')

@main.route('/recommend', methods=['POST'])
def recommend():
    try:
        data = request.get_json()
        email = data.get('email')
        
        if not email:
            logger.warning("No email provided in request")
            return jsonify({"error": "Email is required"}), 400
        
        # Recommend top 50 products
        result = recommender.recommend_top_n(email, n=50)
        if "error" in result:
            logger.warning(f"Recommendation failed for {email}: {result['error']}")
            return jsonify({"error": result["error"]}), 404
        
        logger.info(f"Recommendations generated for {email}: {result['recommendations']}")
        return jsonify({
            "status": "success",
            "email": result["email"],
            "recommendations": result["recommendations"]
        }), 200
    
    except Exception as e:
        logger.error(f"Internal server error in /recommend: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@main.route('/recommendations', methods=['GET'])
def show_recommendations():
    email = request.args.get('email')
    if not email:
        logger.warning("No email provided in GET request")
        return render_template('recommendations.html', error="Please provide an email")
    
    # Recommend top 50 products
    result = recommender.recommend_top_n(email, n=30)
    if "error" in result:
        logger.warning(f"Recommendation failed for {email}: {result['error']}")
        return render_template('recommendations.html', error=result["error"])
    
    logger.info(f"Rendering recommendations for {email}: {result['recommendations']}")
    return render_template('recommendations.html', email=email, recommendations=result["recommendations"])