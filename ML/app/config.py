import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SPRING_API_URL = os.getenv('SPRING_API_URL')
    # SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key')  # For Flask sessions, if used