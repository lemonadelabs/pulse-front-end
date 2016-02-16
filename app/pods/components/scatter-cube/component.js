import Ember from 'ember';
import environment from './environment';

export default Ember.Component.extend({
  classNames: ['scatter-cube'],

  didInsertElement() {
    this.initScatterCube()
  },

  initScatterCube: function () {
    this.set('_environment', environment(this))

    this._environment.init()
    this._environment.setupScatterCube()
    this._environment.render()

    // this.model

    this._environment.initPointCloud({
      project : this.project,
      stakeholders : this.get('project.stakeholders'),
      stakeholderSnapshots : this.get('project.stakeholderSnapshots')
    })

    // this._environment.initLineGroup({
    //   relationships : this.relationships,
    // })

    // this._environment.populateCube({
    //   stakeholders : this.stakeholders,
    //   relationships : this.relationships,
    //   metadata : this.metadata,
    //   // stakeholderSnapshots : this.stakeholderSnapshots
    // })

    // console.log('model', this.get(model.stakeholders))
    // console.log('model', this.project)
    // console.log('model', this.get('project.stakeholders'))
    // console.log('model', this.get('project.relationships'))
    // console.log('model', this.get('project.stakeholderSnapshots'))


  },

  // watchStakeholders: function(){
  //   this.checkStakeholderDependantModels();

  // }.observes('stakeholders'),

  // watchStakeholderSnapshots: function(){
  //   this.checkStakeholderDependantModels();
  // }.observes('stakeholderSnapshots'),

  // checkStakeholderDependantModels: function(){
  //   if(this.stakeholders.get('isLoaded')&&this.stakeholderSnapshots.get('isLoaded')){
  //     // this._environment.initPointCloud({
  //     //   metadata : this.metadata,
  //     //   stakeholders : this.stakeholders,
  //     //   stakeholderSnapshots : this.stakeholderSnapshots
  //     // })
  //   }
  // },

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
