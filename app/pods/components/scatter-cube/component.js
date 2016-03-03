import Ember from 'ember';
import Environment from './environment';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  stakeholderFilter: Ember.inject.service(),

  classNames: ['scatter-cube'],

  didInsertElement() {
    var self = this
    this.initScatterCube()

    var stakeholderFilter = this.get('stakeholderFilter')
    stakeholderFilter.on('showFocussedStakeholders', function (focussedStakeholders) {
      console.log(focussedStakeholders)
      self.environment.foccussedStakeholdersUpdated({ focussedStakeholders : focussedStakeholders })
    })
  },

  removeStakeholderFilter: function () {
    if (!this.get('focusOnStakeholders')) {
      this.environment.foccussedStakeholdersUpdated( { focussedStakeholders : undefined } )
    }
  }.observes('focusOnStakeholders'),

  initScatterCube: function () {
    var environment = new Environment(this)
    this.set('environment', environment)

    this.environment.init()
    this.environment.setupScatterCube({ project : this.project })
    this.environment.initDistributionCloud({ getVotes : this.getVotes.bind(this) })
    this.environment.render()
  },

  getVotes: function (opts) {
    return Ember.$.getJSON('projects/' +  opts.project_id + '/stakeholders/' + opts.stakeholder_id + '/snapshots/votes?week=' + opts.week)
  },

   onStakeholderData: function () {

    this.environment.initPointCloud({
      project : this.project,
      stakeholders : this.stakeholders,
      selectedTime : this.get('selectedTime')
    })
  }.observes('stakeholders'),

  onConnectionsData: function () {
    var connections = this.get('connections')
    this.environment.initConnections({
      connections : connections
    })
  }.observes('connections'),

  getSnapshotFromStakeholderId: function (id) { // get the snapshot somehow
    var store = this.get('store')
    var stakeholder = store.peekRecord('stakeholder', id)
    return stakeholder.get
    // store.
  },

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
