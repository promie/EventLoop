# API endpoint for Event Recommendations (/recommendations namespace)

from flask_restx import Namespace, Resource, reqparse
from flask_restx.inputs import email
from http import HTTPStatus
from apis.event import list_events_model
from core.helpers import get_recommendation

recommend_ns = Namespace(name="Event Recommendation",
                         description='Event Recommendation',
                         validate=True)

# Handle HTTP requests to URL: /api/v1/recommend/{user_id}
@recommend_ns.route('/<int:id>', endpoint='recommend_events')
@recommend_ns.param('id', 'User ID')
class RecommendEvents(Resource):

    # Retrive a list of 8 recommended events
    @recommend_ns.marshal_with(list_events_model)
    @recommend_ns.response(int(HTTPStatus.OK), 'Success.', list_events_model)
    @recommend_ns.response(int(HTTPStatus.NOT_FOUND), 'No event available.')
    @recommend_ns.response(int(HTTPStatus.BAD_REQUEST), 'Validation error.')
    @recommend_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Internal server error.')
    @recommend_ns.doc(description = 'Retrieve a List of 8 Recommended Events')
    def get(self,id):
        return {'events': get_recommendation(id)}