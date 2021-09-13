// 获取模版引擎渲染数据
$(function () {
    const layer = layui.layer;
    const form = layui.form;
    initArtCateList();
    let addindex = null;

    // 点击添加列表显示出弹出层
    $('#btnAddCate').on('click', function () {
        addindex = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    });

    //通过代理形式为form表单添加点击事件
    $('body').on('submit', '#add-form', function (e) {
        // 取消表单的默认提交行为
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            // data: {
            //     name: $('body #addname').val(),
            //     alias: $('body #addaliase').val()
            // },
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    layer.close(addindex);
                    return layer.msg(res.message);
                }
                layer.msg(res.message)
                initArtCateList();
                //关闭弹出层
                layer.close(addindex);
            }
        });
    });

    let editindex = null;
    // 点击弹出编辑框
    $('tbody').on('click', '#btnEditCate', function () {
        editindex = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '编辑文章分类',
            content: $('#dialog-edit').html()
        });
        //点击获取id 在之前用模版引擎获取文章列表数据里面的编辑框自定义一个id
        const id = $(this).attr('data-id');
        //发起请求获取对应分类数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                //快速为表单填充获取的数据 给form表单添加一个lay-filter="edit-form"
                form.val('edit-form', res.data)
            }
        });
    });

    // 点击修改文章分类数据
    $('body').on('submit', '#edit-form', function (e) {
        //取消表单的默认提交行为
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 通过索引关闭弹出层
                layer.close(editindex);
                initArtCateList();
            }
        });
    });

    // 点击删除文章分类数据
    $('tbody').on('click', '#btnDeleteCate', function () {
        //1获取到点击的id
        const Id = $(this).attr('data-id');
        //2点击显示警示框
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            //3发起请求删除对应的文章列表
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message);
                    layer.close(index);
                    initArtCateList()
                }
            });
        });
    });

    // 获取文章列表数据
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取列表失败')
                } else {
                    const html = template('tpl-table', res);
                    $('tbody').empty().append(html);
                }
            }
        });
    };
});