//子线程
const util = require('./util.js')

worker.postMessage({
  //给主线程传送拿回来的图片
  res:'finish'
})

worker.onMessage((msg) => {
  //接受主线程传来的图片地址
  var img_src_list = []

  for (var i = 0, h = msg.imgsrc_list.length; i < h; i++) {
    img_src_list.push(msg.imgsrc_list[i][0])
  }
  util.request_one_img(img_src_list)
  /*for (var i = 0, h = msg.imgsrc_list.length; i < h; i++) {
    for(var j = 0, k = msg.imgsrc_list[i].length; j<k; j++){
      
    }
  }*/
})
