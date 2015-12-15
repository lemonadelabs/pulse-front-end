import Ember from 'ember';
import environment from './environment';

export default Ember.Component.extend({

  didInsertElement() {
    this.initScatterCube()
  },

  initScatterCube: function () {
    var _environment = environment(this)
    _environment.init()
    _environment.render()
  },

  // selectedStakeholder: this.selectedStakeholder,

  updateSelectedStakeholder: function (shInfo) {
    this.set('selectedStakeholder', shInfo)
  }
});
