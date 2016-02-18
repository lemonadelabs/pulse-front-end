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

    var stakeholderObject = {}
    var stakeholderLength
    var snapsReturned = 0
    project.get('stakeholders').then(function (stakeholders) {
      stakeholderLength = stakeholders.get('length');
      stakeholders.forEach(function(stakeholder) {
        stakeholder.get('stakeholderSnapshots').then(function (snapshots) {
          snapsReturned += 1
          if ( snapsReturned === stakeholderLength ) {
            self.set('stakeholders', stakeholderObject)
          }
        })
        stakeholderObject[stakeholder.get('id')] = stakeholder
      })
    })
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
