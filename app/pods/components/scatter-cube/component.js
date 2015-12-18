import Ember from 'ember';
import environment from './environment';

export default Ember.Component.extend({
  classNames: ['scatter-cube'],
  
  didInsertElement() {
    this.initScatterCube()
  },

  initScatterCube: function () {
    // var _environment = environment(this)
    // _environment.init()
    // _environment.render()
    this.set('_environment', environment(this))
    this._environment.init()
    this._environment.render()
  },

  // selectedStakeholder: this.selectedStakeholder,

  updateSelectedStakeholder: function (shInfo) {
    this.get('updateStakeholder')(shInfo);
  },

  checkUndefinedStakeholder: function ( ){
    if(this.get('selectedStakeholder')===undefined){
      this._environment.noSelectedStakeholder()
    }
  }.observes('selectedStakeholder')
});
