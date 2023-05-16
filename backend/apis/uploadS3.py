# API endpoint for Upload file to AWS S3 (/uploadS3 namespace)

from flask import request
from flask_restx import Namespace, Resource, reqparse, fields
from flask_restx.inputs import email
from core.helpers import upload_to_aws
from http import HTTPStatus
from werkzeug.datastructures import FileStorage

uploadS3_ns = Namespace(name="Upload S3",
                        description='Upload Files to Amazon S3',
                        validate=True)

upload_s3_reqparser = reqparse.RequestParser(bundle_errors=True)
upload_s3_reqparser.add_argument(name="image_file", type=FileStorage,
                                 location="files", required=True)


# Handle HTTP requests to URL: /api/v1/s3/upload
@uploadS3_ns.route('/upload', endpoint='upload_to_S3')
class UploadS3(Resource):

    @uploadS3_ns.expect(upload_s3_reqparser)
    @uploadS3_ns.response(int(HTTPStatus.OK), "File uploaded to S3 bucket.")
    @uploadS3_ns.response(int(HTTPStatus.BAD_REQUEST), "Invalid File Passed")
    @uploadS3_ns.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), "Internal server error.")
    @uploadS3_ns.doc(description = 'Upload File to Amazon S3', security='Bearer')
    def post(self):
        args = upload_s3_reqparser.parse_args()
        image_file = args.get('image_file')
        image_filename = image_file.filename
        return upload_to_aws(image_file,image_filename)