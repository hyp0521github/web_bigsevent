
$(function () {
  const layer = layui.layer
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }
  // 1.3 创建裁剪区域
  $image.cropper(options)
  
  // 点击上传文件
  $('#btnUploadPhotos').on('click', function () {
    $('#files').click();
  });

  // 更换文件的裁剪区域
  $('#files').on('change', function (e) {
    var filelist = e.target.files;
    // 判断用户有没有选择文件
    if (filelist.length === 0) {
      return layer.msg('请选择您要上传的文件')
    }
    // 更换裁剪的图片

    // 1拿到用户选择的文件
    const imgfileList = e.target.files[0];
    // 2根据选择的文件，创建一个对应的 URL 地址：
    const imgURL = URL.createObjectURL(imgfileList)
    // 3先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域：
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', imgURL)     // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  });
  // 点击上传文件
  $('#btnUpload').on('click', function () {
    // 1拿到用户裁剪出来的图片
    var dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    // 2发起请求
    $.ajax({
      method: 'POST',
      url: '/my/update/avatar',
      data: {
        avatar: dataURL
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        } else {
          layer.msg(res.message)
          // 调用父页面的方法重新渲染头像和文本
          window.parent.getUserInfor();
        }
      }
    });
  });
});

  