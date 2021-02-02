import {Component, createElement} from './framework';
import {enableGesture} from './gesture';
import {Timeline, Animation} from './animation';
import {ease} from './ease';

import './style.css';

export class Carousel extends Component{
    constructor(){
        super();
        this.attributes = Object.create(null);
    }

    setAttribute(name, value){
        this.attributes[name] = value;
    }

    render(){
        this.root = document.createElement('div');
        this.root.classList.add('carousel');
        for(let record of this.attributes.src){
            // 直接使用 img 标签，默认会有拖曳效果
            let child = document.createElement('div');
            child.style.backgroundImage = `url('${record}')`;
            this.root.appendChild(child);
        }

        enableGesture(this.root);
        let timeline = new Timeline;
        timeline.start();

        let handler;

        let children = this.root.children;

        let position = 0;

        let t = 0;
        let ax = 0;

        this.root.addEventListener('start', event => {
            timeline.pause();
            clearInterval(handler);

            let progress = (Date.now() - t) / 1500;

            ax = ease(progress) * 500 - 500;
        });

        this.root.addEventListener('pan', event => {
            let x = event.clientX - event.startX - ax;

            let current = position - ((x - x % 500) / 500);

            /** 当前图片，还包括前后两张 */
            for(let offset of [-1, 0, 1]){
                let pos = current + offset;

                /** 保证在数量内，不会超出范围，而且还要保证不能为负数 */
                pos = (pos * children.length + children.length) % children.length;

                children[pos].style.transition = 'none';
                children[pos].style.transform = `translateX(${-pos * 500 + offset * 500 + x % 500}px)`;
            }

        });

        this.root.addEventListener('panend', event => {

            timeline.reset();
            timeline.start();

            let x = event.clientX - event.startX - ax;
            let current = position - ((x - x % 500) / 500);

            let direction = Math.round((x % 500) / 500);

            /** 当前图片，还包括前后两张 */
            for(let offset of [-1, 0, 1]){
                let pos = current + offset;

                /** 保证在数量内，不会超出范围 */
                pos = (pos * children.length + children.length) % children.length;

                children[pos].style.transition = 'none';

                timeline.add(new Animation(children[pos].style, 'transform', -pos * 500 + offset * 500 + x % 500, -pos * 500 + offset * 500 + direction % 500, 1500, 0, ease, v => `translateX(${v}px)`));
            }

        });

        let nextPicture = () => {
            let children = this.root.children;

            let nextIndex = (position + 1) % children.length;

            let current = children[position];
            let next = children[nextIndex];

            // next.style.transition = 'none';
            // next.style.transform = `translateX(${500 - nextIndex * 500}px)`;

            timeline.add(new Animation(current.style, 'transform', - position * 500, - ((position + 1) * 500)), 1500, 0, ease, v => `translateX(${v}px)`);
            timeline.add(new Animation(next.style, 'transform', - ((nextIndex - 1) * 500), - nextIndex * 500), 1500, 0, ease, v => `translateX(${v}px)`);

            position = nextIndex;
            
        }

        handler = setInterval(nextPicture, 1000);

        // this.root.addEventListener('mousedown', event => {
        //     let children = this.root.children;

        //     let startX = event.clientX;

        //     let move = event => {
        //         let x = event.clientX - startX;

        //         let current = position - ((x - x % 500) / 500);

        //         /** 当前图片，还包括前后两张 */
        //         for(let offset of [-1, 0, 1]){
        //             let pos = current + offset;

        //             /** 保证在数量内，不会超出范围 */
        //             pos = (pos + children.length) % children.length;

        //             children[pos].style.transition = 'none';
        //             children[pos].style.transform = `translateX(${-pos * 500 + offset * 500 + x % 500}px)`;
        //         }

        //         /* for(let child of children){
        //             child.style.transition = 'none';
        //             child.style.transform = `translateX(${-position * 500 + x}px)`;
        //         } */

        //     };

        //     let up = event => {
        //         let x = event.clientX - startX;
        //         position = position - Math.round(x / 500);

        //         for(let offset of [0, - Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]){
        //             let pos = position + offset;

        //             /** 保证在数量内，不会超出范围 */
        //             pos = (pos + children.length) % children.length;

        //             children[pos].style.transition = 'none';
        //             children[pos].style.transform = `translateX(${-pos * 500 + offset * 500 }px)`;
        //         }

        //         /* for(let child of children){
        //             child.style.transition = '';
        //             child.style.transform = `translateX(${-position * 500}px)`;
        //         }  */ 
        //         /** 即使移出浏览器外面，也可以监听到 */
        //         document.removeEventListener('mousemove', move);
        //         document.removeEventListener('mouseup', up);
        //     };

        //     document.addEventListener('mousemove', move);

        //     document.addEventListener('mouseup', up);
        // });

        

        /* let currentIndex = 0;

        setInterval(() => {
            let children = this.root.children;

            let nextIndex = (currentIndex + 1) % children.length;

            let current = children[currentIndex];
            let next = children[nextIndex];

            next.style.transition = 'none';
            next.style.transform = `translateX(${100 - nextIndex * 100}%)`;

            setTimeout(() => {
                next.style.transition = '';
                current.style.transform = `translateX(${-100 - currentIndex * 100}%)`;
                next.style.transform = `translateX(${- nextIndex * 100}%)`;

                currentIndex = nextIndex;
            }, 16);

            
            
        }, 1000);
 */
        return this.root;
    }

    mountTo(parent){
        parent.appendChild(this.render());
    }
}