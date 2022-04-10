function signup_user() {
    let username = $('#user').val(); 
    let password = $('#pass').val();

    $.ajax({
        url: "/api/signup_user",
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


//登录按钮
function loginButton() {
    // //执行动画
    // event.preventDefault();
    // $('form').fadeOut(500);
    // $('.wrapper').addClass('form-success');

    let username = $('#username').val(); //从表单获取用户名
    let password = $('#password').val(); //从表单获取密码

    $.ajax({
        url: "/api/login",
        data: {
            'username' : username,
            'password' : password
        }, //请求的表单
        type: "POST",
        dataType: "json",
        success: (data) => {
            //请求成功后访问类属性，并显示服务端返回数据
            //如果登录成功
            if (data['code'] == 1 ) {
                window.location = '/background';
            }
            
            else {
                alert(data['content']);
            }
        }
    }); 

}