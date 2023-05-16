# API endpoint for Event Statistics (/statistics namespace)

from flask_restx import Namespace, Resource, reqparse, fields
from flask_restx.inputs import email
from http import HTTPStatus
from core.helpers import get_statistics

stat_ns = Namespace(name="Statistics",
                    description='Statistics of Created Events',
                    validate=True)

# Schema for list of Notifications payload in response
event_sales_model = stat_ns.model('Event Sales',
                                  {'id': fields.Integer,
                                   'title': fields.String,
                                   'start_datetime': fields.DateTime,
                                   'sold_tickets': fields.Integer,
                                   'total_tickets': fields.Integer
                                   })


statistics_model = stat_ns.model('Statistics Summary',
                                 {'sales': fields.List(fields.Nested(event_sales_model)),
                                  'monthly_income': fields.Raw,
                                  'age_groups': fields.Raw
                                  })


# Handle HTTP requests to URL: /api/v1/statistics/{user_id}
@stat_ns.route('/<int:id>', endpoint='statistics')
@stat_ns.param('id', 'User ID')
class EventStat(Resource):
    
    # Retrive a list of 10 most recent events
    @stat_ns.marshal_with(statistics_model)
    @stat_ns.response(int(HTTPStatus.OK), 'Success.', statistics_model)
    @stat_ns.response(int(HTTPStatus.NOT_FOUND), 'No user available.')
    @stat_ns.response(int(HTTPStatus.BAD_REQUEST), 'Validation error.')
    @stat_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Internal server error.')
    @stat_ns.doc(description = 'Retrieve statistics summary', security='Bearer')
    def get(self, id):
        sales_info, income_info, age_groups_info = get_statistics(id)
        return {'sales': sales_info,
                'monthly_income': income_info,
                'age_groups': age_groups_info}