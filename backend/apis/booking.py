# API endpoint for Bookings (/bookings namespace)
from flask import request
from flask_restx import Namespace, Resource, reqparse, fields
from flask_restx.inputs import email
from http import HTTPStatus
from core.helpers import create_booking, get_booking_by_id, delete_booking_by_id


booking_ns = Namespace(name="Bookings",
                       description='Booking Information',
                       validate=True)

# Schema for New Booking payload in request
new_ticket_model = booking_ns.model('New Ticket',
                                  {'ticket_type': fields.String,
                                   'quantity': fields.Integer,
                                   })

new_booking_model = booking_ns.model('New Booking',
                                     {'customer_id': fields.Integer,
                                      'event_id': fields.Integer,
                                      'transaction_id': fields.String,
                                      'booking_details': fields.List(fields.Nested(new_ticket_model))
                                      })

# Schema for Booking payload in response
ticket_model = booking_ns.model('Ticket',
                                {'booking_id': fields.Integer,
                                 'ticket_type': fields.String(attribute='ticket_type.ticket_type'),
                                 'price': fields.Float(attribute='ticket_type.price'),
                                 'quantity': fields.Integer
                                 })

booking_model = booking_ns.model('Booking',
                                 {'id': fields.Integer,
                                  'customer_id': fields.Integer,
                                  'customer': fields.String(attribute='customer.fullname'),
                                  'email': fields.String(attribute='customer.email'),
                                  'billing_add': fields.String(attribute='customer.billing_add'),
                                  'event_id': fields.Integer,
                                  'title': fields.String(attribute='event.title'),
                                  'organiser_id': fields.Integer(attribute='event.created_by'),
                                  'organiser': fields.String(attribute='event.owner.fullname'),
                                  'transaction_id': fields.String,
                                  'date_created': fields.DateTime,
                                  'booking_details': fields.List(fields.Nested(ticket_model))
                                  })

# Handle HTTP requests to URL: /api/v1/bookings
@booking_ns.route('', endpoint='bookings')
class Bookings(Resource):
    # Add a new booking
    @booking_ns.expect(new_booking_model, validate=True)
    @booking_ns.response(int(HTTPStatus.CREATED), 'New booking created successfully.')
    @booking_ns.response(int(HTTPStatus.BAD_REQUEST), 'Validation error.')
    @booking_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Internal server error.')
    @booking_ns.doc(description = 'Add a New Booking', security='Bearer')
    def post(self):
        booking = request.json
        customer_id = booking['customer_id']
        event_id = booking['event_id']
        transaction_id = booking['transaction_id']
        tickets = booking['booking_details']
        return create_booking(customer_id, event_id, transaction_id, tickets)


# Handle HTTP requests to URL: /api/v1/bookings/{booking_id}
@booking_ns.route('/<int:id>', endpoint='bookings_info')
@booking_ns.param('id', 'Booking ID')
class BookingInfo(Resource):
    # Retrieve details of a booking
    @booking_ns.marshal_with(booking_model)
    @booking_ns.response(int(HTTPStatus.OK), 'Success.', booking_model)
    @booking_ns.response(int(HTTPStatus.NOT_FOUND), 'No booking available.')
    @booking_ns.response(int(HTTPStatus.BAD_REQUEST), 'Validation error.')
    @booking_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Internal server error.')
    @booking_ns.doc(description = 'Retrieve a Booking by ID', security='Bearer')
    def get(self, id):
        return get_booking_by_id(id)
    
    # Cancel a booking
    @booking_ns.response(int(HTTPStatus.OK), 'Success.')
    @booking_ns.response(int(HTTPStatus.NOT_FOUND), 'No booking available.')
    @booking_ns.response(int(HTTPStatus.BAD_REQUEST), 'Validation error.')
    @booking_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Internal server error.')
    @booking_ns.doc(description = 'Delete a Booking by ID', security='Bearer')
    def delete(self, id):
        return delete_booking_by_id(id)

