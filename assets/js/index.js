$(function () {
    getUserInfor()
    // 退出按钮
    $('#signOut').on('click', function (index) {
        layer.confirm('确定要退出吗', { icon: 3, title: '提示' }, function () {
            // 清除token
            localStorage.removeItem('token')
            //跳转登录界面
            location.href = './login.html'
        });
        // 关闭询问框
        layer.close(index);
    });
});
// 获得用户登录的信息
function getUserInfor() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
         // 请求头配置对象
        // headers: {
        //     // 获取存储在local里面的数据
        //     Authorization: localStorage.getItem('token')||''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败')
            }
            // 渲染文本头像和图片头像
            renderAvatar(res.data);
        },
    });
    function renderAvatar(user) {
        //渲染文本
        // 第一个有就第一个优先，没有就换另外一个
        const name = user.nickname || user.username
        $('#welcome').html('欢迎&nbsp&nbsp' + name)
        // 渲染头像
        if (user.user_pic !== null) {
            $('.layui-nav-img').attr('src', user.user_pic).show();
            $('.text-avatar').hide();
        } 
        $('.layui-nav-img').hide();
        // 获取到用户名的第一字母并改为大写
        const first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
        $('.layui-nav-img').hide();
    }
}