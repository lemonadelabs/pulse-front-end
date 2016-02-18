import Ember from 'ember';


export default Ember.Component.extend({
  store: Ember.inject.service(),
  selectedStakeholder: undefined,
  selectedTime: undefined,
  connectionView:false,
  distributionView:false,
  historyView:false,
  showStakeholderList:false,
  project:undefined,
  stakeholders:{},

  init : function () {
    this._super()
    var self = this
    var store = this.get('store')
    var project = store.peekRecord('project', 1)

    // console.log(project.get('client'))
    var stakeholderObject = {}
    var stakeholderLength
    project.get('stakeholders').then(function (stakeholders) {
      stakeholderLength = stakeholders.get('length');
      stakeholders.forEach(function(stakeholder, i) {
        stakeholder.get('stakeholderSnapshots').then(function (snapshots) {
          //TODO: make sure this works with long response times
          if(i === stakeholderLength -1){
            self.set('stakeholders', stakeholderObject)

          }
        })
        stakeholderObject[stakeholder.get('id')] = stakeholder
      })
    })

    // var stakeholder = store.query('stakeholder', { filter: { project: project } } ).then(function (stakeholders) {
    //   self.set('stakeholders', stakeholders)
    //   stakeholders.forEach(function(stakeholder) {
    //     console.log(stakeholder.get('name'))
    //   })
    // })




  },

  actions : {
    userDidSelectStakeholder(stakeHolder) {
      this.set('selectedStakeholder', stakeHolder)
    },

    userDidCloseStakeholderModal() {
      this.set('selectedStakeholder', undefined)
    },

    userDidChangeTime(newTime) {
      this.set('selectedTime', newTime)
    },

    toggleConnections(){
      if(this.get("connectionView")){
        this.set("connectionView", false)
      }
      else{
        this.set("connectionView", true)
      }
    },

    toggleDistribution(){
      if(this.get("distributionView")){
        this.set("distributionView", false)
      }
      else{
        this.set("distributionView", true)
      }
    },

    toggleHistory(){
      if(this.get("historyView")){
        this.set("historyView", false)
      }
      else{
        this.set("historyView", true)
      }
    },
    toggleStakeholderList(){
      if(this.get("showStakeholderList")){
        this.set("showStakeholderList", false)
      }
      else{
        this.set("showStakeholderList", true)
      }
    }
  }

});
