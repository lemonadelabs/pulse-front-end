import Ember from 'ember';
import Environment from './environment';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  stakeholderFilter: Ember.inject.service(),
  loaded:false,

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

  initScatterCube: function () {
    var self = this
    var environment = new Environment(this)
    this.set('environment', environment)

    this.environment.init()
    this.environment.render()
    self.environment.setupScatterCube({ project : this.project })
    this.environment.initConnections({ getConnections : this.getConnections })
    this.environment.initDistributionCloud({ getVotes : this.getVotes })
  },

  onStakeholderData: function () {
    this.environment.initPointCloud({
      project : this.project,
      stakeholders : this.stakeholders,
      selectedTime : this.get('selectedTime')
    })
  }.observes('stakeholders'),

  removeStakeholderFilter: function () {
    if (!this.get('focusOnStakeholders')) {
      this.environment.foccussedStakeholdersUpdated( { focussedStakeholders : undefined } )
    }
  }.observes('focusOnStakeholders'),

  getVotes: function (opts) {
    return Ember.$.getJSON('api/projects/' +  opts.projectId + '/stakeholders/' + opts.stakeholderId + '/votes?week=' + opts.week)
  },

  getConnections: function (opts) {
    return Ember.$.getJSON('api/projects/' +  opts.projectId + '/stakeholders/' + opts.stakeholderId + '/connections?week=' + opts.week)
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
