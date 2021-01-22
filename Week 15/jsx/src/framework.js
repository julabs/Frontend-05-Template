/**
 * 
 * @param {string} type 
 * @param {object} attributes 
 * @param  {...HTMLElement | Text} children 
 * @returns {HTMLElement | Text}
 */
export function createElement(type, attributes, ...children){

    let element = typeof(type) === 'string' ? new ElementWrapper(type) : new type;
    for(let name in attributes){
        element.setAttribute(name, attributes[name]);
    }

    for(let child of children){
        if(typeof child === 'string'){
            child = new TextWrapper(child);
        }
        element.appendChild(child);
    }

    return element;

}

export class Component{
    constructor(){
    }

    /**
     * 
     * @param {string} name 
     * @param {string} value 
     */
    setAttribute(name, value){
        this.root.setAttribute(name, value);
    }

    appendChild(child){
        child.mountTo(this.root);
    }

    /**
     * 
     * @param {HTMLElement} parent 
     */
    mountTo(parent){
        parent.appendChild(this.root);
    }
}

class ElementWrapper extends Component{

    /**
     * 
     * @param {string} type 
     */
    constructor(type){
        this.root = document.createElement(type);
    }
}

class TextWrapper extends Component{

    /**
     * 
     * @param {string} type 
     */
    constructor(content){
        this.root = document.createTextNode(content);
    }
}
