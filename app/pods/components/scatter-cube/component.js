import Ember from 'ember';
import Environment from './environment';

export default Ember.Component.extend({
  store: Ember.inject.service(),

  classNames: ['scatter-cube'],

  didInsertElement() {
    this.initScatterCube()
  },
  initScatterCube: function () {
    var stakeholdersRecords



    var environment = new Environment(this)
    this.set('environment', environment)

    this.environment.init()
    this.environment.setupScatterCube({project : this.project})
    this.environment.render()
  },

   onStakeholderData: function () {
    var time = this.get('selectedTime')

    this.environment.initPointCloud({
      project : this.project,
      stakeholders : this.stakeholders,
      selectedTime : this.selectedTime
    })
  }.observes('stakeholders'),

  onConnectionsData: function () {
    var connections = this.get('connections')
    this.environment.initConnections({
      connections : connections
    })
  }.observes('connections'),

  updateSelectedStakeholder: function (shInfo) {
    this.get('updateStakeholder')(shInfo);
  },

  updateHoveredStakeholder: function (sHPoint) {
    this.set('hoveredStakeholder', sHPoint)
  },

  checkIfUpdatedTime: function (){
    var time = this.get('selectedTime')
    this.environment.updateTime(time)
  }.observes('selectedTime'),

  checkUndefinedStakeholder: function (){
    if(this.get('selectedStakeholder')===undefined){
      this.environment.noSelectedStakeholder()
    }
  }.observes('selectedStakeholder'),

  onUpdateConnectionsView: function () {
    this.environment.connectionViewUpdated()
  }.observes('connectionView'),

  onUpdateDistributionView: function () {
    this.environment.distributionViewUpdated()
  }.observes('distributionView'),

  onUpdateHistoryView: function () {
    this.environment.historyViewUpdated()
  }.observes('historyView'),

  pauseRender: function () {
    this.environment.pauseRender()
  },

  resumeRender: function () {
    this.environment.resumeRender()
  },

});
