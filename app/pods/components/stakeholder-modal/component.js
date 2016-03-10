import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  classNames: ['stakeholder-modal','fancy-corners'],
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
    if(this.get("selectedStakeholder") !== undefined){
      var store = this.get('store');
      this.set("visible",true);
      this.set("ignore-pointer",false);
      var stakeholderData = store.peekRecord('stakeholder', this.get('selectedStakeholder.id'));
      this.set('stakeholderData', stakeholderData);
    }
  }.observes("selectedStakeholder")
});
