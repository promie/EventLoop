# API endpoint for Authentication (/auth namespace)

from argparse import Action
from datetime import datetime
import json
from flask import request
from flask_restx import Namespace, Resource, reqparse
from flask_restx.inputs import email
from http import HTTPStatus
from core.helpers import process_login, process_register, process_preRegister, process_change_password, process_forget_password, process_reset_password


auth_ns = Namespace(name="Auth",
                    description='User Authentication',
                    validate=True)

# Define parameteres can be obtained from the API queries
# For PreRegister
pre_register_reqparser = reqparse.RequestParser(bundle_errors=True)
pre_register_reqparser.add_argument(name="email", type=email(),
                                    location="json", required=True, nullable=False)

# For Register
register_reqparser = reqparse.RequestParser(bundle_errors=True)
register_reqparser.add_argument(name="email", type=email(),
                                location="json", required=True, nullable=False)
register_reqparser.add_argument(name="password", type=str,
                                location="json", required=True, nullable=False)
register_reqparser.add_argument(name="first_name", type=str,
                                location="json", required=True, nullable=False)
register_reqparser.add_argument(name="last_name", type=str,
                                location="json", required=True, nullable=False)
register_reqparser.add_argument(name="birthday", type=str,
                                location="json", required=True, nullable=False)
register_reqparser.add_argument(name="address", type=str,
                                location="json", required=True, nullable=False)
register_reqparser.add_argument(name="gps_coord", type=str,
                                location="json", required=True, nullable=False)

# For Login
auth_reqparser = reqparse.RequestParser(bundle_errors=True)
auth_reqparser.add_argument(name="email", type=email(),
                            location="json", required=True, nullable=False)
auth_reqparser.add_argument(name="password", type=str,
                            location="json", required=True, nullable=False)

# For Change Password
change_password_reqparser = reqparse.RequestParser(bundle_errors=True)
change_password_reqparser.add_argument(name="email", type=email(),
                                       location="json", required=True, nullable=False)
change_password_reqparser.add_argument(name="current_password", type=str,
                                       location="json", required=True, nullable=False)
change_password_reqparser.add_argument(name="new_password", type=str,
                                       location="json", required=True, nullable=False)

# For Forget Password (Step 1)
forget_password_reqparser = reqparse.RequestParser(bundle_errors=True)
forget_password_reqparser.add_argument(name="email", type=email(),
                                       location="json", required=True, nullable=False)
forget_password_reqparser.add_argument(name="frontend_host", type=str,
                                       location="json", required=True, nullable=False)

# For Reset Password (Step 2)
reset_password_reqparser = reqparse.RequestParser(bundle_errors=True)
reset_password_reqparser.add_argument(name="new_password", type=str,
                                       location="json", required=True, nullable=False)
reset_password_reqparser.add_argument(name="reset_token", type=str,
                                       location="json", required=True, nullable=False)


# Handle HTTP requests to URL: /api/v1/auth/register/verify
@auth_ns.route("/register/verify", endpoint="verify")
class PreRegister(Resource):
    # Check an existing email
    @auth_ns.expect(pre_register_reqparser)
    @auth_ns.response(int(HTTPStatus.OK), "Email address already registered.")
    @auth_ns.response(int(HTTPStatus.UNAUTHORIZED), "Email or password is incorrect.")
    @auth_ns.response(int(HTTPStatus.BAD_REQUEST), "Validation error.")
    @auth_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), "Internal server error.")
    def post(self):
        args = pre_register_reqparser.parse_args()
        input_email = args.get('email')
        return process_preRegister(input_email)


