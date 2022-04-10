function load(id, file) {
    $(id).load(file);
}


var path;

function editor_load(id, file, inpath) {
    $(id).load(file);
    path = inpath;
}


var username;

function user_load(id, file, inusername) {
    $(id).load(file);
    username = inusername;
}

function add() {
    let essay = $('#essay').val(); 
    let content = $('.ck-editor__editable_inline').html(); 
    let sort = $('#sort').val(); 
    let path = $('#path').val();

    $.ajax({
        url: "/api/add",
        data: {
            'essay' : essay,
            'content' : content,
            'sort' : sort,
            'path' : path
        }, //请求的表单
        type: "POST",
        dataType: "json",
        success: (data) => {
            //请求成功后访问类属性，并显示服务端返回数据
            //如果登录成功
            if (data['code'] == 1 ) {
                alert('文章发布成功')
                window.location = '/background';
            }
            
            else {
                alert(data['content']);
            }
        }
    }); 

}


function add_user() {
    let username = $('#username').val(); 
    let password = $('#password').val();

    $.ajax({
        url: "/api/add_user",
        data: {
            'username': username,
            'password' : password
        }, //请求的表单
        type: "POST",
        dataType: "json",
        success: (data) => {
            //请求成功后访问类属性，并显示服务端返回数据
            //如果登录成功
            if (data['code'] == 1 ) {
                alert('管理员添加成功')
                window.location = '/background';
            }
            
            else {
                alert(data['content']);
            }
        }
    }); 

}


function get_essay_list() {
    $.ajax({
        url: '/api/get_essay_list',
        type: 'GET',
        dataType: 'json',
        success: (data) => {
            
            $('#essay_list').html('');
            if (data['code'] == 1 ) {
                for (let i = 0; i < data['content'].length; i++) {
                    $('#essay_list').append(`<tr>\
                        <td>${data['content'][i]['essay']}</td>
                        <td>${data['content'][i]['sort']}</td>
                        <td>${data['content'][i]['path']}</td>
                        <td>${data['content'][i]['time']}</td>
                        <td>
                            <button type="button" class="layui-btn" onclick="editor_load('#content', '/background/part/editor.html', '${data['content'][i]['path']}') ">编辑</button>
                            <button type="button" class="layui-btn" onclick="delete_essay('${data['content'][i]['path']}')">删除</button>    
                        </td>
                        
                    </tr>`);
                }

            }
        
        }
    }); 
}




function get_user_list() {
    $.ajax({
        url: '/api/get_user_list',
        type: 'GET',
        dataType: 'json',
        success: (data) => {
            
            if (data['code'] == 1 ) {
                for (let i = 0; i < data['content'].length; i++) {
                    $('#user_list').append(`<tr>\
                        <td>${data['content'][i]['username']}</td>
                        <td>
                            <button type="button" class="layui-btn" onclick="user_load('#content', '/background/part/reuser.html','${data['content'][i]['username']}')">编辑</button>
                            <button type="button" class="layui-btn" onclick="delete_user('${data['content'][i]['username']}')">删除</button>    
                        </td>                        
                    </tr>`);
                }

            }
        
        }
    }); 
}


function delete_user(username) {
    $.ajax({
        url: "/api/delete_user",
        data: {
            'username' : username
        }, //请求的表单
        type: "POST",
        dataType: "json",
        success: (data) => {
            //请求成功后访问类属性，并显示服务端返回数据
            //如果登录成功
            if (data['code'] == 1 ) {
                alert('删除成功');
                get_user_list();
            }
            
        }
    }); 
}


function update_user() {
   
    let username = $('#username').val(); 
    let password = $('#password').val();

    $.ajax({
        url: "/api/update_user",
        data: {
            'username' : username,
            'password' : password,
            
        }, //请求的表单
        type: "POST",
        dataType: "json",
        success: (data) => {
            //请求成功后访问类属性，并显示服务端返回数据
            //如果登录成功
            if (data['code'] == 1 ) {
                alert('用户已更改');
                get_user();
            }
            
        }
    }); 

}


function get_user() {
    $.ajax({
        url: '/api/get_user',
        type: 'POST',
        data: {
            'username': $('#username').val()
        },
        dataType: 'json',
        success: (data) => {
            
            if (data['code'] == 1 ) {
                $('#username').val(data['content']['username']);
                $('#password').val(data['content']['password']);
            }
            else{
                alert('获取失败')
            }
        }
    }); 
}


function get_essay() {
    $.ajax({
        url: '/api/get_essay',
        type: 'POST',
        data: {
            'path': $('#path').val()
        },
        dataType: 'json',
        success: (data) => {
            
            if (data['code'] == 1 ) {
                $('#essay').val(data['content']['essay']);
                $('.ckeditor').html(data['content']['content']);
                $('#sort').val(data['content']['sort']);
            }
        
        }
    }); 
}


function update() {
    let essay = $('#essay').val(); 
    let content = $('.ck-editor__editable_inline').html(); 
    let sort = $('#sort').val(); 
    let path = $('#path').val();

    $.ajax({
        url: "/api/update",
        data: {
            'essay' : essay,
            'content' : content,
            'sort' : sort,
            'path' : path
        }, //请求的表单
        type: "POST",
        dataType: "json",
        success: (data) => {
            //请求成功后访问类属性，并显示服务端返回数据
            //如果登录成功
            if (data['code'] == 1 ) {
                alert('文章已更改');
                get_essay();
            }
            
        }
    }); 

}


function delete_essay(path) {
    $.ajax({
        url: "/api/delete",
        data: {
            'path' : path
        }, //请求的表单
        type: "POST",
        dataType: "json",
        success: (data) => {
            //请求成功后访问类属性，并显示服务端返回数据
            //如果登录成功
            if (data['code'] == 1 ) {
                alert('删除成功');
                get_essay_list();
            }
            
        }
    }); 
}

function logout(){
    $.ajax({
        url: "/api/logout",
        type: "GET",
        dataType: "json",
        success: (data) => {
            location.reload();  
        }
    }); 
}