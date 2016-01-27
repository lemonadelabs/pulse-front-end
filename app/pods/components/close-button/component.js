import Ember from 'ember';

export default Ember.Component.extend({
  classNames:['close-button'],
  actions:{
    close(){
      if(typeof this.get("onCloseAction") === "function"){
        this.get("onCloseAction")();
      }
      else {
        console.warn("Button needs a function 'onCloseAction'");
      }
    }
  }
});
