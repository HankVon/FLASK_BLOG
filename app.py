from datetime import timedelta

from flask import Flask, url_for

from blueprints.login import login
from blueprints.background import background


def create_app():
    app = Flask(__name__)
    app.secret_key = 'sahfods;jfs;i'
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = timedelta(seconds=1) #禁用缓存 #仅开发使用
    
    app.register_blueprint(login)
    app.register_blueprint(background)

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='127.0.0.1', port=5000, debug=True)