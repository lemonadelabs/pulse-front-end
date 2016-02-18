import Ember from 'ember';
import environment from './environment';

export default Ember.Component.extend({
  // store: Ember.inject.service(),

  classNames: ['scatter-cube'],

  didInsertElement() {
    this.initScatterCube()
  },

  // init: function () {
  //   this.set('selectedTime', this.project.get('timeframe')) // set time to latest week
  // },

  initScatterCube: function () {
    var stakeholdersRecords

    this.set('_environment', environment(this))

    this._environment.init()
    this._environment.setupScatterCube()
    this._environment.render()



    // project
    // stakeholders, where project_id : id
    // stakeholderSnapshots, where stakeholder_id : id

    // var store = this.get('store')
    // var project = store.peekRecord('project', 1)

    // var stakeholder = store.peekRecord('stakeholder', 1)
    // console.log(stakeholder.get('name'))

    // setInterval(function () {
    // }, 1000)






    // this._environment.initPointCloud({
    //   project : this.project,
    //   store : this.get('store')
    // })

  },

  updateSelectedStakeholder: function (shInfo) {
    this.get('updateStakeholder')(shInfo);
  },

  updateHoveredStakeholder: function (sHPoint) {
    this.set('hoveredStakeholder', sHPoint)
  },

  checkIfUpdatedTime: function (){
    var time = this.get('selectedTime')
    console.log(time)
    // this._environment.updateTime(time)
  }.observes('selectedTime'),

  checkUndefinedStakeholder: function (){
    if(this.get('selectedStakeholder')===undefined){
      this._environment.noSelectedStakeholder()
    }
  }.observes('selectedStakeholder'),

  onStakeholderData: function () {
    var time = this.get('selectedTime')
    console.log(time)

    // _.forEach(this.stakeholders, function (stakeholder) {
    //   console.log('**********************')
    //   console.log(stakeholder.get('name'), 'id: ', stakeholder.get('id') )

    //   var snap = stakeholder.get('stakeholderSnapshots').objectAt( time - 1 )
    //   console.log('------------')
    //   console.log('week', snap.get('week'))
    //   console.log('power', snap.get('power'))
    //   console.log('vital', snap.get('vital'))
    //   console.log('support', snap.get('support'))


    //   // stakeholder.get('stakeholderSnapshots').forEach(function (snap) {
    //   //   console.log('------------')
    //   //   console.log('week', snap.get('week'))
    //   //   console.log('power', snap.get('power'))
    //   //   console.log('vital', snap.get('vital'))
    //   //   console.log('support', snap.get('support'))
    //   // })
    // })

  }.observes('stakeholders'),

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
