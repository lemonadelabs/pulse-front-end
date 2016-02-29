import Ember from 'ember';

export default Ember.Component.extend({
  actions:{
    showStakeholderList: function() {
      this.get("toggleStakeholderList")();
    }
  }
});
