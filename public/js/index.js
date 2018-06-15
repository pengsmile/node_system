$(function() {


    var defs = {
        setup: function(e) {
            var r = e.container || "body",
                n = e.data;
            $.each($(r).find("[field]"), function(e, r) {
                var a = $(r),
                    u = a.attr("field");
                "" != u && "out" != a.attr("field_op") && defs.setValue(a, n[u])
            })
        },
        getValue: function(e) {
            var r = defs.getType(e);
            return "input" == r ? $(e).val() : "select" == r ? $(e).find("option:selected").val() : $(e).html()
        },
        setValue: function(e, r) {
            var n = defs.getType(e);
            "input" == n ? $(e).val(r) : "select" == n ? $(e).val(r) : $(e).html(r)
        },
        getType: function(e) {
            var r = "";
            return $(e).is("select") ? r = "select" : ($(e).is("input") || $(e).is("textarea")) && (r = "input"),
                r
        }
    }


    $('#New').on('click', function() {

        pubilc();
        defs.setup({
            container: '#myModal',
            data: {}
        })
        $('#myModal').data('data', {})
    });
    $('#save').on('click', function() {
        let data = $('#myModal').data('data');
        if (data.id) {
            save(data);
        } else {
            save();
        }

    });
    set('lalala', 123, 1);

    function set(key, val, time) { //设置cookie方法
        var date = new Date(); //获取当前时间
        var expiresDays = time; //将date设置为n天以后的时间
        date.setTime(date.getTime() + expiresDays * 24 * 3600 * 1000); //格式化为cookie识别的时间
        document.cookie = key + "=" + val + ";expires=" + date.toGMTString(); //设置cookie
    }

    function pubilc(param) {
        $('#myModal').modal('show');
    }

    function save(data) {
        let param = {
            name: $('#myModal').find('[field="name"]').val(),
            money: $('#myModal').find('[field="money"]').val(),
            age: $('#myModal').find('[field="age"]').val(),
            channel: $('#myModal').find('[field="channel"]').val(),
        }
        if (data) {
            param.id = data.id
            param.m = 'UPDATE'
            param.SP_NAME = 'SP_UPDATE'
            param.url = 'http://127.0.0.1:3000/UPDATE'
        } else {
            param.m = 'INSERT'
            param.SP_NAME = 'SP_INSERT'
            param.url = 'http://127.0.0.1:3000/INSERT'
        }
        query(param).done(function(ref) {
            if (ref.RETURN_CODE == 0) {
                $('#myModal').modal('hide');
                window.location.reload()
            }
        })
    }

    $('.Edit').on('click', function() {
        let self = $(this).closest('tr').find('.id').html();
        query({
            m: 'SEARCH',
            SP_NAME: 'SP_SEARCH',
            id: self,
            url: 'http://127.0.0.1:3000/SEARCH'
        }).done(function(ref) {
            pubilc(ref[0]);
            defs.setup({
                    container: '#myModal',
                    data: ref[0]
                })
                // $('#myModal').find('[field="name"]').val(ref[0].name)
                // $('#myModal').find('[field="money"]').val(ref[0].money)
                // $('#myModal').find('[field="age"]').val(ref[0].age)
                // $('#myModal').find('[field="channel"]').val(ref[0].channel)
            $('#myModal').data('data', ref[0]);

        })

    });

    function Edit(param) {

    }

    $('.del').on('click', function() {
        if (!confirm('你确定要删除吗？')) {
            return
        }
        let self = $(this).closest('tr').find('.id').html();
        query({
            m: 'DELETE',
            SP_NAME: 'SP_DELETE',
            id: self,
            url: 'http://127.0.0.1:3000/DEL'
        }).done(function(ref) {
            console.log(ref);
            if (ref.RETURN_CODE == 0) {
                window.location.reload()
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