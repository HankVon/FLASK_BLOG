function load(id, file) {
    $(id).load(file);
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
            
            if (data['code'] == 1 ) {
                for (let i = 0; i < data['content'].length; i++) {
                    $('#essay_list').append(`<tr>\
                        <td>${data['content'][i]['essay']}</td>
                        <td>${data['content'][i]['sort']}</td>
                        <td>${data['content'][i]['path']}</td>
                        <td>${data['content'][i]['time']}</td>
                        <td>
                            <button type="button" class="layui-btn" onclick="load('#content', '/background/part/editor.html')">编辑</button>
                            <button type="button" class="layui-btn" onclick="">删除</button>    
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
                            <button type="button" class="layui-btn" onclick="load('#content', '/background/part/user.html')">编辑</button>
                            <button type="button" class="layui-btn" onclick="">删除</button>    
                        </td>                        
                    </tr>`);
                }

            }
        
        }
    }); 
}

