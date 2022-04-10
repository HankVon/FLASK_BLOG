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


@login.post('/api/signup_user')
def signup_user():
    inusername = request.form.get('username')
    inpassword = request.form.get('password')

    if not inusername:
        return {
            'code': 0,
            'content': '用户名不能为空'
        }

    if not inpassword:
        return {
            'code': 0,
            'content': '密码不能为空'
        }


    result = g.db_session.query(User).filter(User.username == inusername).first()
    if result:
        return {
            'code': 0,
            'content': '该用户已存在'
        }

    user = User(
        username = inusername,
        password = inpassword
    )
    g.db_session.add(user)
    g.db_session.commit()

    return {
        'code': 1
    }

'''
    Route
'''





@login.route('/')
def login_():
    return login.send_static_file('login.html')


