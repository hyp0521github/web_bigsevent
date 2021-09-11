$(function () {
    const form = layui.form;
    const layer = layui.layer;
    const value = $('#nickname').val();
    // 创建自己的规则
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '用户昵称必须在1-6个字符之间！'
            }
        }
    });
    initUserInfor();

    function initUserInfor() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                // 调用form.val为表单赋值
                form.val(
                    "formTest", res.data
                )
            }
        });
    };

    $('#reset').on('clcik', function (e) {
        // 阻止表单默认重置行为
        e.preventDefault();
        initUserInfor();
    });

    $('.layui-form').on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改信息失败')
                }
                layer.msg('修改信息成功')
                // 调用父页面的方法重新渲染头像和文本
                window.parent.getUserInfor();
            }
        });
    });
});
