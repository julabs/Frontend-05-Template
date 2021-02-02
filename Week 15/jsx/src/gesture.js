export class Dispatcher{
    constructor(element){
        this.element = element;
    }

    dispatch(type, properties){
        let event = new Event(type);
    
        for(let name in properties){
            event[name] = properties[name];
        }
    
        this.element.dispatchEvent(event);
    }
    

} 


export class Listener{
    constructor(element, recognizer){

        let handler;
        let startX, startY;
        let isTap = true;
        let isPan = false;
        let isPress = false;


        /** 只监听一次鼠标事件，因为如果多键同时按下，会重复触发 mouse 事件 */
        let isListeningMouse = false;

        element.addEventListener('mousedown', event => {

            /** 左键为 0，右键为 2，中键为 1，如果是多功能鼠标，可能会有 3，4 */
            // console.log(event.button);

            let context = Object.create(null);
            contexts.set(`mouse${1 << event.button}`, context);
            
            recognizer.start(event, context);

            const mousemove = event => {

                let button = 1;

                while(button <= event.buttons){

                    /** 按键按下才有效 */
                    if(button & event.buttons){
                        
                        // order of buttons & button property is not same
                        let key = button;

                        if(button === 2){
                            key = 4;
                        }else if(button === 4){
                            key = 2;
                        }

                        let context = contexts.get(`mouse${key}`);
                        recognizer.move(event, context);
                    }           

                    button = button << 1;
                }       
                
            };

            const mouseup = event => {
                let context = contexts.get(`mouse${1 << event.button}`);
                recognizer.end(event, context);
                contexts.delete(context);

                /** 如果没有任何一个键按下 */
                if(event.buttons === 0){
                    document.removeEventListener('mousemove', mousemove);
                    document.removeEventListener('mouseup', mouseup);
                    isListeningMouse = false;
                }

                
            };

            if(!isListeningMouse){
                document.addEventListener('mousemove', mousemove);
                document.addEventListener('mouseup', mouseup);

                isListeningMouse = true;
            }

            
        });

        let contexts = new Map();

        element.addEventListener('touchstart', event => {
            for(let touch of event.changedTouches){
                let context = Object.create(null);
                contexts.set(touch.identifier, context);
                recognizer.start(touch, context);
            }
        });

        element.addEventListener('touchmove', event => {
            for(let touch of event.changedTouches){
                let context = contexts.get(touch.identifier);
                recognizer.move(touch, context);
            }
        });

        element.addEventListener('touchend', event => {
            
            for(let touch of event.changedTouches){
                let context = contexts.get(touch.identifier);
                recognizer.end(touch, context);
                contexts.delete(touch.identifier);
            }
        });

        element.addEventListener('touchcancel', event => {
            
            for(let touch of event.changedTouches){
                let context = contexts.get(touch.identifier);
                recognizer.cancel(touch);
                contexts.delete(touch.identifier);
            }
        });




    }
}

export class Recognizer{
    constructor(dispatcher){
        this.dispatcher = dispatcher;
    }

    start(point, context){
    
        /** 使用 , 分开，表明这两个关系很紧密 */
        context.startX = point.clientX, context.startY = point.clientY;
        context.points = [{
            t: Date.now(),
            x: point.clientX,
            y: point.clientY
        }];
    
        context.isTap = true;
        context.isPan = false;
        context.isPress = false;
    
        context.handler = setTimeout(() => {
    
            context.isTap = false;
            context.isPan = false;
            context.isPress = true;
            context.handler = null;

            this.dispatcher.dispatch('press', Object.create(null));
        }, 500);
    }

    move(point, context){

        let dx = point.clientX - context.startX,
            dy = point.clientY - context.startY;
    
        /** 如果移动距离大于 10px */
        if(!context.isPan && (dx ** 2 + dy ** 2 > 100)){
            context.isTap = false;
            context.isPan = true;
            context.isPress = false;
            context.isVertical = Math.abs(dx) < Math.abs(dy);

            this.dispatcher.dispatch('panstart', Object.create(null, {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
                
            }));
    
            clearTimeout(context.handler);
        } 
    
        if(isPan){
            this.dispatcher.dispatch('pan', Object.create(null, {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
            }));
        }
    
        context.points = context.points.filter(point => Date.now() - point.t < 500);
    
        context.points.push({
            t: Date.now(),
            x: point.clientX,
            y: point.clientY
        });
    
        // console.log('move', point.clientX, point.clientY);
    }


    end(point, context){

        if(context.isTap){
            this.dispatcher.dispatch('tap', {});
            clearTimeout(context.handler);
        }

        if(context.isPress){
            // 不需要处理，只要知道按的是哪个元素就行了
            this.dispatcher.dispatch('press', {});
        }

        context.points = context.points.filter(point => Date.now() - point.t < 500);

        let d, v;

        if(!context.points.length){
            v = 0;
        }else{
            d = Math.sqrt((point.clientX - context.points[0].x) ** 2 + (point.clientY - context.points[0].y) ** 2);
            v = d / (Date.now() - context.points[0].t);
        }

        if(v > 1.5){
            context.isFlick = true;

            this.dispatcher.dispatch('panend', Object.create(null, {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick,
                velocity: v
            }));

        }else{
            context.isFlick = false;
        }

        if(context.isPan){
            this.dispatcher.dispatch('pan', Object.create(null, {
                startX: context.startX,
                startY: context.startY,
                clientX: point.clientX,
                clientY: point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick
            }));
        }

    }

    cancel(point, context){
        clearTimeout(context.handler);
        this.dispatcher.dispatch('cancel', Object.create(null, {
            startX: context.startX,
            startY: context.startY,
            clientX: point.clientX,
            clientY: point.clientY,
            isVertical: context.isVertical,
            isFlick: context.isFlick
        }));
    };
    
}

export function enableGesture(element){
    new Listener(element, new Recognizer(new Dispatcher(element)));
}