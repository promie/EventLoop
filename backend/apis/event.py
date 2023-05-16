# API endpoint for Event (/event namespace)
from flask import request
from flask_restx import Namespace, Resource, reqparse, fields
from core.helpers import create_event,fetch_upcoming_events, search_events, patch_event_by_id, get_all_customers
from http import HTTPStatus
from core.helpers import get_event_by_id


event_ns = Namespace(name='Events',
                     description='Event Information',
                     validate=True)

# Schema for Events payload in response
ticket_model = event_ns.model('Ticket',
                              {'id': fields.Integer,
                               'event_id': fields.Integer,
                               'ticket_type': fields.String,
                               'total_number': fields.Integer,
                               'price': fields.Float
                               })

event_model = event_ns.model('Event',
                             {'id': fields.Integer,
                              'title': fields.String,
                              'description': fields.String,
                              'created_by': fields.Integer,
                              'owner_name': fields.String(attribute='owner.fullname'),
                              'category': fields.String(attribute='category.name'),
                              'location_add': fields.String,
                              'gps_coord': fields.String,
                              'photo_url': fields.String,
                              'start_datetime': fields.DateTime,
                              'end_datetime': fields.DateTime,
                              'tags': fields.String,
                              'age_limit': fields.Integer,
                              'status': fields.String(attribute='status.name'),
                              'tickets': fields.List(fields.Nested(ticket_model)),
                              'nb_of_ratings': fields.Integer(skip_none=True),
                              'average_rating': fields.Float(skip_none=True),
                              'rating_distribution': fields.Raw(skip_none=True),
                              })

list_events_model = event_ns.model('List of Events',
                                   {'events': fields.List(fields.Nested(event_model))
                                    })

# Schema for New Events payload in request
new_ticket_model = event_ns.model('New Ticket',
                                  {'ticket_type': fields.String,
                                   'total_number': fields.Integer,
                                   'price': fields.Float
                                   })

new_event_model = event_ns.model('New Event',
                                 {'title': fields.String,
                                  'description': fields.String,
                                  'created_by': fields.String,
                                  'category': fields.String,
                                  'location_add': fields.String,
                                  'gps_coord': fields.String,
                                  'photo_url': fields.String,
                                  'start_datetime': fields.DateTime,
                                  'end_datetime': fields.DateTime,
                                  'tags': fields.String,
                                  'age_limit': fields.Integer,
                                  'status': fields.String,
                                  'tickets': fields.List(fields.Nested(new_ticket_model))
                                  })


# Schema for search and filter Events payload in response
pagination_links_model = event_ns.model('Navigation Links',
                                        {'self': fields.String,
                                         'prev': fields.String(skip_none=True),
                                         'next': fields.String(skip_none=True),
                                         'first': fields.String(skip_none=True),
                                         'last': fields.String(skip_none=True)
                                         })


search_events_model = event_ns.model('Search Events',
                                     {'page': fields.Integer,
                                      'total_pages': fields.Integer,
                                      'items_per_page': fields.Integer,
                                      'total_items': fields.Integer,
                                      'items': fields.List(fields.Nested(event_model)),
                                      'has_prev': fields.Boolean,
                                      'has_next': fields.Boolean,
                                      'links': fields.Nested(pagination_links_model, skip_none=True)
                                      })


# Schema for paginated Customers payload in response
customers_model = event_ns.model('Customer',
                                {'booking_id': fields.Integer(attribute='id'),
                                 'date_created': fields.DateTime,
                                 'customer_id': fields.Integer,
                                 'customer': fields.String(attribute='customer.fullname'),
                                 'email': fields.String(attribute='customer.email'),
                                 'billing_add': fields.String(attribute='customer.billing_add'),                                 
                                 'photo_url': fields.String(attribute='customer.photo_url'),
                                 })

pagination_links_model = event_ns.model('Navigation Links',
                                        {'self': fields.String,
                                         'prev': fields.String(skip_none=True),
                                         'next': fields.String(skip_none=True),
                                         'first': fields.String(skip_none=True),
                                         'last': fields.String(skip_none=True)
                                         })

