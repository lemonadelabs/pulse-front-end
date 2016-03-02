import Ember from 'ember';

export default Ember.Component.extend({
  classNames:["stakeholder-list"],
  classNameBindings:["fade-in-animation","fade-out-animation"],
  alertMessage:"Removed <b>10</b> stakeholders from project",
  focusedStakeholderCount: 0,
  selection:false,
  multiSelection:false,
  'fade-in-animation':true,
  'fade-out-animation':false,
  finishAction:"finishAction",
  undoAction:"undoAction",
  onInit:function(){
    var self = this;
    var focusedStakeholders = this.get('focusedStakeholders')
    _.forEach(focusedStakeholders,function(stakeholder){
      // stakeholder.set('isFocussed',false);
      if(stakeholder.get('isFocussed')){
        var focusedStakeholderCount = self.get('focusedStakeholderCount');
        self.set('focusedStakeholderCount', focusedStakeholderCount+1);
      }
    })
  }.on('init'),
  deselectStakeholders:function(){
    var focusedStakeholders = this.get('focusedStakeholders')
    _.forEach(focusedStakeholders,function(stakeholder){
      stakeholder.set('isFocussed',false);
    })
    this.set('focusedStakeholders',{})
    this.set('focusedStakeholderCount', 0);
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
    showStakeholdersOnCube:function(){
      this.send('closeStakeholderList')
      this.get('focusOnSelectedStakeholders')()
      // this.get("setFocusedStakeholders")(this.get('focusedStakeholders'))
    },
    addStakeholderToSelection:function(stakeholder){
      // var focusedStakeholders = this.get('focusedStakeholders')
      this.set('focusedStakeholders.'+stakeholder.id, stakeholder);
      var stakeholderCount = this.get("focusedStakeholderCount");
      this.set('focusedStakeholderCount',stakeholderCount+1);

    },
    removeStakeholderFromSelection:function(stakeholder){
      delete this.focusedStakeholders[stakeholder.id];
      var stakeholderCount = this.get("focusedStakeholderCount");
      this.set('focusedStakeholderCount',stakeholderCount-1);
    },
    startRemoveStakeholders:function(){
      var stakeholderCount = this.focusedStakeholderCount;
      var focusedStakeholders = this.get("focusedStakeholders");
      var firstStakeholder = focusedStakeholders[Object.keys(focusedStakeholders)[0]];

      _.forIn(focusedStakeholders,function( value, key) {
        focusedStakeholders[key].set('isDeleting', true);
        Ember.run.later(function(){
          console.log('stakeholderIdToDelete',key);
          focusedStakeholders[key].deleteRecord();
        }, 350)
      })

      if (stakeholderCount>1) {
        this.set('alertMessage',"Removed <b>"+this.focusedStakeholderCount+"</b> stakeholders from project")
      }
      else if (stakeholderCount === 1) {
        this.set('alertMessage',"Removed <b>"+firstStakeholder.get('name')+"</b> from project")
      }

      this.set("undoAction","undoRemoveStakeholders")
      this.set("finishAction","finishRemoveStakeholders")
      this.set("showNotification", true);
    },
    undoRemoveStakeholders:function(){
      var focusedStakeholders = this.get("focusedStakeholders");
      for (var stakeholderID in focusedStakeholders) {
        if (focusedStakeholders.hasOwnProperty(stakeholderID)) {
          focusedStakeholders[stakeholderID].set('isDeleting', false);
          focusedStakeholders[stakeholderID].rollbackAttributes();
        }
      }
      this.deselectStakeholders();
    },
    finishRemoveStakeholders:function(){
      var focusedStakeholders = this.get("focusedStakeholders");
      for (var stakeholderID in focusedStakeholders) {
        if (focusedStakeholders.hasOwnProperty(stakeholderID)) {
         focusedStakeholders[stakeholderID].save();
        }
      }
      this.deselectStakeholders();
    },
    editStakeholder:function(){
      var focusedStakeholders = this.get("focusedStakeholders");
      var selectedStakeholder = focusedStakeholders[Object.keys(focusedStakeholders)[0]];
      selectedStakeholder.set('editMode',true)
      this.deselectStakeholders();
    },
    pollStakeholders:function(){
      var stakeholderCount = this.focusedStakeholderCount;
      var focusedStakeholders = this.get("focusedStakeholders");
      var firstStakeholder = focusedStakeholders[Object.keys(focusedStakeholders)[0]];

      for (var stakeholder in focusedStakeholders) {
        if (focusedStakeholders.hasOwnProperty(stakeholder)) {
          //TODO: Do some kind of API call to actually poll stakeholders
        }
      }
      if (stakeholderCount>1) {
        this.set('alertMessage',"Polled <b>"+this.focusedStakeholderCount+"</b> stakeholders")
      }
      else if (stakeholderCount === 1) {
        this.set('alertMessage',"Polled <b>"+firstStakeholder.name+"</b>")
      }
      this.set("showNotification", true);
      this.deselectStakeholders();
    },
    finishAction:function(){
      console.log("finishAction");
    },
    undoAction:function(){
      console.log("undoAction");

    }
  },
  observeFocusedStakeholderCount:function(){
    console.log('focus')
    var focusedStakeholderCount = this.get('focusedStakeholderCount');
    if(focusedStakeholderCount < 0){
      console.warn('focusedStakeholderCount went into negative, setting back to 0');
      this.set('focusedStakeholderCount',0)
    }
    if(focusedStakeholderCount === 1){
      this.set('selection',true)
      this.set('multiSelection',false)
    }
    else if (focusedStakeholderCount > 1) {
      this.set('multiSelection',true)
    }
    else {
      this.set('selection',false)
      this.set('multiSelection',false)
    }
  }.observes('focusedStakeholderCount')
});
