import {Component, createElement} from './framework';
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

        let position = 0;

        this.root.addEventListener('mousedown', event => {
            let children = this.root.children;

            let startX = event.clientX;

            let move = event => {
                let x = event.clientX - startX;

                let current = position - ((x - x % 500) / 500);

                /** 当前图片，还包括前后两张 */
                for(let offset of [-1, 0, 1]){
                    let pos = current + offset;

                    /** 保证在数量内，不会超出范围 */
                    pos = (pos + children.length) % children.length;

                    children[pos].style.transition = 'none';
                    children[pos].style.transform = `translateX(${-pos * 500 + offset * 500 + x % 500}px)`;
                }

                /* for(let child of children){
                    child.style.transition = 'none';
                    child.style.transform = `translateX(${-position * 500 + x}px)`;
                } */

            };

            let up = event => {
                let x = event.clientX - startX;
                position = position - Math.round(x / 500);

                for(let offset of [0, - Math.sign(Math.round(x / 500) - x + 250 * Math.sign(x))]){
                    let pos = position + offset;

                    /** 保证在数量内，不会超出范围 */
                    pos = (pos + children.length) % children.length;

                    children[pos].style.transition = 'none';
                    children[pos].style.transform = `translateX(${-pos * 500 + offset * 500 }px)`;
                }

                /* for(let child of children){
                    child.style.transition = '';
                    child.style.transform = `translateX(${-position * 500}px)`;
                }  */ 
                /** 即使移出浏览器外面，也可以监听到 */
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', up);
            };

            document.addEventListener('mousemove', move);

            document.addEventListener('mouseup', up);
        });

        

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