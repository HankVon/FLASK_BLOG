from importlib.resources import path
from click import password_option
from clock_timer import timer
from flask import Blueprint, g, redirect, request, session

from extensions.database import DBSession
from extensions.database.models import *


front = Blueprint(
    'front',
    __name__,
    static_folder='../static',
    static_url_path=''
)


@front.before_request
def before_request():
    g.db_session = DBSession()
    
    if not session.get('username'):
        return redirect('/')


@front.teardown_request
def teardown_request(error):
    g.db_session.close()


@front.get('/api/get_essay')
def get_essay():
    essays = g.db_session.query(Essay)
    
    essays_list = []
    for essay in essays:
        essays_list.append({
            'essay': essay.essay, 
            'content' : essay.content,
            'path' : essay.path,
            'time': essay.time
        })


    return {
        'code': 1,
        'content': essays_list
    }



@front.route('/front')
def front_():
    return front.send_static_file('front/index.html')