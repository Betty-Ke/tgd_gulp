var x = 10;

function a(x){
    return x * 10
}
console.log(a(10));
// 打包指令 --> webpak 檔名.js -d(開發模式) | -p(上線模式) | -d -w(開發監看模式)


// jQuery。要先安裝
import $ from 'jquery';
import './css/style.css';
import './css/header.css';
import './css/footer.css';

$('body').css('background-color', "pink");