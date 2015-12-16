import Ember from 'ember';


export default Ember.Component.extend({
  selectedStakeholder: undefined,

  actions : {
    userDidSelectStakeholder(stakeHolder) {
      this.set('selectedStakeholder', stakeHolder)
    },

    userDidCloseStakeholderModal() {
      this.set('selectedStakeholder', undefined)
    }

  }

});
