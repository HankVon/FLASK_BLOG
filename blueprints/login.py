from flask import Blueprint, g, redirect, request, session

from extensions.database import DBSession
from extensions.database.models import *


login = Blueprint(
    'login',
    __name__,
    static_folder='../static',
    static_url_path=''
)


@login.before_request
def before_request():
    g.db_session = DBSession()


@login.teardown_request
def teardown_request(error):
    g.db_session.close()


'''
    API
'''


@login.post('/api/login')
def user_login():
    inusername = request.form.get('username')
    inpassword = request.form.get('password')

    result = g.db_session.query(User).filter(User.username == inusername).first()
    if not result:
        return {
            'code': 0,
            'content': 'username is valid'
            
        }

    if inpassword != result.password:
        return {
            'code': 0,
            'content': 'password is wrong'
        }
     

    session['username'] = inusername

    return {
        'code': 1
    }




'''
    Route
'''





@login.route('/')
def login_():
    return login.send_static_file('login.html')


