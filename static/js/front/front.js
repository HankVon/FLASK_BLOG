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
                        <div class="layui-row layui-col-space15" style="height: 200px; margin-bottom: 20px;margin-top: 20px; background-color:#e8dede">
                        <div class="layui-font-20 layui-card-header"><a href="#" onclick="get_subessay('${data['content'][i]['path']}')">${data['content'][i]['essay']}<a/></div>
                        <div class="layui-card-body">
                            ${data['content'][i]['time']}<br/><br/>
                        <div class="ca">${data['content'][i]['content']}</div>
                        </div>
                        </div>
                        `);
                }
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
                            $('#content').append(`
                                <div class="layui-card" style="width: 800px; margin: auto;top: 0;left: 0;right: 0;bottom: 0;background:#FFF; color:#000;margin-bottom: 20px;margin-top: 20px;">
                                    <div class="layui-card-header">${data['content'][i]['nickname']}</div>
                                    <div>${data['content'][i]['time']}</div>
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
                            <div class="layui-font-20 layui-card-header"><a href="#" onclick="get_subessay('${data['content'][i]['path']}')">${data['content'][i]['essay']}<a/></div>
                            <div class="layui-card-body">
                                ${data['content'][i]['time']}<br/><br/>
                                ${data['content'][i]['content']}
                            </div>
                            `);
                    }
                }
            }
        
        }
    }); 
}