paginated_customers_model = event_ns.model('Paginated Customers',
                                           {'page': fields.Integer,
                                            'total_pages': fields.Integer,
                                            'items_per_page': fields.Integer,
                                            'total_items': fields.Integer,
                                            'items': fields.List(fields.Nested(customers_model)),
                                            'has_prev': fields.Boolean,
                                            'has_next': fields.Boolean,
                                            'links': fields.Nested(pagination_links_model, skip_none=True)
                                            })

# Define parameteres can be obtained from the API queries
# For retrieve a list of events
list_events_parser = reqparse.RequestParser(bundle_errors=True)
list_events_parser.add_argument('page', type = int, default = 1, location='args')
list_events_parser.add_argument('size', type = int, default = 10, location='args')
list_events_parser.add_argument('order', action = 'split', location='args', default = ['+start_datetime'])
list_events_parser.add_argument('title', type = str, location='args')
list_events_parser.add_argument('category', type = str, location='args')
list_events_parser.add_argument('location', type = str, location='args')
list_events_parser.add_argument('status', type = str, location='args')
list_events_parser.add_argument('start_date', type = str, location='args')

# For update details of an event
update_event_reqparser = reqparse.RequestParser(bundle_errors=True)
update_event_reqparser.add_argument(name="start_datetime", type=str,location="json")
update_event_reqparser.add_argument(name="end_datetime", type=str,location="json")
update_event_reqparser.add_argument(name="location_add", type=str,location="json")
update_event_reqparser.add_argument(name="gps_coord", type=str,location="json")
update_event_reqparser.add_argument(name="tags", type=str,location="json")
update_event_reqparser.add_argument(name="status", type=str,location="json")

# For retrieve a list of customers
customers_parser = reqparse.RequestParser(bundle_errors=True)
customers_parser.add_argument('page', type=int, default=1, location='args')
customers_parser.add_argument('size', type=int, default=10, location='args')


# Handle HTTP requests to URL: /api/v1/events
@event_ns.route('', endpoint='events')
class Events(Resource):
    # Create an Event
    @event_ns.expect(new_event_model, validate=True)
    @event_ns.response(int(HTTPStatus.CREATED), 'New event created successfully.')
    @event_ns.response(int(HTTPStatus.BAD_REQUEST), 'Validation error.')
    @event_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Internal server error.')
    @event_ns.doc(description = 'Add a New Event', security='Bearer')
    def post(self):
        actor = request.json
        title = actor['title']
        description = actor['description']
        created_by = actor['created_by']
        category = actor['category']
        location_add = actor['location_add']
        gps_coord = actor['gps_coord']
        photo_url = actor['photo_url']
        start_datetime =  actor['start_datetime']
        end_datetime = actor['end_datetime']
        tags = actor['tags']
        age_limit = actor['age_limit']
        status = actor['status']
        tickets = actor['tickets']
        return create_event(title,description,created_by,category,location_add,gps_coord,photo_url,start_datetime,end_datetime,tags,age_limit,status,tickets)

    # Retrieve a list of events. Search and filter events with pagination
    '''
    Sameple query:
        /events?page=1 & size=10  & order=-start_datetime  & title='' & category='' & location='' & status='' & start_date=''
    '''
    @event_ns.expect(list_events_parser, validate = True)
    @event_ns.marshal_with(search_events_model)
    @event_ns.response(int(HTTPStatus.OK), 'Success.', search_events_model)
    @event_ns.response(int(HTTPStatus.NOT_FOUND), 'No event available.')
    @event_ns.response(int(HTTPStatus.BAD_REQUEST), 'Validation error.')
    @event_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Internal server error.')
    @event_ns.doc(description = 'Retrieve a List of Events. Search and Filter Events with Pagination',
                  params = {'page': 'Page number to display',\
                           'size': 'Number of events on a page',\
                           'order': 'Criteria to sort the list of events\n(Criteria: title, start_datetime)\n(Prefix: + for ascending order, - for descending order)',\
                           'title': 'Title of events',\
                           'category': 'Category of events',\
                           'location': 'Location of events',\
                           'status': 'Status of events',\
                           'start_date': 'Start date of events'})
    def get(self):
        # Retrieving the query parameters
        args = list_events_parser.parse_args()
        input_page = args.get('page')
        input_size = args.get('size')
        input_order = args.get('order')
        input_title = args.get('title')
        input_category = args.get('category')
        input_location = args.get('location')
        input_status = args.get('status')
        input_start_date = args.get('start_date')

        return search_events(input_page, input_size, input_order, input_title, input_category,
                             input_location, input_status, input_start_date)


