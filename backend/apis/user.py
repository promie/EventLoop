# API endpoint for User (/user namespace)

from flask import request
from flask_restx import Namespace, Resource, reqparse, fields
from flask_restx.inputs import email
from http import HTTPStatus
from core.helpers import get_user_by_id, update_user_by_id, user_purchased_events
from core.helpers import user_created_events, user_reviews, get_connection_profile

user_ns = Namespace(name="Users",
                    description='User Information',
                    validate=True)

# Schema for Users payload in response
user_model = user_ns.model('User',
                           {'first_name': fields.String,
                            'last_name': fields.String,
                            'email': fields.String,
                            'birthday': fields.String,
                            'gender': fields.String,
                            'billing_add': fields.String,
                            'billing_gps_coord': fields.String,
                            'home_add': fields.String,
                            'home_gps_coord': fields.String,
                            'phone': fields.String,
                            'website_url': fields.String,
                            'photo_url': fields.String,
                            'about_me': fields.String,
                            'interests': fields.String,
                            'matching_option': fields.Boolean
                            })

# Schema for Connection Profile payload in response
connection_profile_model = user_ns.model('Connection Profile',
                                         {'id': fields.Integer,
                                          'first_name': fields.String,
                                          'last_name': fields.String,
                                          'email': fields.String,
                                          'website_url': fields.String,
                                          'photo_url': fields.String,
                                          'about_me': fields.String,
                                          'interests': fields.String,
                                          'is_connected': fields.Boolean
                                          })

# Schema for paginated Created Events payload in response
created_events_model = user_ns.model('Created Event',
                                     {'id': fields.Integer,
                                      'title': fields.String,
                                      'created_by': fields.String(attribute='owner.fullname'),
                                      'photo_url': fields.String,
                                      'start_datetime': fields.DateTime,
                                      'end_datetime': fields.DateTime,
                                      'status': fields.String(attribute='status.name'),
                                      'sold_tickets': fields.Integer(attribute='sold_tickets'),
                                      'total_tickets': fields.Integer(attribute='total_tickets')
                                      })

pagination_links_model = user_ns.model('Navigation Links',
                                        {'self': fields.String,
                                         'prev': fields.String(skip_none=True),
                                         'next': fields.String(skip_none=True),
                                         'first': fields.String(skip_none=True),
                                         'last': fields.String(skip_none=True)
                                         })

paginated_created_events_model = user_ns.model('User Created Events',
                                               {'page': fields.Integer,
                                                'total_pages': fields.Integer,
                                                'items_per_page': fields.Integer,
                                                'total_items': fields.Integer,
                                                'items': fields.List(fields.Nested(created_events_model)),
                                                'has_prev': fields.Boolean,
                                                'has_next': fields.Boolean,
                                                'links': fields.Nested(pagination_links_model, skip_none=True)
                                                })

# Schema for paginated Bookings payload in response
purchased_events_model = user_ns.model('Purchased Event',
                                       {'id': fields.Integer,
                                        'event_id': fields.Integer,
                                        'title': fields.String(attribute='event.title'),
                                        'created_by': fields.String(attribute='event.owner.fullname'),
                                        'photo_url': fields.String(attribute='event.photo_url'),
                                        'start_datetime': fields.DateTime(attribute='event.start_datetime'),
                                        'end_datetime': fields.DateTime(attribute='event.end_datetime'),
                                        'status': fields.String(attribute='event.status.name')
                                        })

paginated_purchased_events_model = user_ns.model('User Purchased Events',
                                                 {'page': fields.Integer,
                                                  'total_pages': fields.Integer,
                                                  'items_per_page': fields.Integer,
                                                  'total_items': fields.Integer,
                                                  'items': fields.List(fields.Nested(purchased_events_model)),
                                                  'has_prev': fields.Boolean,
                                                  'has_next': fields.Boolean,
                                                  'links': fields.Nested(pagination_links_model, skip_none=True)
                                                  })

# Schema for paginated Reviews payload in response
user_reviews_model = user_ns.model('User Review',
                                       {'id': fields.Integer,
                                        'rating': fields.Integer,
                                        'comment': fields.String,
                                        'date_created': fields.DateTime,
                                        'event_id': fields.Integer,
                                        'title': fields.String(attribute='event.title'),
                                        'created_by': fields.String(attribute='event.owner.fullname'),
                                        'photo_url': fields.String(attribute='event.photo_url'),
                                        'start_datetime': fields.DateTime(attribute='event.start_datetime'),
                                        'end_datetime': fields.DateTime(attribute='event.end_datetime'),
                                        'status': fields.String(attribute='event.status.name')
                                        })

