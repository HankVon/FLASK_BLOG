function load(id, file) {
    $(id).load(file);
}

function get_essay(){
    $.ajax({
        url: '/api/get_essay',
        type: 'GET',
        dataType: 'json',
        success: (data) => {
            
            $('#essay_list').html('');
            if (data['code'] == 1 ) {
                for (let i = 0; i < data['content'].length; i++) {
                    $('#essay_list').append(`
                        <div class="layui-row layui-col-space15" style="height: 200px; margin-bottom: 20px;margin-top: 20px; background-color:#fff;border-radius: 30px;box-shadow: 0px 10px 30px 0px rgba(0,0,0,0.1);">
                        <div class="layui-font-20 layui-card-header"><a href="#" onclick="get_subessay('${data['content'][i]['path']}')"><font face="STHupo" >${data['content'][i]['essay']}</font><a/></div>
                        <div class="layui-card-body">
                        <i class="layui-icon" style="font-size: 20px;">&#xe612;</i>广之 <i class="layui-icon" style="font-size: 20px;paddin-left:5px">&#xe68d;</i>${data['content'][i]['time']}<i class="layui-icon" style="font-size: 20px;padding-left:5px">&#xe705;</i>${data['content'][i]['sort']}<br/><br/>
                        <div class="ca">${data['content'][i]['content']}</div>
                        </div>
                        </div>
                        `);
                }
            }
        }
    });
}


function get_notes(){
    $.ajax({
        url: '/api/get_notes',
        type: 'GET',
        dataType: 'json',
        success: (data) => {
            
            $('#note_list').html('');
            if (data['code'] == 1 ) {
                for (let i = 0; i < data['content'].length; i++) {
                    $('#note_list').append(`
                        <div class="layui-row layui-col-space15" style="margin-bottom: 20px;margin-top: 20px; background-color:#fff;border-radius: 30px;box-shadow: 0px 10px 30px 0px rgba(0,0,0,0.1);">
                        <div class="layui-font-20 layui-card-header"><a href="#"><font face="STHupo" color="#FA842B">${data['content'][i]['note']}</font><a/></div>
                        <div class="layui-card-body">
                        <i class="layui-icon" style="font-size: 20px;">&#xe68d;</i>${data['content'][i]['time']}<i class="layui-icon" style="font-size: 20px;padding-left:5px">&#xe705;</i>${data['content'][i]['sort']}<br/><br/>
                        <div>${data['content'][i]['content']}</div>
                        </div>
                        </div>
                        `);
                }
            }
        }
    });
}


function get_messages(){
    $.ajax({
        url: '/api/get_messages',
        type: 'GET',
        dataType: 'json',
        success: (data) => {
            for (let i = 0; i < data['content'].length; i++) {
                $('#messages').append(`
                    
                        <div class="lay-row layui-col-md1">
                            <img src="static/js/front/zl.jpg" style="width: 40px;height: 40px;border-radius: 50%">
                        </div>
                        <div class=" lay-row layui-col-md11">
                            <div class="layui-card-body" style="font-size: 15px; font-weight:bolder">${data['content'][i]['name']}</div>
                            <div class="layui-card-body">
                                    <div>
                                    ${data['content'][i]['message']}
                                    </div>
                            </div>
                            <div class="layui-card-body"><i class="layui-icon" style="font-size: 20px;">&#xe68d;</i>${data['content'][i]['time']}</div>    
                        </div>
                    
                `)
            }

        }
    }); 
}



var current_path;


function get_subessay(path){
    current_path = path;
    $('#content').load('/front/part/show.html', () => {
        
        $.ajax({
            url: path,
            type: 'GET',
            dataType: 'json',
            success: (data) => {
                $('#title').html(data['essay']);
                $('#time').html(data['time']);
                $('#classification').html(data['sort']);
                $('#subcontent').html(data['content']);

                $.ajax({
                    url: '/api/get_comments',
                    type: 'POST',
                    data: {
                        'path': current_path,
                    },
                    dataType: 'json',
                    success: (data) => {
                        for (let i = 0; i < data['content'].length; i++) {
                            $('#comments').append(`
                                <div style=" margin-bottom: 20px;margin-top: 20px; background-color:#FFF; border-radius: 30px;box-shadow: 0px 10px 30px 0px rgba(0,0,0,0.1);">
                                    <div class="layui-card-header">${data['content'][i]['nickname']}</div>
                                    <div><i class="layui-icon" style="font-size: 20px;">&#xe68d;</i>${data['content'][i]['time']}</div>
                                        <div class="layui-card-body">
                                            <div>
                                            ${data['content'][i]['review']}
                                            </div>
                                    </div>
                                </div>
                            `)
                        }

                    }
                }); 

            }
        });
    } );


}