# Handle HTTP requests to URL: /api/v1/auth/register
@auth_ns.route("/register", endpoint="register")
class Register(Resource):
    # Create a new user
    @auth_ns.expect(register_reqparser)
    @auth_ns.response(int(HTTPStatus.CREATED), "New user created successfully.")
    @auth_ns.response(int(HTTPStatus.CONFLICT), "Email address already registered.")
    @auth_ns.response(int(HTTPStatus.BAD_REQUEST), "Validation error.")
    @auth_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), "Internal server error.")
    def post(self):
        args = register_reqparser.parse_args()
        input_email = args.get('email')
        input_password = args.get('password')
        input_firstName = args.get('first_name')
        input_lastName = args.get('last_name')
        input_birthday_str = args.get('birthday')
        # datetime_string = "2022-10-10"
        input_birthday = datetime.fromisoformat(input_birthday_str).date()
        input_billingAdd = args.get('address')
        input_gpsCoordinates = args.get('gps_coord')
        return process_register(input_email, input_password, input_firstName,
                                input_lastName, input_birthday,
                                input_billingAdd, input_gpsCoordinates)


# Handle HTTP requests to URL: /api/v1/auth/login
@auth_ns.route("/login", endpoint="login")
class Login(Resource):
    # Authenticate an existing user
    @auth_ns.expect(auth_reqparser)
    @auth_ns.response(int(HTTPStatus.OK), "Login successfully.")
    @auth_ns.response(int(HTTPStatus.UNAUTHORIZED), "Email or password is incorrect.")
    @auth_ns.response(int(HTTPStatus.BAD_REQUEST), "Validation error.")
    @auth_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), "Internal server error.")
    def post(self):
        args = auth_reqparser.parse_args()
        input_email = args.get('email')
        input_password = args.get('password')
        return process_login(input_email, input_password)
    

# Handle HTTP requests to URL: /api/v1/auth/change_password
@auth_ns.route("/change_password", endpoint="change_password")
class ChangePassword(Resource):
    # Update Password for Current Logged In User
    @auth_ns.expect(change_password_reqparser)
    @auth_ns.response(int(HTTPStatus.OK), 'Success.')
    @auth_ns.response(int(HTTPStatus.UNAUTHORIZED), "Email or password is incorrect.")
    @auth_ns.response(int(HTTPStatus.BAD_REQUEST), 'Validation error.')
    @auth_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Internal server error.')
    @auth_ns.doc(description = 'Change User Pasword', security='Bearer')
    def patch(self):
        args = change_password_reqparser.parse_args()
        input_email = args.get('email')
        input_current_password = args.get('current_password')
        input_new_password = args.get('new_password')
        return process_change_password(input_email, input_current_password, input_new_password)


# Handle HTTP requests to URL: /api/v1/auth/forget_password
@auth_ns.route("/forget_password", endpoint="forget_password")
class ForgetPassword(Resource):
    # Step 1 - Send Reset Password Email to User
    @auth_ns.expect(forget_password_reqparser)
    @auth_ns.response(int(HTTPStatus.OK), "Success.")
    @auth_ns.response(int(HTTPStatus.UNAUTHORIZED), "Email is incorrect.")
    @auth_ns.response(int(HTTPStatus.BAD_REQUEST), "Validation error.")
    @auth_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), "Internal server error.")
    @auth_ns.doc(description = 'Send Reset Password Email')
    def post(self):
        args = forget_password_reqparser.parse_args()
        input_email = args.get('email')
        input_url = args.get('frontend_host')
        return process_forget_password(input_email, input_url)
    
    # Step 2 - Reset User Password if the Provided Token is Matched
    @auth_ns.expect(reset_password_reqparser)
    @auth_ns.response(int(HTTPStatus.OK), "Success.")
    @auth_ns.response(int(HTTPStatus.NOT_FOUND), 'No user available.')
    @auth_ns.response(int(HTTPStatus.BAD_REQUEST), "Validation error.")
    @auth_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), "Internal server error.")
    @auth_ns.doc(description = 'Reset User Pasword')
    def patch(self):
        args = reset_password_reqparser.parse_args()
        input_new_password = args.get('new_password')
        input_reset_token = args.get('reset_token')
        return process_reset_password(input_new_password, input_reset_token)
    

