import Ember from 'ember';
import environment from './environment';

export default Ember.Component.extend({

  didInsertElement() {
    this.initScatterCube()
  },

  initScatterCube: function () {
    this.set('_environment', environment(this))
    this._environment.init({
      stakeholders : this.stakeholders,
      relationships : this.relationships
    })
    this._environment.render()
  },

  updateSelectedStakeholder: function (shInfo) {
    this.get('updateStakeholder')(shInfo);
  },

  checkUndefinedStakeholder: function ( ){
    if(this.get('selectedStakeholder')===undefined){
      this._environment.noSelectedStakeholder()
    }
  }.observes('selectedStakeholder')
});
