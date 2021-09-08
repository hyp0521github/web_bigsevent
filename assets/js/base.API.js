// 每次调用请求函数时会先调用ajaxPrefilter这个函数
// 在这个函数中可以拿到我么给ajax提供的配置对象
$.ajaxPrefilter( function(options) { 
    // console.log(options.url);
    //再发起真正ajax请求之前 拼接我们的url地址
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    
    //统一为有权限的接口，设置headers请求头

    // 判断有没有/my/这个字符
    if (options.url.indexOf('/my/') !== -1) {
        options.headers =
        {
            Authorization: localStorage.getItem('token') || ''
        }
    }


    // 不管失败还是成功都会调用 complete
     options.complete = function (res) {
        console.log(res.responseJSON);
        if (res.responseJSON.status === 1&& res.responseJSON.message === '身份认证失败！') {
            // 清空token
             localStorage.removeItem('token');
             //跳转login页面
             location.href = './login.html';
        };
    };
 });