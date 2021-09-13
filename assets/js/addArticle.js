$(function () {
    const layer = layui.layer
    const form = layui.form
    // 获取文章类别
    initArticle();
    // 初始化富文本编辑器
    initEditor();
    // 实现基本裁剪效果：
    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 获取文章类别
    function initArticle() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.massage)
                }
                // 调用模版引擎渲染ui结构
                const html = template('article-tpl', res);
                $('[name=cate_id]').empty().append(html);
                // 告诉lauyi重新获取
                form.render();
            }
        });
    };

    // 点击选择封面打开文件
    $('#btnArticle').on('click', function () {
        // 调用文件的点击方法
        $('#files').click();
    });

    // 更换文件的裁剪区域
    $('#files').on('change', function (e) {
        // console.log(e);
        // console.log(e.target.files);
        const fileList = e.target.files
        // 判断有没有选择文件
        if (fileList.length === 0) {
            return layer.msg('请选择要上传的文件')
        }
        // 更换裁剪的图片
        // 1拿到用户选择的文件
        const imgfiles = fileList[0];
        // 2根据选择的文件，创建一个对应的 URL 地址：
        const imgURL = URL.createObjectURL(imgfiles);
        // 3先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', imgURL)     // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    });

    // 定义文章发布状态
    let art_state = '草稿';

    // 点击发布按钮改变状态值
    $('#btnAddArticle').on('click', function () {
        art_state = '已发布'
    })

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
                url: '/my/article/add',
                data: formData,
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('发表文章成功');
                    location.href = '/home/aticlelist.html'
                }
            });
        };      
        // forEach循环 v是属性，k是值
        // formData.forEach(function (v, k) {
        //     console.log(v,k);
        // })
    });
});