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

  deselectStakeholders: function(){
    this.set('selectedStakeholders',{})
    this.set('selectedStakeholderCount', 0);
  },
  scrollHandler: function(e){
    this.calculatePerpectiveOrigin(e.target.scrollTop)
  },
  calculatePerpectiveOrigin: function(scrollTop){

    var windowHeight = window.innerHeight;
    var element = this.get('element')
    var scrollHeight = element.scrollHeight;
    var perspectiveOrigin = (windowHeight / 2) + scrollTop;
    // var elementRect = this.get('element').getBoundingClientRect()

    console.log(perspectiveOrigin);

  },
  onInit: function() {
    var self = this;
    this.get('element').addEventListener('scroll', function(e) {
      self.scrollHandler(e)
    })
  }.on('didInsertElement'),
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

      _.forIn(selectedStakeholders,function( value, key) {
        selectedStakeholders[key].set('isDeleting', true);
        Ember.run.later(function(){
          console.log('stakeholderIdToDelete',key);
          selectedStakeholders[key].deleteRecord();
        }, 350)
      })

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
          selectedStakeholders[stakeholderID].set('isDeleting', false);
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
    editStakeholder:function(){
      var selectedStakeholders = this.get("selectedStakeholders");
      var selectedStakeholder = selectedStakeholders[Object.keys(selectedStakeholders)[0]];
      selectedStakeholder.set('editMode',true)
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
    if(selectedStakeholderCount < 0){
      console.warn('selectedStakeholderCount went into negative, setting back to 0');
      this.set('selectedStakeholderCount',0)
    }
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
