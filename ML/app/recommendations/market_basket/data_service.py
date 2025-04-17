import requests
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def fetch_transactions(spring_api_url):
    """
    Fetch MBA transactions from Spring API.
    Returns: List of transactions (each a list of masterIds).
    """
    try:
        url = f"{spring_api_url}/transactions"
        logger.info(f"Fetching transactions from {url}")
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        transactions = response.json()
        
        # Validate data
        if not isinstance(transactions, list):
            logger.error("Invalid transactions format: not a list")
            return []
        for trans in transactions:
            if not isinstance(trans, list) or not all(isinstance(item, str) for item in trans):
                logger.warning(f"Invalid transaction format: {trans}")
                return []
        
        logger.info(f"Fetched {len(transactions)} transactions")
        return transactions
    except requests.RequestException as e:
        logger.error(f"Error fetching transactions: {e}")
        return []