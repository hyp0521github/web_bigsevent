$(function () {
    // 通过代理事件点击编辑修改文章内容
    $('tbody').on('click', '#btnArticleEdit', function () {
        location.href = '/Article management/editArticle.html';
        // 获取id
        const id = $(this).attr('data-id');

        // 根据id获取文章详情
        initArticle()

        // 定义获取文章详情函数
        function initArticle() {
            $.ajax({
                method: 'GET',
                url: '/my/article/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message);
                    };
                    assignmentArticle(res.data.title, res.data.cate_id, res.data.content, cover_img)
                }
            });
        }
    });

    // 通过得到的数据给修改文章赋值
    function assignmentArticle(title, cate_id, content, cover_img) {
        $('[name=title]').val(title);
        $('[name=cate_id]').val(cate_id);
        $('[name=content]').val(content);
        $('#image').attr('src', cover_img);
    };

    // 1. 初始化图片裁剪器
    var $image = $('#image');

    // 定义文章发布状态
    let art_state = '草稿';

    // 点击发布按钮改变状态值
    $('#btnAddArticle').on('click', function () {
        art_state = '已发布'
    });

    //监听表单提交事件
    $('#formAddArticle').on('submit', function (e) {
        // 1取消表单默认提交行为
        e.preventDefault();
        // 2创建form表单
        const formData = new FormData($(this)[0]);
        // 向表单里面追加文章发布状态
        formData.append('state', art_state);
        //4将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', {//创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5.向表单里面追加图片文件
                formData.append('cover_img', blob);
                // 发起ajax请求
                publishArticle(formData);
            });
        // 定义一个发布文章的函数
        function publishArticle(formData) {
            $.ajax({
                method: 'POST',
                url: '/my/article/edit',
                data: formData,
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('修改文章成功');
                    location.href = '/home/aticlelist.html'
                }
            });
        };      
    });
});