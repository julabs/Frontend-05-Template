import { Timeline , Animation} from "./animation";
import {ease, easeIn} from './ease'

let tl = new Timeline();


tl.add(new Animation(document.querySelector('#el').style, 'transform', 0, 500, 2000, 0, easeIn, v => {console.log('v:', v);return `translateX(${v}px)`}));
document.querySelector('#el2').style.transition = 'transform ease-in 2s';
document.querySelector('#el2').style.transform = 'translateX(500px)';
tl.start();

document.querySelector('#pause-btn').addEventListener('click', () => {tl.pause()});
document.querySelector('#resume-btn').addEventListener('click', () => {tl.resume()});
