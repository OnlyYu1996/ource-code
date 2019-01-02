var gulp = require('gulp');
var less = require('gulp-less');//less解析
var cssmin = require('gulp-cssmin');//压缩CSS
var uglify = require('gulp-uglify');//压缩JS
var concat = require('gulp-concat');//合并js文件
var connect = require('gulp-connect');//创建本地服务器
var imagemin = require('gulp-imagemin');//压缩图片
var open = require('open');//用于打开服务器
var autoprefixer=require('gulp-autoprefixer')//自动添加浏览器前缀
var htmlmin=require('gulp-htmlmin')//压缩html文件
var gulpRev=require('gulp-rev') //给文件后添加md5时间戳(防止浏览器缓存)

var app = {  // 定义目录
    srcPath:'src/',
    buildPath:'build/',
    distPath:'dist/'
}

/*把bower下载的前端框架放到我们项目当中*/
gulp.task('lib',function () {
    gulp.src(app.srcPath +'lib/**')
        .pipe(gulp.dest(app.buildPath+'lib'))
        .pipe(gulp.dest(app.distPath+'lib'))
        // 如果这个目录下面的东西改变了我就在浏览器里面刷新
        .pipe(connect.reload()) //当内容发生改变时， 重新加载。
});

/*2.定义任务 把所有html文件移动另一个位置*/
gulp.task('html',function () {
    /*要操作哪些文件 确定源文件地址*/
    gulp.src(app.srcPath+'**/*.html')  /*src下所有目录下的所有.html文件*/
        .pipe(htmlmin({collapseWhitespace: true}))//压缩html文件
        .pipe(gulp.dest(app.buildPath)) //gulp.dest 要把文件放到指定的目标位置
        .pipe(gulp.dest(app.distPath))
        .pipe(connect.reload()) //当内容发生改变时， 重新加载。
});
/*3.执行任务 通过命令行。gulp 任务名称*/
/*定义编译less任务  下载对应的插件 gulp-less
 * 把less文件转成css放到build
 * */
gulp.task('less',function () {
    gulp.src(app.srcPath+'css/**.less')
        // .pipe(concat('index.less'))
        .pipe(less())
        .pipe(autoprefixer({
            cascade: true, 
            remove:true 
        }))
        .pipe(gulp.dest(app.buildPath+'css/'))
        /*经过压缩，放到dist目录当中*/
        .pipe(cssmin())
        .pipe(gulp.dest(app.distPath+'css/'))
        .pipe(connect.reload())
});
gulp.task('css',function(){
    gulp.src(app.srcPath+'css/**/*.css')
        .pipe(autoprefixer({
            cascade: true, 
            remove:true 
        }))
        .pipe(gulp.dest(app.buildPath+'css/'))
        .pipe(cssmin())
        .pipe(gulp.dest(app.distPath+'css/'))
        .pipe(connect.reload())
})
/*合并js*/
gulp.task('js',function () {
    gulp.src(app.srcPath+'js/**/*.js')
        // .pipe(concat('index.js'))
        .pipe(gulp.dest(app.buildPath+'js/'))
        .pipe(uglify())
        .pipe(gulp.dest(app.distPath+'js/'))
        .pipe(connect.reload())
});

/*压缩图片*/
gulp.task('image',function () {
    gulp.src(app.srcPath+'images/**/*')
        .pipe(gulp.dest(app.buildPath+'images'))
        .pipe(imagemin())
        .pipe(gulp.dest(app.distPath+'images'))
        .pipe(connect.reload())
});

/*同时执行多个任务 [其它任务的名称]
 * 当前bulid时，会自动把数组当中的所有任务给执行了。
 * */
gulp.task('build',['less','html','js','image','lib','css']);


/*定义server任务
 * 搭建一个服务器。设置运行的构建目录
 * */
gulp.task('server',['build'],function () {
    /*设置服务器*/
    connect.server({
        root:[app.buildPath],//要运行哪个目录
        livereload:true,  //是否开启热更新。
        port:9999  //端口号
    })
    /*监听哪些文件，如果文件发生改变，就执行相应的任务*/
    gulp.watch(app.srcPath + 'lib/**/*',['lib']);
    gulp.watch(app.srcPath+'**/*.html',['html']);
    gulp.watch(app.srcPath+'js/**/*.js',['js']);
    gulp.watch(app.srcPath+'images/**/*',['image']);
    gulp.watch(app.srcPath+'style/**/*.less',['less']);
    gulp.watch(app.srcPath+'**/*.css',['css']);
    //通过浏览器把指定的地址 （http://localhost:9999）打开。
    open('http://localhost:9999');
});

/*定义默认任务
 * 直接执行gulp 会调用的任务
 * */
gulp.task('default',['server']);


