import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['stakeholder-modal'],
  classNameBindings: ['visible','ignore-pointer'],
  visible: false,
  "ignore-pointer":true,
  actions:{
    close:function(){
      var self = this;
      this.set("visible",false);
      this.set("ignore-pointer",true);
      Ember.$("#close-button").blur();
      Ember.run.later(function(){
        self.get("setStakeholderUndefined")();
     }, 250);
    }
  },
  showModalOnSelection:function(){
    if(this.get("selectedStakeholder")!== undefined && this.get("visible") === false){
      this.set("visible",true);
      this.set("ignore-pointer",false);
    }
  }.observes("selectedStakeholder")
});
