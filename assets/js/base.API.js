// 每次调用请求函数时会先调用ajaxPrefilter这个函数
// 在这个函数中可以拿到我么给ajax提供的配置对象
$.ajaxPrefilter( function(options) { 
    // console.log(options.url);
    //再发起真正ajax请求之前 拼接我们的url地址
    options.url = 'http://api-breakingnews-web.itheima.net/'+ options.url
 });