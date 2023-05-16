# API endpoint for User Connections (/connections namespace)

from flask_restx import Namespace, Resource, reqparse, fields
from flask_restx.inputs import email
from http import HTTPStatus
from core.helpers import create_connection, delete_connection_by_id, get_connections

connection_ns = Namespace(name="Connections",
                          description='User Connections',
                          validate=True)

# Define parameteres can be obtained from the API queries
# For add a new connection
connection_parser = reqparse.RequestParser(bundle_errors=True)
connection_parser.add_argument(name="owner_id", type=int,
                               location="json", required=True, nullable=False)
connection_parser.add_argument(name="member_id", type=int,
                               location="json", required=True, nullable=False)

# For retrieve a list of connections
list_connections_parser = reqparse.RequestParser(bundle_errors=True)
list_connections_parser.add_argument('page', type=int, default=1, location='args')
list_connections_parser.add_argument('size', type=int, default=10, location='args')

# Schema for List of Connections payload in response
connection_model = connection_ns.model('Connection',
                                   {'id': fields.Integer,
                                    'member_id': fields.Integer,
                                    'member': fields.String(attribute='member.fullname'),
                                    'member_photo_url': fields.String(attribute='member.photo_url')
                                    })

pagination_links_model = connection_ns.model('Navigation Links',
                                             {'self': fields.String,
                                              'prev': fields.String(skip_none=True),
                                              'next': fields.String(skip_none=True),
                                              'first': fields.String(skip_none=True),
                                              'last': fields.String(skip_none=True)
                                              })

reviews_response_model = connection_ns.model('List of Connections',
                                             {'page': fields.Integer,
                                              'total_pages': fields.Integer,
                                              'items_per_page': fields.Integer,
                                              'total_items': fields.Integer,
                                              'items': fields.List(fields.Nested(connection_model)),
                                              'has_prev': fields.Boolean,
                                              'has_next': fields.Boolean,
                                              'links': fields.Nested(pagination_links_model, skip_none=True)
                                              })
    

# Handle HTTP requests to URL: /api/v1/connections
@connection_ns.route('', endpoint='connections')    
class Connections(Resource):
    # Add a new Connection
    @connection_ns.expect(connection_parser, validate=True)
    @connection_ns.response(int(HTTPStatus.CREATED), 'Connection Created Successfully.')
    @connection_ns.response(int(HTTPStatus.BAD_REQUEST), 'Validation error.')
    @connection_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Internal server error.')
    @connection_ns.doc(description = 'Add a New Connection', security='Bearer')
    def post(self):
        args = connection_parser.parse_args()
        owner_id = args.get('owner_id')
        member_id = args.get('member_id')
        return create_connection(owner_id, member_id)
    
    
# Handle HTTP requests to URL: /api/v1/connections/{connection_id}
@connection_ns.route('/<int:id>', endpoint='connection_info')
@connection_ns.param('id', 'Connection ID')
class ConnectionInfo(Resource):
    # Remove a connection
    @connection_ns.response(int(HTTPStatus.OK), 'Success.')
    @connection_ns.response(int(HTTPStatus.NOT_FOUND), 'No connection available.')
    @connection_ns.response(int(HTTPStatus.BAD_REQUEST), 'Validation error.')
    @connection_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Internal server error.')
    @connection_ns.doc(description = 'Delete a Connection by ID', security='Bearer')
    def delete(self, id):
        return delete_connection_by_id(id)


# Handle HTTP requests to URL: /api/v1/connections/all/{user_id}
@connection_ns.route('/all/<int:id>',endpoint='list_connections')
@connection_ns.param('id', 'User ID') 
class ConnectionsList(Resource):
    # Retrieve all connections of an user
    @connection_ns.expect(list_connections_parser, validate=True)
    @connection_ns.marshal_with(reviews_response_model)
    @connection_ns.response(int(HTTPStatus.OK), 'Success.', reviews_response_model)
    @connection_ns.response(int(HTTPStatus.NOT_FOUND), 'No connections available.')
    @connection_ns.response(int(HTTPStatus.BAD_REQUEST), 'Validation error.')
    @connection_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Internal server error.')
    @connection_ns.doc(description = 'Retrieve all connections of an user', security='Bearer')
    def get(self, id):
        args = list_connections_parser.parse_args()
        input_page = args.get('page')
        input_size = args.get('size')
        return get_connections(id, input_page, input_size)