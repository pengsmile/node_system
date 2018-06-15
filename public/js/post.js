$(function() {
    $('.send').on('click', function() {
        query({
            title: $('.form').find('[name="title"]').val(),
            content: $('.form').find('[name="content"]').val(),
            url: 'http://127.0.0.1:3000/post'
        }).done(function(ref) {
            console.log(ref);
            if (ref.RETURN_CODE == 0) {
                window.location.href = '/'
            }
        })
    })
})


function query() {
    var param = arguments,
        config = {},
        Submitparam = {};
    $.each(param[0], function(n, v) {
        n == 'type' ? config.type = v : n == 'url' ? config.url = v : n == 'dataType' ? config.dataType = v : Submitparam[n] = v;

    });
    var defsults = {
            url: config.url ? config.url : $.defs.url + 'base/query',
            type: config.type ? config.type : 'post',
            dataType: config.dataType ? config.dataType : 'json',
            data: Submitparam
        },
        ajax = $.ajax(defsults);
    if (param.length == 1) {
        return ajax
    } else if (param.length == 2) {
        ajax.then(param[param.length - 1]);
    } else if (param.length == 3) {
        ajax.then(param[1]).always(param[param.length - 1]);
    } else {
        ajax.then(param[1], param[2]).always(param[3]);
    }
}