# Handle HTTP requests to URL: /api/v1/events/upcoming
@event_ns.route('/upcoming', endpoint='upcoming_events')
class UpcomingEvents(Resource):

    # Retrive a list of 10 most recent events
    @event_ns.marshal_with(list_events_model)
    @event_ns.response(int(HTTPStatus.OK), 'Success.', list_events_model)
    @event_ns.response(int(HTTPStatus.NOT_FOUND), 'No event available.')
    @event_ns.response(int(HTTPStatus.BAD_REQUEST), 'Validation error.')
    @event_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Internal server error.')
    @event_ns.doc(description = 'Retrieve 10 Upcoming Events')
    def get(self):
        return {'events': fetch_upcoming_events()}

# Handle HTTP requests to URL: /api/v1/events/customers/{event_id}
@event_ns.route('/customers/<int:id>', endpoint='event_customers')
@event_ns.param('id', 'Event ID')
class EventCustomers(Resource):

    # Retrieve a list of customers who purchased tickets to the event
    @event_ns.expect(customers_parser, validate = True)
    @event_ns.marshal_with(paginated_customers_model)
    @event_ns.response(int(HTTPStatus.OK), 'Success.', paginated_customers_model)
    @event_ns.response(int(HTTPStatus.NOT_FOUND), 'Event Not Found.')
    @event_ns.response(int(HTTPStatus.BAD_REQUEST), 'Validation error.')
    @event_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Internal server error.')
    @event_ns.doc(description = 'Retrieve List of Bookings', security='Bearer',
                 params = {'page': 'Page number to display',
                           'size': 'Number of events on a page'})
    def get(self, id):
        args = customers_parser.parse_args()
        input_page = args.get('page')
        input_size = args.get('size')
        return get_all_customers(id, input_page, input_size)


# Handle HTTP requests to URL: /api/v1/events/{event_id}
@event_ns.route('/<int:id>', endpoint='events_info')
@event_ns.param('id', 'Event ID')
class EventInfo(Resource):

    # Retrieve details of an Event
    @event_ns.marshal_with(event_model)
    @event_ns.response(int(HTTPStatus.OK), 'Success.', event_model)
    @event_ns.response(int(HTTPStatus.NOT_FOUND), 'No event available.')
    @event_ns.response(int(HTTPStatus.BAD_REQUEST), 'Validation error.')
    @event_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Internal server error.')
    @event_ns.doc(description = 'Retrieve an Event by ID')
    def get(self, id):
        return get_event_by_id(id)

    # Update details of an Event
    @event_ns.expect(update_event_reqparser)
    @event_ns.response(int(HTTPStatus.OK), 'Success.')
    @event_ns.response(int(HTTPStatus.NOT_FOUND), 'No event available.')
    @event_ns.response(int(HTTPStatus.BAD_REQUEST), 'Validation error.')
    @event_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Internal server error.')
    @event_ns.doc(description = 'Update an Event by ID', security='Bearer')
    def patch(self, id):
        args = update_event_reqparser.parse_args()
        location_add = args.get('location_add')
        gps_coord = args.get('gps_coord')
        start_datetime =  args.get('start_datetime')
        end_datetime = args.get('end_datetime')
        tags = args.get('tags')
        status = args.get('status')
        return patch_event_by_id(id,location_add=location_add,gps_coord=gps_coord,start_datetime=start_datetime,end_datetime=end_datetime,tags=tags,status=status)
