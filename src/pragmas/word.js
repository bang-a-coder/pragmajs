import Pragma from "./pragma.js"
import { crush } from "./helper.js"

export default class Word extends Pragma{
  constructor(element, parent, mark=null, index=0){
    super(element)
    this.parent = parent
    this.mark = mark || this.parent.mark
    this.cursor = 0
    this.index = index
    this.addKids()
    if (this.virgin()){
      let listeners = { "click": () => this.click(),
                        "mouseover": () => this.mouseover(),
                        "mouseout": () => this.mouseout() 
                      }
      this.setup_listeners(listeners)
    }
  }

  virgin() {
    return this.children.length == 0
  }
  click(){
    this.summon()
  }
  mouseover(){          
  }
  mouseout(){
  }
  pause(){
    if (this.virgin()) return this.summon()
        
    // word is not virgin
    this.stop_flag = true
    return new Promise((resolve, reject) => {
      this.stop_flag = false
      this.mark.pause()
      // this.children[this.cursor].summon()
      resolve()
    })
  }
  summon(){
    if (!this.virgin()) return false
    return this.parent.pause().then(() => {
      this.mark.mark(this)
      this.parent.cursor = this.index
    })
  }
  read(){
    // if (this.children.length - this.cursor > 0){
    if (this.children.length-1 - this.cursor > 0){
      if (this.stop_flag){
        return this.stop_flag = false
      }
      this.children[this.cursor].read().then(() =>{
        this.cursor += 1
        return this.read()
      })
    }else{
      if (this.virgin())
      return this.mark.guide(this)
    }
  }
  
  sibling(n){
    return this.parent ? this.parent.children[this.index+n] : null
  }
  next(){
    return this.sibling(1)
  }
  pre(){
    return this.sibling(-1)
  }
  same_line(n){
    return this.sibling(n) !=null && ((this.sibling(n).top() - this.top())**2 < 10 )
  }
  first_in_line(){
    return !this.same_line(-1)
  }
  last_in_line(){
    return !this.same_line(1)
  }
  time(){
    return (this.text().length)*50
  }
  addKids(){
    let index=0
    this.element.find("w").each((x, el)=>{
      if (el.textContent.length > 0){
        this.add(new Word(el, this, this.mark, index))
        index+=1
      }
    })
  } 
}