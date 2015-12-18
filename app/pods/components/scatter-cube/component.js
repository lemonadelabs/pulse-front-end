import Ember from 'ember';
import environment from './environment';

export default Ember.Component.extend({
  classNames: ['scatter-cube'],

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

  checkIfUpdatedTime: function ( ){
    var time = this.get('selectedTime')
    this._environment.updateTime(time)
  }.observes('selectedTime'),

  checkUndefinedStakeholder: function ( ){
    if(this.get('selectedStakeholder')===undefined){
      this._environment.noSelectedStakeholder()
    }
  }.observes('selectedStakeholder')
});
