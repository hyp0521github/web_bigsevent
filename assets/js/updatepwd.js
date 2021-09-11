$(function () {
    const layer = layui.layer;
    const form = layui.form;
    //自定义函数
    form.verify({
        //自定义一个pass规则
        pass: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function (value) {
            const samepwd = $('#password').val();
            if (samepwd === value) {
                return '新旧密码不能相同'
            }
        },
        //检验俩次密码是否一致,value就是谁赋值了repwd,谁的值急速value
        rePwd: function (value) {
            const updatepwd = $('#passwords').val();
            if (updatepwd !== value) {
                return '俩次密码不一致'
            }
        }
    });
    $('.layui-form').on('submit', function (e) {
        // 取消表单的默认提交行为
        e.preventDefault();
        // 发起请求修改密码
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: {
                oldPwd: $('#password').val(),
                newPwd: $('#passwords').val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('修改密码成功');
                // 修改成功后清除表单
                $('#password').val('');
                $('#passwords').val('');
                $('#passwordss').val('');
            }
        });
    }); 
});