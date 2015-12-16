import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['stakeholder-modal'],
  classNameBindings: ['visible'],
  visible: true,
  actions:{
    close:function(){
      this.get("setStakeholderUndefined")();
      this.set("visible",false);
    }
  }
});
