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
  data:undefined,

  init : function () {
    this._super()
    var self = this
    var store = this.get('store')
    var project = store.peekRecord('project', 1)

    var stakeholderObject = {}
    var stakeholderLength
    var snapsReturned = 0


    var promises = {
      stakeholders: project.get('stakeholders').then(function (stakeholders) {
        return stakeholders
      }).then( function (stakeholders) {
        var snapshots = stakeholders.getEach('stakeholderSnapshots');

        return Ember.RSVP.all(snapshots).then(function(){
          console.log(stakeholders)
          return stakeholders;
        })
      })
    }

    Ember.RSVP.hash(promises).then(function(results){
      console.log(results);
      self.set('data', results)
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
