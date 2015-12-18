import Ember from 'ember';


export default Ember.Component.extend({
  selectedStakeholder: undefined,
  selectedTime: undefined,

  actions : {
    userDidSelectStakeholder(stakeHolder) {
      this.set('selectedStakeholder', stakeHolder)
    },

    userDidCloseStakeholderModal() {
      this.set('selectedStakeholder', undefined)
    },

    userDidChangeTime(newTime) {
      this.set('selectedTime',newTime)
    }

  }

});
