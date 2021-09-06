$(function () {
    // 切换登录表单
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    // 切换注册表单
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    });
});
const value = $('#repassword').val();
//从layui里面获取表单对象
const form = layui.form;
const layer = layui.layer;
//自定义函数
form.verify({
    //自定义一个pass规则
    pass: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
    //检验俩次密码是否一致,value就是密码确认框的值
    repwd: function (value) {
        //属性选择器.reg-box [name=password]要加空格
        const loginpwd = $('.reg-box [name=password]').val();
        if (loginpwd !== value) {
            return '请输入相同的密码'
        }
    }
});
// 注册事件
$('#form_reg').on('submit', function (e) {
    // 取消表单的默认提交行为
    e.preventDefault();
    const username = $('#name').val();
    const password = $('#password').val();
    $.post('api/reguser',
        {
            username: username,
            password: password
        },
        function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg(res.message)
            // 调用登录的点击事件
            $('#link_login').click();
            // 登陆成功清空表单信息
            $("#form_reg")[0].reset();
        });
});
// 登录事件
$('#form_login').on('submit', function (e) {
    // 取消表单的默认提交行为
    e.preventDefault();
    $.ajax({
        method: 'post',
        url: 'api/login',
        data: $(this).serialize(),
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg(res.message);
            // console.log(res);
            // 将登录得到的token字符串存到localStorage里面
            localStorage.setItem('token', res.token)
            // 跳转主页面
            location.href = './index.html';
        }
    });
});
