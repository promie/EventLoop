# Package to include all API entry points

from flask import Blueprint
from flask_restx import Api

from .auth import auth_ns
from .user import user_ns
from .event import event_ns
from .uploadS3 import uploadS3_ns
from .booking import booking_ns
from .review import review_ns
from .notification import notification_ns
from .recommend import recommend_ns
from .connection import connection_ns
from .statistic import stat_ns


api_bp = Blueprint('api', __name__, url_prefix='/api/v1')
authorizations = {'Bearer': {'type': 'apiKey', 'in': 'header', 'name': 'Authorization'}}

api = Api(api_bp,
          title='API for EventLoop App',
          version='1.0',
          description='Swagger UI documentation for EventLoop Backend',
          doc='/ui',
          authorizations=authorizations
          )

api.add_namespace(auth_ns, path='/auth')
api.add_namespace(user_ns, path='/users')
api.add_namespace(event_ns, path='/events')
api.add_namespace(booking_ns, path='/bookings')
api.add_namespace(review_ns, path='/reviews')
api.add_namespace(notification_ns, path='/notifications')
api.add_namespace(recommend_ns, path='/recommendations')
api.add_namespace(uploadS3_ns, path='/s3')
api.add_namespace(connection_ns, path='/connections')
api.add_namespace(stat_ns, path='/statistics')

