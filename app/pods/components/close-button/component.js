import Ember from 'ember';

export default Ember.Component.extend({
  actions:{
    close(){
      console.log("get the onCloseAction and run it");
      if(typeof this.get("onCloseAction") === "function"){
        this.get("onCloseAction")();
      }
      else {
        console.warn("Button needs a function 'onCloseAction'");
      }
    }
  }
});
