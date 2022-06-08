var x = 10;

function a(x){
    return x * 10
}
console.log(a(10));
// 打包指令 --> webpak 檔名.js -d(開發模式) | -p(上線模式) | -d -w(開發監看模式)


// jQuery。要先安裝
// import $ from 'jquery';
import { gsap } from "gsap";
import Vue from "vue";


// vue
new Vue({
    el: "#app",
    data:{
        text: "logo"
    }
})


gsap.to('.logo', {
    duration: 1,
    x: 300,
    y: 10,
    repeat: -1,
    yoyo: true,
    rotation: 360,
})

// css&style loader 要先安裝
import './css/style.css';
import './css/header.css';
import './css/footer.css';
import './sass/main.scss';


$('body').css('background-color', "pink");