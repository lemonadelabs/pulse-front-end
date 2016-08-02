import Ember from 'ember';
import Environment from './environment';
/**
* This component handles interactions with the three.js environment named Environment.js
*/
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

  /**
  * executes the initial setup of the threejs scene, and scatterCube
  * setupScatterCube passes project information which is passed from the router, and contains metadata relating to the project such as timeframe
  * initConnections passes getConnections which is a function that will return connections data via an ajax request
  * initDistributionCloud passes getVotes which is a function that will return votes data via an ajax request
  * @method initScatterCube
  */
  initScatterCube: function () {
    var environment = new Environment(this)
    this.set('environment', environment)

    this.environment.init()
    this.environment.render()
    this.environment.setupScatterCube({ project : this.project })
    this.environment.initConnections({ getConnections : this.getConnections })
    this.environment.initDistributionCloud({ getVotes : this.getVotes })
  },

  /**
  * observes stakeholders which is passed from the route
  * initializes pointCloud to display the stakeholder data
  * @method onStakeholderData
  */
  onStakeholderData: function () {
    this.environment.initPointCloud({
      project : this.project,
      stakeholders : this.stakeholders,
      selectedTime : this.get('selectedTime')
    })
  }.observes('stakeholders'),

  // sets focussedStakeholders in environment to be undefined
  removeStakeholderFilter: function () {
    if (!this.get('focusOnStakeholders')) {
      this.environment.foccussedStakeholdersUpdated( { focussedStakeholders : undefined } )
    }
  }.observes('focusOnStakeholders'),


  /**
  * @method getVotes
  * @param {Object} opts
  *   @param {Number} opts.projectId
  *   @param {Number} opts.stakeholderId
  *   @param {Number} opts.week
  * @return {Promise} ajax promise with votes data for a specific stakeholder and week
  */
  getVotes: function (opts) {
    return Ember.$.getJSON('api/projects/' +  opts.projectId + '/stakeholders/' + opts.stakeholderId + '/votes?week=' + opts.week)
  },

  /**
  * @method getConnections
  * @param {Object} opts
  *   @param {Number} opts.projectId
  *   @param {Number} opts.stakeholderId
  *   @param {Number} opts.week
  * @return {Promise} ajax promise with connections data for a specific stakeholder and week
  */
  getConnections: function (opts) {
    return Ember.$.getJSON('api/projects/' +  opts.projectId + '/stakeholders/' + opts.stakeholderId + '/connections?week=' + opts.week)
  },

  /**
  * runs an action in the parent component
  * @method updateSelectedStakeholder
  * @param {Object} shInfo
  */
  updateSelectedStakeholder: function (shInfo) {
    this.get('updateStakeholder')(shInfo);
  },

  updateHoveredStakeholder: function (sHPoint) {
    this.set('hoveredStakeholder', sHPoint)
  },

  /**
  * observes time and calls updateTime function in environmnet
  * @method checkIfUpdatedTime
  */
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

});
