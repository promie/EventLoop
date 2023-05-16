# API endpoint for Reviews and Ratings (/review namespace)

from flask_restx import Namespace, Resource, reqparse, fields
from flask_restx.inputs import email
from http import HTTPStatus
from core.helpers import get_user_notifications, update_notification_by_id
from datetime import datetime

notification_ns = Namespace(name="Notifications",
                            description='Notifications for Users',
                            validate=True)

# Schema for list of Notifications payload in response
event_notifications_model = notification_ns.model('Event Notifications',
                                                  {'id': fields.Integer,
                                                   'event_id': fields.Integer,
                                                   'title': fields.String(attribute='event.title'),
                                                   'description': fields.String,
                                                   'date_created': fields.DateTime,
                                                   'is_read': fields.Boolean
                                                   })

connection_notifications_model = notification_ns.model('Connection Notifications',
                                                       {'id': fields.Integer,
                                                        'event_id': fields.Integer,
                                                        'title': fields.String(attribute='event.title'),
                                                        'matched_user_id': fields.Integer,
                                                        'matched_user': fields.String(attribute='matched_user.fullname'),
                                                        'date_created': fields.DateTime,
                                                        'is_read': fields.Boolean
                                                        })

list_notifications_model = notification_ns.model('List of Notifications',
                                                 {'events': fields.List(fields.Nested(event_notifications_model)),
                                                  'connections': fields.List(fields.Nested(connection_notifications_model))
                                                  })

# Define parameteres can be obtained from the API queries
# For update notification tag
update_notification_reqparser = reqparse.RequestParser(bundle_errors=True)
update_notification_reqparser.add_argument(name="type", type=str, choices = ['events', 'connections'],
                                           required=True, location="json")
update_notification_reqparser.add_argument(name="is_read", type=bool,
                                           required=True, location="json")


# Handle HTTP requests to URL: /api/v1/notifications/user/{user_id}
@notification_ns.route('/user/<int:id>', endpoint='notifications')
@notification_ns.param('id', 'User ID')
class NotificationsList(Resource):
    # Retrieve a list of notifications for the last 10 days
    @notification_ns.marshal_with(list_notifications_model, skip_none=True)
    @notification_ns.response(int(HTTPStatus.OK), 'Success.', list_notifications_model)
    @notification_ns.response(int(HTTPStatus.NOT_FOUND), 'User Not Found.')
    @notification_ns.response(int(HTTPStatus.BAD_REQUEST), 'Validation error.')
    @notification_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Internal server error.')
    @notification_ns.doc(description = 'Retrieve All Notifications', security='Bearer')
    def get(self, id):
        events, connections = get_user_notifications(id)
        return {'events': events,
                'connections': connections}
    

# Handle HTTP requests to URL: /api/v1/notifications/{notification_id}
@notification_ns.route('/<int:id>', endpoint='update_notifications')
@notification_ns.param('id', 'Notification ID')
class NotificationsInfo(Resource):
    # Update status of a notification
    @notification_ns.expect(update_notification_reqparser, validate=True)
    @notification_ns.response(int(HTTPStatus.OK), 'Success.')
    @notification_ns.response(int(HTTPStatus.NOT_FOUND), 'No Notification Available.')
    @notification_ns.response(int(HTTPStatus.BAD_REQUEST), 'Validation error.')
    @notification_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Internal server error.')
    @notification_ns.doc(description = 'Update a Notification by ID', security='Bearer')
    def patch(self, id):
        args = update_notification_reqparser.parse_args()
        input_type = args.get('type')
        input_tag = args.get('is_read')
        return update_notification_by_id(id, input_type, input_tag)
    
