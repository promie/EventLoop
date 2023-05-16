# API endpoint for Reviews and Ratings (/review namespace)

from flask_restx import Namespace, Resource, reqparse, fields
from flask_restx.inputs import email
from http import HTTPStatus
from core.helpers import create_review, get_reviews
from datetime import datetime

review_ns = Namespace(name="Reviews",
                      description='Event Reviews and Ratings',
                      validate=True)

# Define parameteres can be obtained from the API queries
# For add a new review
review_parser = reqparse.RequestParser(bundle_errors=True)
review_parser.add_argument(name="user_id", type=int,
                           location="json", required=True, nullable=False)
review_parser.add_argument(name="event_id", type=int,
                           location="json", required=True, nullable=False)
review_parser.add_argument(name="rating", type=int,
                           location="json", required=True, nullable=False)
review_parser.add_argument(name="comment", type=str,
                           location="json", required=True, nullable=False)

# For retrieve a list of reviews
reviews_fetch_parser = reqparse.RequestParser(bundle_errors=True)
reviews_fetch_parser.add_argument('page', type=int, default=1, location='args')
reviews_fetch_parser.add_argument('size', type=int, default=10, location='args')

# Schema for reviews payload in response
review_model = review_ns.model('Reviews',
                             {'id': fields.Integer,
                              'customer_id': fields.Integer,
                              'customer': fields.String(attribute='customer.fullname'),
                              'event_title': fields.String(attribute='event.title'),
                              'comment': fields.String,
                              'rating': fields.Integer,
                              'date_created': fields.DateTime,
                              'customer_photo_url': fields.String(attribute='customer.photo_url')
                              })

pagination_links_model = review_ns.model('Navigation Links',
                                        {'self': fields.String,
                                         'prev': fields.String(skip_none=True),
                                         'next': fields.String(skip_none=True),
                                         'first': fields.String(skip_none=True),
                                         'last': fields.String(skip_none=True)
                                         })

reviews_response_model = review_ns.model('Reviews Pagination',
                                     {'page': fields.Integer,
                                      'total_pages': fields.Integer,
                                      'items_per_page': fields.Integer,
                                      'total_items': fields.Integer,
                                      'items': fields.List(fields.Nested(review_model)),
                                      'has_prev': fields.Boolean,
                                      'has_next': fields.Boolean,
                                      'links': fields.Nested(pagination_links_model, skip_none=True)
                                      })


# Handle HTTP requests to URL: /api/v1/reviews
@review_ns.route('', endpoint='reviews')
class Reviews(Resource):
    # Create a Review
    @review_ns.expect(review_parser, validate=True)
    @review_ns.response(int(HTTPStatus.CREATED), 'User Review Created Successfully.')
    @review_ns.response(int(HTTPStatus.BAD_REQUEST), 'Validation error.')
    @review_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Internal server error.')
    @review_ns.doc(description = 'Add a New Review', security='Bearer')
    def post(self):
        args = review_parser.parse_args()
        user_id = args.get('user_id')
        event_id = args.get('event_id')
        rating = args.get('rating')
        comment = args.get('comment')
        return create_review(user_id, event_id, rating, comment)


# Handle HTTP requests to URL: /api/v1/reviews/{event_id}
@review_ns.route('/<int:id>', endpoint='review_info')
@review_ns.param('id', 'Event ID')
class ReviewsInfo(Resource):
    # Fetch all reviews for a particular event
    @review_ns.expect(reviews_fetch_parser, validate=True)
    @review_ns.marshal_with(reviews_response_model)
    @review_ns.response(int(HTTPStatus.OK), 'Success.', reviews_response_model)
    @review_ns.response(int(HTTPStatus.NOT_FOUND), 'No reviews available.')
    @review_ns.response(int(HTTPStatus.BAD_REQUEST), 'Validation error.')
    @review_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Internal server error.')
    @review_ns.doc(description = 'Fetch all reviews for an event id')
    def get(self,id):
        args = reviews_fetch_parser.parse_args()
        input_page = args.get('page')
        input_size = args.get('size')
        return get_reviews(id,input_page,input_size)