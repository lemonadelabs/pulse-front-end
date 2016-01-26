import Ember from 'ember';

export default Ember.Component.extend({
  classNames:["stakeholder-list"],
  actions:{
    closeStakeholderList:function(){
      console.log("hide list");
      this.get("toggleStakeholderList")();
    }
  }
});
