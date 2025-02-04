export class API<T> {
    host: T;
    /**
     *
     */
    constructor(host: T) {
      this.host = host;
    }
  self(cb:(self:this)=>void){
    cb(this);
  }
  getHost():T{
    return this.host;
  }
}

export class ElementAPI<T extends HTMLElement> extends API<T>{
    constructor(host:T){
        super(host);
    }
    remove(){
      this.host.parentElement?.removeChild(this.host);
    }
    css<T extends (CSSStyleDeclaration | undefined)>(styles: T = (undefined as T)):
     T extends undefined ? API<CSSStyleDeclaration> : this {
      if (styles === undefined) return new API<CSSStyleDeclaration>(
        this.host.style
        ) as (T extends undefined ? API<CSSStyleDeclaration> : this);
      Object.assign(this.host.style,styles);
      return this as (T extends undefined ? API<CSSStyleDeclaration> : this);
    }
    
    first(){
      return new ElementAPI(this.host.children[0] as HTMLElement);
    }

    last(){
      return new ElementAPI(this.host.children[(this.host.children.length - 1 )] as HTMLElement);
    }

    nth_child(n:number){
      return new ElementAPI(this.host.children[n - 1] as HTMLElement);
    }
}



export class GroupingAPI<T extends NodeListOf<Element>> extends API<T>{
    host: T;
    constructor(host: T){
        super(host);
        this.host = host
    };

    first(){
        return new ElementAPI(this.host[0] as HTMLElement);
    }
}
export class DOMAPI extends API<undefined>{
  constructor(){
    super(undefined);
  }
  querySelectorAll(query:string) {
    return new GroupingAPI(document.querySelectorAll(query));
  }
  getElementById(id:string){
    const element = document.getElementById(id);
    if (!element) {
      return null
    }
    return new ElementAPI(element);
  }
}
export default function $() {
    return new DOMAPI();
}
