import {enableGesture} from './gesture';

enableGesture(document.documentElement);

document.documentElement.addEventListener('tap', (event) => {
    console.log('tap event trigger');
    console.log(event);
});

document.documentElement.addEventListener('oncontextmenu', (event) => {
    event.preventDefault();
});