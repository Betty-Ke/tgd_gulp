
const {
    src,
    dest,
    series,
    parallel,
    watch
} = require('gulp');

// test console 列印終端機上
function testlog(cb){
    console.log("hello gulp");
    cb(); // call back: 告訴他function已結束
}

exports.log = testlog;
// --> 終端機執行 gulp log

// src dest 複製檔案到...
function movefile(){
    // return src("./index.html").pipe(dest("html"));
    return src("src/*.html").pipe(dest("html")); // 根目錄底下所有html檔複製到html資料夾底下(不用自己建html資料夾)
}

exports.movehtml = movefile;
// --> 終端機執行 gulp movehtml

function moveimages(){
    return src(["./src/images/*.*", "./src/images/**/*.*"]).pipe(dest("dist/images"));
}

exports.moveimgs = moveimages;


// 同步跟異步 parallel / series

function taskA(cb){
    console.log("A 任務");
    cb();
}

function taskB(cb){
    console.log("B 任務");
    cb();
}

exports.async = series(taskA, taskB);
exports.sync = parallel(taskA, taskB);


// 改名
const rename = require('gulp-rename');

// min css
const cleanCSS = require('gulp-clean-css'); // require: 套件導入
function minicss(){
    return src("src/css/*.css")
    .pipe(cleanCSS({compatibility: 'ie10'}))  // 套件使用: 壓縮css {compatibility: 'ie10'} 此敘述為版本可省
    .pipe(rename({
        extname: ".min.css"                   // rename 方法之一: 修改副檔名
    }))                                       // rename
    .pipe(dest("dist/css"));
}

exports.css = minicss;

// min js 壓縮js及檢查語法
const uglify = require('gulp-uglify');
function minijs(){
    return src("src/js/*.js")
    .pipe(uglify())
    .pipe(rename({
        extname: ".min.js"
    }))
    .pipe(dest("dist/js"));
}

exports.js = minijs;


// SourceMap 讓 css 文件可以追朔 sass
const sourcemaps = require('gulp-sourcemaps');
// sass 編譯
const sass = require('gulp-sass')(require('sass'));
// 解決跨瀏覽器的問題
const autoprefixer = require('gulp-autoprefixer');

function styleSass(){
    return src("src/sass/*.scss")
    .pipe(sourcemaps.init())
    // .pipe(sass.sync().on("error", sass.logError)) 
    .pipe(sass({outputStyle: 'compressed'}).on("error", sass.logError)) // 壓縮
    // .pipe(cleanCSS())                           // 可以再壓縮
    // .pipe(rename({
    //     extname: ".min.css"                     // 可以再更名
    // }))
    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(dest("./dist/css"));
}

exports.style = styleSass;


// html template
const fileinclude = require('gulp-file-include');

// exports.html =                       // 同步執行(118)要改寫成117
    function includeHTML() {
    return src('src/*.html')            // 來源
        .pipe(fileinclude({
            prefix: '@@',           // 前贅字 可修改
            basepath: '@file'
        }))
        .pipe(dest('dist'));        // 目的地
}



exports.html = includeHTML;                     // 任務輸出 js module
exports.all = parallel(includeHTML, styleSass, minijs); // 同步


// 監看
function watchFiles(){
    // watch(["路徑1", "路徑2"], callbackfunction);  ctrl+c 停止監看
    watch(["src/sass/*.scss", "src/sass/**/*.scss"], styleSass);  // sass
    watch(["src/*.html", "src/layout/*.html"], includeHTML);  // html
    watch("./src/js/*.js", minijs);  // JS
    watch(["./src/images/*.*", "./src/images/**/*.*"], moveimages); // images
}
// exports.watch = watchFiles;

// 先執行同時打包(sass/html/js/images編譯)再執行監看
exports.packagewatch = series(parallel(styleSass, includeHTML, minijs, moveimages), watchFiles); 


// 瀏覽器同步
const browserSync = require('browser-sync');
const reload = browserSync.reload;

function browser(done) {
    browserSync.init({
        server: {
            baseDir: "./dist",      // 找到dist資料夾
            index: "index.html"
        },
        port: 3000
    });

    // browserSync 會順便監看
    watch(["src/sass/*.scss", "src/sass/**/*.scss"], styleSass).on("change", reload);  // 綁定事件onchange --> 有變動就會同步更新瀏覽器
    watch(["src/*.html", "src/layout/*.html"], includeHTML).on("change", reload);
    watch("./src/js/*.js", minijs).on("change", reload);
    watch(["./src/images/*.*", "./src/images/**/*.*"], moveimages).on("change", reload);

    done(); // 完成
}

exports.default = series(parallel(styleSass, includeHTML, minijs, moveimages), browser);  // 執行輸入 --> gult ， 因為取名為default

