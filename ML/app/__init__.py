from flask import Flask
from app.routes.api import api
from app.recommendations.market_basket.mba_model import MBAModel
from app.recommendations.market_basket.data_service import fetch_transactions
from app.config import Config
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Register blueprints
    app.register_blueprint(api, url_prefix='/api')

    # Train MBA model on startup
    with app.app_context():
        logger.info("Initializing MBA model on startup")
        try:
            transactions = fetch_transactions(Config.SPRING_API_URL)
            mba_model = MBAModel()
            mba_model.train(transactions)
        except Exception as e:
            logger.error(f"Failed to train MBA model on startup: {e}")

    # Register other blueprints (e.g., collaborative filtering)
    # from app.recommendations.collaborative.routes import collaborative_bp
    # app.register_blueprint(collaborative_bp, url_prefix='/api')

    return app