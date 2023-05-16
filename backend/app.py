# This is where the flask app will be

from flask import Flask
from flask_cors import CORS
from config import get_config
from apis import api_bp
from database import create_db
from core import f_bcrypt, mail

create_db()
cors = CORS()

app = Flask(__name__)
app.config.from_object(get_config('production'))
app.register_blueprint(api_bp)
cors.init_app(app)
f_bcrypt.init_app(app)
mail.init_app(app)


if __name__ == '__main__':
    app.run(debug = True)