paginated_user_reviews_model = user_ns.model('Paginated User Reviews',
                                                 {'page': fields.Integer,
                                                  'total_pages': fields.Integer,
                                                  'items_per_page': fields.Integer,
                                                  'total_items': fields.Integer,
                                                  'items': fields.List(fields.Nested(user_reviews_model)),
                                                  'has_prev': fields.Boolean,
                                                  'has_next': fields.Boolean,
                                                  'links': fields.Nested(pagination_links_model, skip_none=True)
                                                  })

# Define parameteres can be obtained from the API queries
# For update details of an user
user_expect_reqparser = reqparse.RequestParser(bundle_errors=True)
user_expect_reqparser.add_argument(name="gender", type=str, location="json")
user_expect_reqparser.add_argument(name="billing_add", type=str, location="json")
user_expect_reqparser.add_argument(name="billing_gps_coord", type=str, location="json")
user_expect_reqparser.add_argument(name="home_add", type=str, location="json")
user_expect_reqparser.add_argument(name="home_gps_coord", type=str, location="json")
user_expect_reqparser.add_argument(name="home_gps_coord", type=str, location="json")
user_expect_reqparser.add_argument(name="phone", type=str, location="json")
user_expect_reqparser.add_argument(name="website_url", type=str, location="json")
user_expect_reqparser.add_argument(name="photo_url", type=str, location="json")
user_expect_reqparser.add_argument(name="about_me", type=str, location="json")
user_expect_reqparser.add_argument(name="interests", type=str, location="json")
user_expect_reqparser.add_argument(name="matching_option", type=bool, location="json")

# For retrieve a paginated list of events created by the user
user_created_events_parser = reqparse.RequestParser(bundle_errors=True)
user_created_events_parser.add_argument('page', type=int, default=1, location='args')
user_created_events_parser.add_argument('size', type=int, default=10, location='args')
user_created_events_parser.add_argument('status', type=str, action = 'split', location='args', default=['Ticket Available'])

# For retrieve a paginated list of events which the user purchased tickets from
user_bookings_parser = user_created_events_parser.copy()

# For retrieve a paginated list of reviews made by the user
user_reviews_parser = reqparse.RequestParser(bundle_errors=True)
user_reviews_parser.add_argument('page', type=int, default=1, location='args')
user_reviews_parser.add_argument('size', type=int, default=10, location='args')

# For retrieve details of connection profile
connection_profile_parser = reqparse.RequestParser(bundle_errors=True)
connection_profile_parser.add_argument('owner_id', type=int, location='args')


# Handle HTTP requests to URL: /api/v1/users/{user_id}
@user_ns.route('/<int:id>',endpoint='profile')
@user_ns.param('id', 'User ID')
class User(Resource):
    # Retreive User Details for profile page
    @user_ns.marshal_with(user_model)
    @user_ns.response(int(HTTPStatus.OK), 'Success.', user_model)
    @user_ns.response(int(HTTPStatus.NOT_FOUND), 'User Not Found.')
    @user_ns.response(int(HTTPStatus.BAD_REQUEST), 'Validation error.')
    @user_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Internal server error.')
    @user_ns.doc(description = 'Retrieve User Information for Profile Page', security='Bearer')
    def get(self, id):
        return get_user_by_id(id)

    # Update details of an Event
    @user_ns.expect(user_expect_reqparser, validate = True)
    @user_ns.marshal_with(user_model)
    @user_ns.response(int(HTTPStatus.OK), 'Success.')
    @user_ns.response(int(HTTPStatus.NOT_FOUND), 'User Not Found.')
    @user_ns.response(int(HTTPStatus.BAD_REQUEST), 'Validation error.')
    @user_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Internal server error.')
    @user_ns.doc(description = 'Update User Profile Details in DB', security='Bearer')
    def patch(self,id):
        args = user_expect_reqparser.parse_args()
        gender = args.get('gender')
        billing_add = args.get('billing_add')
        billing_gps_coord = args.get('billing_gps_coord')
        home_add = args.get('home_add')
        home_gps_coord = args.get('home_gps_coord')
        phone = args.get('phone')
        website_url = args.get('website_url')
        photo_url = args.get('photo_url')
        about_me = args.get('about_me')
        interests = args.get('interests')
        matching_option = args.get('matching_option')
        return update_user_by_id(id,gender,billing_add,billing_gps_coord,home_add,home_gps_coord,phone,website_url,photo_url,about_me,interests,matching_option)


