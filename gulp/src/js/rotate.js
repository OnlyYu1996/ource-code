$(function() {
  //背景canvas
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  var h = canvas.height;
  var w = canvas.width;
  var part_count = 200; //定义粒子层的数量
  var P = [];
  var x, y;
  var centerX = w * 0.45,
    centerY = h * 0.37; //用于定义旋转中心点
  var part = function(x, y, speed, dist) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.dist = dist;
  };
  function init() {
    var x, y, speed, dist;
    for (var i = 0; i < part_count; i++) {
      dist = part_count / 10 + i;
      speed = 1;
      P.push(new part(x, y, speed, dist));
    }
  }
  init();
  function bg() {
    ctx.fillStyle = "#211a1f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  function draw() {
    //i 为 part_count
    for (var i = 0; i < P.length; i++) {
      var p = P[i];
      p.speed += 0.006; // 旋转的速度
      p.x = centerX + Math.sin(-(i + p.speed)) * (p.dist * i * 0.02);
      p.y = centerY + Math.cos(-(i + p.speed)) * (p.dist * i * 0.01);
      if (i < P.length * 0.1) {
        ctx.fillStyle = "red";
      } else if (P.length * 0.1 < i && i < P.length * 0.2) {
        ctx.fillStyle = "#a36912";
      } else if (P.length * 0.2 < i && i < P.length * 0.4) {
        ctx.fillStyle = "#586125";
      } else if (P.length * 0.4 < i && i < P.length * 0.6) {
        ctx.fillStyle = "#28439c";
      } else if (P.length * 0.6 < i && i < P.length) {
        ctx.fillStyle = "#666";
      }
      ctx.fillRect(p.x, p.y, 3, 3); //绘制小点
    }
  }
  function loop() {
    bg();
    draw();
    window.requestAnimationFrame(loop); //下一帧开始时调用指定函数
  }
  loop();
  function resize() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    centerX = window.innerWidth * 0.45;
    centerY = window.innerHeight * 0.37;
  }
  window.onresize = resize; //窗口变化时执行

  // 菜单动画
  //1、鼠标滑动（通过Y轴差值定义routerZ的值）

  //获取外圈的数量
  var blocksSize = $(".future_block").size();
  //计算出平均的间隔
  var deg = 360 / blocksSize;
  //设置初始Z轴旋转
  // var x = 0;
  var y = 0;
  // $(document)
  //   .mousedown(function(e) {
  //     /*获取当前鼠标的坐标*/
  //     // console.log(1)
  //     // var startX = e.clientX;
  //     var startY = e.clientY;
  //     $(this).bind("mousemove", function(e) {
  //       // var endX = e.clientX;
  //       var endY = e.clientY;

  //       /*两次坐标之间的距离*/
  //       // x += (endX - startX)*0.05;
  //       y += (endY - startY) * 0.01;
  //       console.log(y);
  //       //禁止拖拽
  //       $(this).attr("ondragstart", "return false");
  //       $(".blocks").css({
  //         transform:
  //           "perspective(1000px) rotateZ(" +
  //           y +
  //           "deg) translateX(540px) translateY(-45%) ",
  //       transformOrigin: "-5% -30%"
  //       });
  //     });

  //     /*更新开始鼠标坐标*/
  //     startX = e.clientX;
  //     startY = e.clientY;
  //   })
  //   .mouseup(function() {
  //     $(this).unbind("mousemove");
  //   });

  //2、通过鼠标滚轮定义routerZ的值
  //① 用原生JS实现
  function handle(event,y) {
    if (event.wheelDelta||event.detail) {
      // console.log(y)
      $(".blocks").css({
        transform:
          "perspective(1000px) rotateZ(" +
          y +
          "deg) translateX(540px) translateY(-45%) ",
        transformOrigin: "-5% -30%"
      });
    }
  }
  function wheel(event) {
    //兼容IE
      event =event||window.event;
    //IE、Opera、Safari、Chrome使用wheelDelta表示滚轮上下，只取±120
    if (event.wheelDelta) {
      y += event.wheelDelta / 24;
      //兼容欧鹏浏览器
      if (window.opera){
        y = -y;
      }
    }
    //Firefox 使用detail来表示滚轮上下，取值为±3
    else if (event.detail) {
      y -= -event.detail / 0.6;
    }
    if (y){
      handle(event,y);
    }
  }
  //注册事件
  //Firefox使用addEventListener添加滚轮事件
  if (window.addEventListener){
    window.addEventListener("DOMMouseScroll", wheel, false);
  }
  //其中除Firefox外其余均可使用HTML DOM方式添加事件
  window.onmousewheel = document.onmousewheel = wheel; //IE/Opera/Chrome...

  // ② 用JQuery实现

  // windowAddMouseWheel();
  // function windowAddMouseWheel() {
  //     var scrollFunc = function (e) {
  //         e = e || window.event;
  //         if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件
  //             y += e.wheelDelta / 24;
  //         } else if (e.detail) {  //Firefox滑轮事件
  //             y -= -e.detail / 0.6;
  //         }
  //         if(y){
  //           if (e.wheelDelta||e.detail) {
  //             //     console.log(y)
  //                 $(".blocks").css({
  //                   transform:
  //                     "perspective(1000px) rotateZ(" +
  //                     y +
  //                     "deg) translateX(540px) translateY(-45%) ",
  //                   transformOrigin: "-5% -30%"
  //                 });
  //               }
  //         }
  //     };
  //     //给页面绑定滑轮滚动事件
  //     if (document.addEventListener) {
  //         document.addEventListener('DOMMouseScroll', scrollFunc, false);
  //     }
  // //滚动滑轮触发scrollFunc方法
  //     window.onmousewheel = document.onmousewheel = scrollFunc;
  // }
  
});
