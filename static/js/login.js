class Login {
    //加载登录页面
    loadLogin() {
        $('#page').load('html/login/loginIn.html');
    }

    //加载注册页面
    loadRegister() {
        $('#page').load('html/login/signUp.html');
    }

    //登录按钮
    loginButton() {
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
                    popWindows(data['content']);
                }
            }
        }); 

    }

    //注册按钮
    registerButton() {
        this.login_page = $('#page').html(); //保存登录页面

        $('#user_form').load('html/login/signUp.html'); //加载注册页面
    }

    //返回按钮
    returnButton() {
        $('#page').html(this.login_page);
    }
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