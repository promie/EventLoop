# Decorators that decode and verify JWT authorization tokens.

from http import HTTPStatus
from functools import wraps
from flask import request
from flask_restx import abort
from database import session
import database.db_models as db
from database.db_models import Users


def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Retrieve the token from request header
        token = request.headers.get("Authorization")
        
        # Check if token is available
        if not token:
            abort(HTTPStatus.UNAUTHORIZED, 'Authentication token not found.', status='Unauthorised')
        
        # Decode the token using method defined in Users model
        result = Users.decode_token(token)
        
        # Check if token is valid
        if isinstance(result, str):
            abort(HTTPStatus.UNAUTHORIZED, result, status='Unauthorised')
        
        # Check if token belongs to the current_user
        current_user = session.query(db.Users).filter_by(id=result['user_id']).first()
        if current_user is None:
            abort(HTTPStatus.UNAUTHORIZED, 'Invalid authentication token.', status='Unauthorised')
            
        for name, val in result.items():
            setattr(decorated, name, val)
        return f(*args, **kwargs)
    
    return decorated