function add_review() {
    console.log(current_path);
    $.ajax({
        url: '/api/add_review',
        type: 'POST',
        data: {
            'path': current_path,
            'review': $('#review').val(),
            'nickname': $('#nickname').val()
        },
        dataType: 'json',
        success: (data) => {
            
            if (data['code'] == 1 ) {
                alert('发布成功');
                get_subessay(current_path);
            }
        
        }
    }); 
}


function add_message() {
    
    $.ajax({
        url: '/api/add_message',
        type: 'POST',
        data: {
            'email': $('#email').val(),
            'message': $('#message').val(),
            'name': $('#name').val()
        },
        dataType: 'json',
        success: (data) => {
            
            if (data['code'] == 1 ) {
                alert('发布成功');
                get_messages();
            }
        
        }
    }); 
}



function search() {
    $.ajax({
        url: '/api/search',
        type: 'POST',
        data: {
            'search_content': $('#search_content').val()
        },
        dataType: 'json',
        success: (data) => {
            
            if (data['code'] == 0) {
                alert('没有找到相关文章');
            }

            else {
                $('#essay_list').html('');
                if (data['code'] == 1 ) {
                    for (let i = 0; i < data['content'].length; i++) {
                        $('#essay_list').append(`
                        <div class="layui-row layui-col-space15 " style="height: 200px; margin-bottom: 20px;margin-top: 20px; background-color:#FFF;border-radius: 30px;box-shadow: 0px 10px 30px 0px rgba(0,0,0,0.1);">
                        <div class="layui-font-20 layui-card-header"><a href="#" onclick="get_subessay('${data['content'][i]['path']}')">${data['content'][i]['essay']}<a/></div>
                        <div class="layui-card-body">
                        <i class="layui-icon" style="font-size: 20px;">&#xe612;</i>广之 <i class="layui-icon" style="font-size: 20px;paddin-left:5px">&#xe68d;</i>${data['content'][i]['time']}<i class="layui-icon" style="font-size: 20px;padding-left:5px">&#xe705;</i>${data['content'][i]['sort']}<br/><br/>
                        <div class="ca">${data['content'][i]['content']}</div>
                        </div>
                        </div>
                            `);
                    }
                }
            }
        
        }
    }); 
}

function search_bysort(keyword) {
    
    $.ajax({
        url: '/api/search_bysort',
        type: 'POST',
        data: {
            'search_content': keyword
        },
        dataType: 'json',
        success: (data) => {
            
            if (data['code'] == 0) {
                alert('没有找到相关文章');
            }

            else {
                $('#essay_list').html('');
                if (data['code'] == 1 ) {
                    for (let i = 0; i < data['content'].length; i++) {
                        $('#essay_list').append(`
                        <div class="layui-row layui-col-space15 " style="height: 200px; margin-bottom: 20px;margin-top: 20px; background-color:#FFF; border-radius: 30px;box-shadow: 0px 10px 30px 0px rgba(0,0,0,0.1);">
                        <div class="layui-font-20 layui-card-header"><a href="#" onclick="get_subessay('${data['content'][i]['path']}')">${data['content'][i]['essay']}<a/></div>
                        <div class="layui-card-body">
                        <i class="layui-icon" style="font-size: 20px;">&#xe612;</i>广之 <i class="layui-icon" style="font-size: 20px;paddin-left:5px">&#xe68d;</i>${data['content'][i]['time']}<i class="layui-icon" style="font-size: 20px;padding-left:5px">&#xe705;</i>${data['content'][i]['sort']}<br/><br/>
                        <div class="ca">${data['content'][i]['content']}</div>
                        </div>
                        </div>
                            `);
                    }
                }
            }
        
        }
    }); 
}