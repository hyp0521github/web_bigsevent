$(function () {
    const layer = layui.layer;
    const form = layui.form;
    const laypage = layui.laypage;

    // 定义美化时间过滤器函数 
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);

        var  y = dt.getFullYear();
        var  m = padZero(dt.getMonth() + 1);
        var  d = padZero(dt.getDate());
        

        var  hh = padZero(dt.getHours());
        var  mm = padZero(dt.getMinutes());
        var  ss = padZero(dt.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数参数对象
    var q = {
        pagenum: 1, //默认被选中的分页
        pagesize: 2, //每页显示几条数据
        cate_id: '', //文章分类的id
        state: '' //文章的发布状态
    }
    // 发起请求获取文章列表数据
    initTable();
    // 获取下拉菜单的分类名称
    initCate();

    // 定义发起请求获取文章列表数据函数
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) { 
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 使用模版引擎渲染数据
                const html = template('article-tpl', res);
                $('tbody').empty().append(html);
                // 当获取完数据之后在调用渲染分页函数
                renderPage(res.total)
            }
        });
    };

    // 重新获取文章分类列表数据里面的分类名称
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return
                } else {
                    const html = template('cate-tpl', res);
                    $('[name=cate_id]').empty().html(html);
                    // 告诉layui重新渲染表单区域的ui结构
                    form.render();
                }
            }
        });
    };

    // 点击筛选按钮筛选相对应的内容
    $('.layui-form').on('submit', function (e) {
        //取消表单的默认提交行为
        e.preventDefault();
        // 重新定义q
        q.cate_id = $('[name=cate_id]').val(), //文章分类的id
        q.state = $('[name=state]').val() //文章的发布状态
        // 重新发起请求获取文章列表数据
        initTable();
    });

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage.render来渲染分页结构
        laypage.render({
            elem: 'pageBox', //分页id
            count: 10, //数据的总条数 total
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2,3,5,10],
            // 分页发生切换触发jump函数
            // 调用jump函数有2种方法
            // 1点击分页页码触发 first=underfind
            // 2调用laypage.render触发 first=true
            jump: function (obj, first) {
                //把最新的数据赋值给q
                q.pagenum = obj.curr;
                // 判断用哪种方法调用jump回调函数
                if (!first) {
                    // 根据最新的q获取相对应的数据列表，并渲染表格
                    initTable();
                }
            }
        });
    };

    // 点击删除文章
    $('tbody').on('click', '.btn-delete', function () {
        // 获取文章的id
        const id = $(this).attr('data-id');
        // 还有几个按钮就相当于还有几条数据
        const len = $('.btn-delete').length;
        layer.confirm('确定删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                       return layer.msg(res.message) 
                    }
                    layer.msg(res.message);
                    // 当数据删除完成后需要判断还有没有数据
                    // 如果没有数据的话就让p.pagenum-1
                    // 在重新获取数据
                    if (len === 1) {
                        // 如果len=1，那就证明页面在删除一条之后就没有数据了
                        // 页面值最小应该为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                        // if (q.pagenum <= 0) {
                        //     q.pagenum = 1
                        // }
                    }
                    // 根据最新的q获取相对应的数据列表，并渲染表格
                    initTable();
                }
            });
            layer.close(index);
        });
    });
});