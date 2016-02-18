import Ember from 'ember';

export default Ember.Component.extend({
  classNames:["stakeholder-list"],
  classNameBindings:["fade-in-animation","fade-out-animation"],
  alertMessage:"Removed <b>10</b> stakeholders from project",
  selectedStakeholders:{},
  selectedStakeholderCount: 0,
  selection:false,
  multiSelection:false,
  'fade-in-animation':true,
  'fade-out-animation':false,
  finishAction:"finishAction",
  undoAction:"undoAction",

  deselectStakeholders:function(){
    this.set('selectedStakeholders',{})
    this.set('selectedStakeholderCount',0);
  },
  actions:{
    closeStakeholderList:function(){
      var self = this;
      this.set('fade-in-animation',false);
      this.set('fade-out-animation',true);
      Ember.run.later(function(){
        self.get("toggleStakeholderList")();
     }, 250);
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

      for (var stakeholderID in selectedStakeholders) {
        if (selectedStakeholders.hasOwnProperty(stakeholderID)) {
          selectedStakeholders[stakeholderID].deleteRecord();
          console.log(selectedStakeholders[stakeholderID].get('isDeleted'))
        }
      }
      if (stakeholderCount>1) {
        this.set('alertMessage',"Removed <b>"+this.selectedStakeholderCount+"</b> stakeholders from project")
      }
      else if (stakeholderCount === 1) {
        this.set('alertMessage',"Removed <b>"+firstStakeholder.get('name')+"</b> from project")
      }

      this.set("undoAction","undoRemoveStakeholders")
      this.set("finishAction","finishRemoveStakeholders")
      this.set("showNotification", true);
    },
    undoRemoveStakeholders:function(){
      var selectedStakeholders = this.get("selectedStakeholders");
      for (var stakeholderID in selectedStakeholders) {
        if (selectedStakeholders.hasOwnProperty(stakeholderID)) {
          selectedStakeholders[stakeholderID].rollbackAttributes();
        }
      }
      this.deselectStakeholders();
    },
    finishRemoveStakeholders:function(){
      var selectedStakeholders = this.get("selectedStakeholders");
      for (var stakeholderID in selectedStakeholders) {
        if (selectedStakeholders.hasOwnProperty(stakeholderID)) {
          selectedStakeholders[stakeholderID].save();
        }
      }
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
    },
    undoAction:function(){
      console.log("undoAction");

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