import Ember from 'ember';
import environment from './environment';

export default Ember.Component.extend({
  classNames: ['scatter-cube'],

  didInsertElement() {
    this.initScatterCube()
  },

  initScatterCube: function () {
    this.set('_environment', environment(this))

    // first, set up everything in the scene that is not data dependant
    // console.log('asdf')



    this._environment.init({
      stakeholders : this.stakeholders,
      relationships : this.relationships,
      metadata : this.metadata,
      // stakeholderSnapshots : this.stakeholderSnapshots
    })

    this._environment.setupScatterCube()

    this._environment.populateCube({
      stakeholders : this.stakeholders,
      relationships : this.relationships,
      metadata : this.metadata,
      // stakeholderSnapshots : this.stakeholderSnapshots
    })

    this._environment.render()
  },

  updateSelectedStakeholder: function (shInfo) {
    this.get('updateStakeholder')(shInfo);
  },

  updateHoveredStakeholder: function (sHPoint) {
    this.set('hoveredStakeholder', sHPoint)
  },

  checkIfUpdatedTime: function (){
    var time = this.get('selectedTime')
    this._environment.updateTime(time)
  }.observes('selectedTime'),

  checkUndefinedStakeholder: function (){
    if(this.get('selectedStakeholder')===undefined){
      this._environment.noSelectedStakeholder()
    }
  }.observes('selectedStakeholder'),



  // put observers on all of the models, when they ar not null, do stuff




  onUpdateConnectionsView: function () {
    this._environment.connectionViewUpdated()
  }.observes('connectionView'),

  onUpdateDistributionView: function () {
    this._environment.distributionViewUpdated()
  }.observes('distributionView'),

  onUpdateHistoryView: function () {
    this._environment.historyViewUpdated()
  }.observes('historyView'),

  pauseRender: function () {
    this._environment.pauseRender()
  },

  resumeRender: function () {
    this._environment.resumeRender()
  },

});
