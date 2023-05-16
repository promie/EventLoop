# Configuration settings for development, testing and production

import os
from pathlib import Path

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "my_precious_key")
    BCRYPT_LOG_ROUNDS = 5
    TOKEN_EXPIRE_HOURS = 0
    TOKEN_EXPIRE_MINUTES = 0
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    PRESERVE_CONTEXT_ON_EXCEPTION = False
    SWAGGER_UI_DOC_EXPANSION = "list"
    RESTX_MASK_SWAGGER = False
    JSON_SORT_KEYS = False
    
    # Email Config
    MAIL_SERVER = 'smtp.sendgrid.net'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = 'apikey'
    MAIL_PASSWORD = os.getenv('SENDGRID_API_KEY', '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')
    MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER', 'noreply.eventloop22@gmail.com')
    # Email Password = eventloopUNSW22
    

# Settings for testing
class DevelopmentConfig(Config):
    TOKEN_EXPIRE_HOURS = 1
    

# Settings for testing
class TestingConfig(Config):
    TOKEN_EXPIRE_MINUTES = 1
    TESTING = True
    
    
# Settings for production  
class ProductionConfig(Config):
    TOKEN_EXPIRE_HOURS = 1
    BCRYPT_LOG_ROUNDS = 11
    PRESERVE_CONTEXT_ON_EXCEPTION = True
    

ENV_CONFIG_DICT = dict(development=DevelopmentConfig,
                       testing=TestingConfig,
                       production=ProductionConfig)


# Function to retrieve the environment configuration settings
def get_config(config_name):
    return ENV_CONFIG_DICT.get(config_name, ProductionConfig)