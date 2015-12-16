import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['stakeholder-modal'],
  classNameBindings: ['visible'],
  visible: false,
  actions:{
    close:function(){
      this.get("setStakeholderUndefined")();
      this.set("visible",false);
    }
  },
  showModalOnSelection:function(){
    if(this.get("selectedStakeholder")!== undefined && this.get("visible") === false){
      this.set("visible",true);
    }
  }.observes("selectedStakeholder")
});
