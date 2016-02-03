import Ember from 'ember';

export default Ember.Component.extend({
  classNames:["stakeholder-list"],
  alertMessage:"Removed <b>10</b> stakeholders from project",
  selectedStakeholders:{},
  selectedStakeholderCount: 0,
  selection:false,
  multiSelection:false,
  finishAction:"finishAction",
  deselectStakeholders:function(){
    for (var stakeholder in this.selectedStakeholders) {
      if (this.selectedStakeholders.hasOwnProperty(stakeholder)) {
        delete this.selectedStakeholders[stakeholder.id];
      }
    }
  },
  actions:{
    closeStakeholderList:function(){
      this.get("toggleStakeholderList")();
    },
    addStakeholderToSelection:function(stakeholder){
      this.set('selectedStakeholders.'+stakeholder.id, stakeholder);
      var stakeholderCount = this.get("selectedStakeholderCount");
      this.set('selectedStakeholderCount',stakeholderCount+1);
    },
    removeStakeholderFromSelection:function(stakeholder){
      delete this.selectedStakeholders[stakeholder.id];
      var stakeholderCount = this.get("selectedStakeholderCount");
      this.set('selectedStakeholderCount',stakeholderCount-1);
    },
    startRemoveStakeholders:function(){
      var stakeholderCount = this.selectedStakeholderCount;
      var selectedStakeholders = this.get("selectedStakeholders");
      var firstStakeholder = selectedStakeholders[Object.keys(selectedStakeholders)[0]];

      for (var stakeholder in selectedStakeholders) {
        if (selectedStakeholders.hasOwnProperty(stakeholder)) {
          //TODO: use ember data to remove stakeholders
        }
      }
      if (stakeholderCount>1) {
        this.set('alertMessage',"Removed <b>"+this.selectedStakeholderCount+"</b> stakeholders from project")
      }
      else if (stakeholderCount === 1) {
        this.set('alertMessage',"Removed <b>"+firstStakeholder.name+"</b> from project")
      }
      this.set("showNotification", true);
    },
    undoRemoveStakeholders:function(){
      //TODO:Make this actually do something
    },
    finishRemoveStakeholders:function(){
      //TODO:Here is where we would do the ember data save;
      this.deselectStakeholders();
    },
    pollStakeholders:function(){
      var stakeholderCount = this.selectedStakeholderCount;
      var selectedStakeholders = this.get("selectedStakeholders");
      var firstStakeholder = selectedStakeholders[Object.keys(selectedStakeholders)[0]];

      for (var stakeholder in selectedStakeholders) {
        if (selectedStakeholders.hasOwnProperty(stakeholder)) {
          //TODO: Do some kind of API call to actually poll stakeholders
        }
      }
      if (stakeholderCount>1) {
        this.set('alertMessage',"Polled <b>"+this.selectedStakeholderCount+"</b> stakeholders")
      }
      else if (stakeholderCount === 1) {
        this.set('alertMessage',"Polled <b>"+firstStakeholder.name+"</b>")
      }
      this.set("showNotification", true);
    },
    finishAction:function(){
      console.log("finishAction");
    }
  },
  observeSelectedStakeholderCount:function(){
    var selectedStakeholderCount = this.get('selectedStakeholderCount');
    if(selectedStakeholderCount === 1){
      this.set('selection',true)
      this.set('multiSelection',false)
    }
    else if (selectedStakeholderCount > 1) {
      this.set('multiSelection',true)
    }
    else {
      this.set('selection',false)
      this.set('multiSelection',false)
    }
  }.observes('selectedStakeholderCount')
});
