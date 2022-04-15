from importlib.resources import path
from click import password_option
from clock_timer import timer
from flask import Blueprint, g, redirect, request, session

from extensions.database import DBSession
from extensions.database.models import *


background = Blueprint(
    'backgound',
    __name__,
    # url_prefix='/background',
    static_folder='../static',
    static_url_path=''
)


@background.before_request
def before_request():
    g.db_session = DBSession()
    
    if not session.get('username'):
        return redirect('/')


@background.teardown_request
def teardown_request(error):
    g.db_session.close()


'''
    API
'''

@background.post('/api/add')
def add():
    inessay = request.form.get('essay')
    incontent = request.form.get('content')
    inpath = request.form.get('path')
    insort = request.form.get('sort')

    if not inessay:
        return {
            'code': 0,
            'content': '标题不能为空'
        }

    if not incontent:
        return {
            'code': 0,
            'content': '内容不能为空'
        }

    if not inpath:
        return {
            'code': 0,
            'content': '链接不能为空'
        }

    result = g.db_session.query(Essay).filter(Essay.path == inpath).first()
    if result:
        return {
            'code': 0,
            'content': '该链接已存在'
        }

    essay = Essay(
        essay = inessay,
        content = incontent,
        sort = insort,
        time = timer.get_current_time(),
        path = inpath
    )
    g.db_session.add(essay)
    g.db_session.commit()

    return {
        'code': 1
    }


@background.post('/api/add_user')
def add_user():
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


@background.post('/api/add_note')
def add_note():
    innote = request.form.get('note')
    incontent = request.form.get('content')
    insort = request.form.get('sort')

    if not innote:
        return {
            'code': 0,
            'content': '标题不能为空'
        }

    if not incontent:
        return {
            'code': 0,
            'content': '内容不能为空'
        }

    if not insort:
        return {
            'code': 0,
            'content': '分类不能为空'
        }

    result = g.db_session.query(Note).filter(Note.note == innote).first()
    if result:
        return {
            'code': 0,
            'content': '该笔记已存在'
        }

    note = Note(
        note = innote,
        content = incontent,
        sort = insort,
        time = timer.get_current_time(),
        
    )
    g.db_session.add(note)
    g.db_session.commit()

    return {
        'code': 1
    }



@background.get('/api/get_essay_list')
def get_essay_list():
    essays = g.db_session.query(Essay)
    
    essays_list = []
    for essay in essays:
        essays_list.append({
            'essay': essay.essay, 
            'sort' : essay.sort,
            'path': essay.path,
            'time': essay.time
        })


    return {
        'code': 1,
        'content': essays_list
    }


@background.get('/api/get_note_list')
def get_note_list():
    notes = g.db_session.query(Note)
    
    notes_list = []
    for note in notes:
        notes_list.append({
            'note': note.note, 
            'sort' : note.sort,
            'time': note.time
        })


    return {
        'code': 1,
        'content': notes_list
    }


@background.get('/api/get_message_list')
def get_message_list():
    messages = g.db_session.query(Message)
    
    messages_list = []
    for message in messages:
        messages_list.append({
            'message': message.message, 
            'email' : message.email,
            'name' :message.name,
            'time': message.time,
            'index': message.index
        })


    return {
        'code': 1,
        'content': messages_list
    }


@background.post('/api/get_essay')
def get_essay():
    path = request.form.get('path')
    
    essay = g.db_session.query(Essay).filter(Essay.path == path).first()
    
    if not essay:
        return {
            'code': 0,
            'content': '文章路径不正确'
        }
        
    return {
        'code': 1,
        'content': {
            'essay': essay.essay,
            'content': essay.content,
            'sort': essay.sort
        }
    }


@background.post('/api/get_note')
def get_note():
    note = request.form.get('note')
    
    note = g.db_session.query(Note).filter(Note.note == note).first()
    
    if not note:
        return {
            'code': 0,
            'content': '笔记不正确'
        }
        
    return {
        'code': 1,
        'content': {
            'note': note.note,
            'content': note.content,
            'sort': note.sort
        }
    }    


@background.post('/api/update')
def update():
    inessay = request.form.get('essay')
    incontent = request.form.get('content')
    inpath = request.form.get('path')
    insort = request.form.get('sort')

    if not inessay:
        return {
            'code': 0,
            'content': '标题不能为空'
        }

    if not incontent:
        return {
            'code': 0,
            'content': '内容不能为空'
        }

    if not inpath:
        return {
            'code': 0,
            'content': '链接不能为空'
        }

    essay = g.db_session.query(Essay).filter(Essay.path == inpath).first()
    if not essay:
        return {
            'code': 0,
            'content': '该文章不存在'
        }

    essay.essay = inessay
    essay.content = incontent
    essay.sort = insort
    g.db_session.commit()

    return {
        'code': 1
    }


@background.post('/api/delete')
def delete():
    path = request.form.get('path')

    essay = g.db_session.query(Essay).filter(Essay.path == path).first()
    if not essay:
        return {
            'code': 0,
            'content': '该文章不存在'
        }
        
    g.db_session.delete(essay)
    g.db_session.commit()
    
    return {
        'code': 1
    }


@background.post('/api/delete_note')
def delete_note():
    note = request.form.get('note')

    note = g.db_session.query(Note).filter(Note.note == note).first()
    if not note:
        return {
            'code': 0,
            'content': '该笔记不存在'
        }
        
    g.db_session.delete(note)
    g.db_session.commit()
    
    return {
        'code': 1
    }


@background.post('/api/delete_message')
def delete_message():
    index = request.form.get('index')

    index = g.db_session.query(Message).filter(Message.index == index).first()
    if not index:
        return {
            'code': 0,
            'content': '该留言不存在'
        }
        
    g.db_session.delete(index)
    g.db_session.commit()
    
    return {
        'code': 1
    }


@background.post('/api/delete_user')
def delete_user():
    username = request.form.get('username')
    
    user = g.db_session.query(User).filter(User.username == username).first()
    if not user:
        return {
            'code': 0,
            'content': '该用户不存在'
        }
        
    g.db_session.delete(user)
    g.db_session.commit()
    
    return {
        'code': 1
    }


@background.post('/api/update_user')
def update_user():
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

    user = g.db_session.query(User).filter(User.username == inusername).first()
    if not user:
        return {
            'code': 0,
            'content': '该用户不存在'
        }

    user.username = inusername
    user.password = inpassword
    
    g.db_session.commit()

    return {
        'code': 1
    }


@background.get('/api/get_user_list')
def get_user_list():
    users = g.db_session.query(User)
    
    users_list = []
    for user in users:
        users_list.append({
            'username': user.username, 
        })


    return {
        'code': 1,
        'content': users_list
    }


@background.post('/api/get_user')
def get_user():
    username = request.form.get('username')
    
    user = g.db_session.query(User).filter(User.username == username).first()
    print(user)
    if not user:
        return {
            'code': 0,
            'content': '用户名不正确'
        }
        
    return {
        'code': 1,
        'content': {
            'username': user.username,
            'password': user.password,
        }
    }


@background.get('/api/logout')
def logout():
    session.clear()
    return {
        'code': 1
    }

'''
    Route
'''

@background.route('/background')
def background_():
    return background.send_static_file('background/index.html')