import email
from importlib.resources import path
from operator import or_
import re
from click import password_option
from clock_timer import timer
from flask import Blueprint, g, redirect, request, session
from sqlalchemy import or_

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
            'sort' : essay.sort,
            'path' : essay.path,
            'time': essay.time
        })


    return {
        'code': 1,
        'content': essays_list
    }


@front.get('/api/get_notes')
def get_notes():
    notes = g.db_session.query(Note)
    
    notes_list = []
    for note in notes:
        notes_list.append({
            'note': note.note, 
            'content' : note.content,
            'sort' : note.sort,
            'time': note.time
        })


    return {
        'code': 1,
        'content': notes_list
    }


@front.get('/api/get_messages')
def get_messages():
    messages = g.db_session.query(Message)
    
    messages_list = []
    for message in messages:
        messages_list.append({
            'message': message.message, 
            'email' : message.email,
            'name' : message.name,
            'time': message.time
        })


    return {
        'code': 1,
        'content': messages_list
    }


@front.post('/api/get_comments')
def get_comments():
    path = request.form.get('path')

    reviews = g.db_session.query(Review).filter(Review.path == path)

    review_list = []
    for review in reviews:
        review_list.append({
            'review': review.review,
            'nickname': review.nickname,
            'time': review.time
        })

    return {
        'code': 1,
        'content': review_list
    }




@front.post('/api/add_review')
def add_review():
    inreview = request.form.get('review')
    innickname = request.form.get('nickname')
    inpath = request.form.get('path')   

    if not inreview:
        return {
            'code': 0,
            'content': '内容不能为空'
        }

    if not innickname:
        return {
            'code': 0,
            'content': '昵称不能为空'
        }

    if not inpath:
        return {
            'code': 0,
            'content': '链接不能为空'
        }

    review = Review(
        review=inreview,
        nickname=innickname,
        path=inpath,
        time=timer.get_current_time()
    )
    g.db_session.add(review)
    g.db_session.commit()

    return {
        'code': 1
    }


@front.post('/api/add_message')
def add_message():
    inmessage = request.form.get('message')
    inname = request.form.get('name')
    inemail = request.form.get('email')   

    if not inmessage:
        return {
            'code': 0,
            'content': '内容不能为空'
        }

    if not inname:
        return {
            'code': 0,
            'content': '名字不能为空'
        }

    if not inemail:
        return {
            'code': 0,
            'content': '邮箱不能为空'
        }

    message = Message(
        message=inmessage,
        name=inname,
        email=inemail,
        time=timer.get_current_time()
    )
    g.db_session.add(message)
    g.db_session.commit()

    return {
        'code': 1
    }


@front.post('/api/search')
def search():
    search_content = request.form.get('search_content')
    print('%{}%'.format(search_content))

    essays = g.db_session.query(Essay).filter(or_(Essay.essay.like('%{}%'.format(search_content)), Essay.content.like('%{}%'.format(search_content) ) ) )

    essays_list = []
    for essay in essays:
        essays_list.append({
            'essay': essay.essay,
            'content': essay.content,
            'time': essay.time,
            'path': essay.path
        })

    if not essays_list:
        return {
            'code': 0
        }

    return {
        'code': 1,
        'content': essays_list
    }


@front.post('/api/search_bysort')
def search_bysort():
    search_content = request.form.get('search_content')

    essays = g.db_session.query(Essay).filter(Essay.sort == search_content)

    essays_list = []
    for essay in essays:
        essays_list.append({
            'essay': essay.essay,
            'content': essay.content,
            'time': essay.time,
            'path': essay.path
        })

    if not essays_list:
        return {
            'code': 0
        }

    return {
        'code': 1,
        'content': essays_list
    }


@front.route('/front')
def front_():
    return front.send_static_file('front/index.html')


@front.route('/note')
def front_note():
    return front.send_static_file('front/notes.html')


@front.route('/message')
def front_message():
    return front.send_static_file('front/messages.html')


@front.route('/about')
def front_about():
    return front.send_static_file('front/about.html')



@front.route('/passage/<name>')
def name(name):
    path = '/passage/{}'.format(name)
    essay = g.db_session.query(Essay).filter(Essay.path == path).first()

    if not essay:
        return {
            'code': 0
        }

    return {
        'code': 1,
        'essay': essay.essay, 
        'content' : essay.content,
        'sort' : essay.sort,
        'path' : essay.path,
        'time': essay.time
    }