# Handle HTTP requests to URL: /api/v1/users/created_events/{user_id}
@user_ns.route('/created_events/<int:id>', endpoint='manage_events')
@user_ns.param('id', 'User ID')
class UserCreatedEvents(Resource):
    @user_ns.expect(user_created_events_parser, validate = True)
    @user_ns.marshal_with(paginated_created_events_model)
    @user_ns.response(int(HTTPStatus.OK), 'Success.', paginated_created_events_model)
    @user_ns.response(int(HTTPStatus.NOT_FOUND), 'User Not Found.')
    @user_ns.response(int(HTTPStatus.BAD_REQUEST), 'Validation error.')
    @user_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Internal server error.')
    @user_ns.doc(description = 'Retrieve List of Events for Host Manage Events Page', security='Bearer',
                 params = {'page': 'Page number to display',
                           'size': 'Number of events on a page',
                           'status': 'Status of events'})
    # Fetch basic information of all events created by the user
    def get(self,id):
        args = user_created_events_parser.parse_args()
        input_page = args.get('page')
        input_size = args.get('size')
        input_status = args.get('status')
        return user_created_events(id,input_page,input_size,input_status)


# Handle HTTP requests to URL: /api/v1/bookings/{user_id}
@user_ns.route('/bookings/<int:id>', endpoint='manage_bookings')
@user_ns.param('id', 'User ID')
class UserBookings(Resource):
    # Retrieve all bookings purchased by the user
    @user_ns.expect(user_bookings_parser, validate = True)
    @user_ns.marshal_with(paginated_purchased_events_model)
    @user_ns.response(int(HTTPStatus.OK), 'Success.', paginated_purchased_events_model)
    @user_ns.response(int(HTTPStatus.NOT_FOUND), 'User Not Found.')
    @user_ns.response(int(HTTPStatus.BAD_REQUEST), 'Validation error.')
    @user_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Internal server error.')
    @user_ns.doc(description = 'Retrieve List of Bookings', security='Bearer',
                 params = {'page': 'Page number to display',
                           'size': 'Number of events on a page',
                           'status': 'Status of events'})
    def get(self,id):
        args = user_bookings_parser.parse_args()
        input_page = args.get('page')
        input_size = args.get('size')
        input_status = args.get('status')
        return user_purchased_events(id,input_page,input_size,input_status)
    

# Handle HTTP requests to URL: /api/v1/reviews/{user_id}    
@user_ns.route('/reviews/<int:id>', endpoint='manage_reviews')
@user_ns.param('id', 'User ID')
class UserReviews(Resource):
    # Retrieve all reviews made by the user
    @user_ns.expect(user_reviews_parser, validate = True)
    @user_ns.marshal_with(paginated_user_reviews_model)
    @user_ns.response(int(HTTPStatus.OK), 'Success.', paginated_user_reviews_model)
    @user_ns.response(int(HTTPStatus.NOT_FOUND), 'User Not Found.')
    @user_ns.response(int(HTTPStatus.BAD_REQUEST), 'Validation error.')
    @user_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Internal server error.')
    @user_ns.doc(description = 'Retrieve List of Reviews', security='Bearer',
                 params = {'page': 'Page number to display',
                           'size': 'Number of events on a page'})
    def get(self,id):
        args = user_reviews_parser.parse_args()
        input_page = args.get('page')
        input_size = args.get('size')
        return user_reviews(id, input_page, input_size)
    

# Handle HTTP requests to URL: /api/v1/users/profile/{user_id}
@user_ns.route('/profile/<int:id>',endpoint='connection_profile')
@user_ns.param('id', 'User ID')    
class UserProfile(Resource):
    # Retreive User Details for connection profile page
    @user_ns.expect(connection_profile_parser, validate = True)
    @user_ns.marshal_with(connection_profile_model)
    @user_ns.response(int(HTTPStatus.OK), 'Success.', connection_profile_model)
    @user_ns.response(int(HTTPStatus.NOT_FOUND), 'User Not Found.')
    @user_ns.response(int(HTTPStatus.BAD_REQUEST), 'Validation error.')
    @user_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Internal server error.')
    @user_ns.doc(description = 'Retrieve User Information for Connection Profile Page')#, security='Bearer')
    def get(self, id):
        args = connection_profile_parser.parse_args()
        input_owner_id = args.get('owner_id')
        return get_connection_profile(id, input_owner_id)
