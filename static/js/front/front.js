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
                        <div class="layui-font-20 layui-card-header"><a href="${data['content'][i]['path']}">${data['content'][i]['essay']}<a/></div>
                        <div class="layui-card-body">
                            ${data['content'][i]['time']}<br/><br/>
                            ${data['content'][i]['content']}
                        </div>
                        `);
                }
            }
        }
    });
}