import Ember from 'ember';

export default Ember.Component.extend({

  stakeholderFilter: Ember.inject.service(),


  classNames:["stakeholder-list"],
  attributeBindings: ['style'],
  classNameBindings:["fade-in-animation","fade-out-animation"],
  alertMessage:"Removed <b>10</b> stakeholders from project",
  style: Ember.computed('perspectiveOriginY', function(){
    var perspectiveOriginY = this.get('perspectiveOriginY');
    return `perspective-origin: 50% ${perspectiveOriginY}px`.htmlSafe()
  }),
  perspectiveOriginY:0,
  focussedStakeholders:{},
  focussedStakeholderCount: 0,
  selection:false,
  multiSelection:false,
  'fade-in-animation':true,
  'fade-out-animation':false,
  finishAction:"finishAction",
  undoAction:"undoAction",
  onInit:function(){
    var self = this;
    var focussedStakeholders = this.get('focussedStakeholders')
    _.forEach(focussedStakeholders,function(stakeholder){
      // stakeholder.set('isFocussed',false);
      if(stakeholder.get('isFocussed')){
        var focussedStakeholderCount = self.get('focussedStakeholderCount');
        self.set('focussedStakeholderCount', focussedStakeholderCount+1);
      }
    })
  }.on('init'),
  deselectStakeholders:function(){
    var focussedStakeholders = this.get('focussedStakeholders')
    _.forEach(focussedStakeholders,function(stakeholder){
      stakeholder.set('isFocussed',false);
    })
    this.set('focussedStakeholders',{})
    this.set('focussedStakeholderCount', 0);
  },
  calculatePerspectiveOriginY: function(){
    var scrollTop = this.get('element').scrollTop;
    var windowHeight = window.innerHeight;
    var perspectiveOriginY = (windowHeight / 2) + scrollTop;
    this.set('perspectiveOriginY', perspectiveOriginY);
    console.log('calc');
  },
  didInsertElement: function() {
    this.get('element').addEventListener('scroll', () => {Ember.run.debounce(this, this.calculatePerspectiveOriginY, 50, false)})
    window.addEventListener('resize', () => {Ember.run.debounce(this, this.calculatePerspectiveOriginY, 50, false)})
    Ember.run.next(
      () => { this.calculatePerspectiveOriginY() }
    );
  },
  onRemove: function() {
    this.get('element').removeEventListener('scroll', () => {
      Ember.run.debounce(this, this.scrollHandler, 50, false);
    })
  }.on('willDestroyElement'),
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
      // var focussedStakeholders = this.get('focussedStakeholders')
      this.set('focussedStakeholders.'+stakeholder.id, stakeholder);
      var stakeholderCount = this.get("focussedStakeholderCount");
      this.set('focussedStakeholderCount',stakeholderCount+1);

    },
    removeStakeholderFromSelection:function(stakeholder){
      delete this.focussedStakeholders[stakeholder.id];
      var stakeholderCount = this.get("focussedStakeholderCount");
      this.set('focussedStakeholderCount',stakeholderCount-1);
    },
    startRemoveStakeholders:function(){
      var stakeholderCount = this.focussedStakeholderCount;
      var focussedStakeholders = this.get("focussedStakeholders");
      var firstStakeholder = focussedStakeholders[Object.keys(focussedStakeholders)[0]];

      _.forIn(focussedStakeholders,function( value, key) {
        focussedStakeholders[key].set('isDeleting', true);
        Ember.run.later(function(){
          focussedStakeholders[key].deleteRecord();
        }, 350)
      })

      if (stakeholderCount>1) {
        this.set('alertMessage',"Removed <b>"+this.focussedStakeholderCount+"</b> stakeholders from project")
      }
      else if (stakeholderCount === 1) {
        this.set('alertMessage',"Removed <b>"+firstStakeholder.get('name')+"</b> from project")
      }

      this.set("undoAction","undoRemoveStakeholders")
      this.set("finishAction","finishRemoveStakeholders")
      this.set("showNotification", true);
    },
    undoRemoveStakeholders:function(){
      var focussedStakeholders = this.get("focussedStakeholders");
      for (var stakeholderID in focussedStakeholders) {
        if (focussedStakeholders.hasOwnProperty(stakeholderID)) {
          focussedStakeholders[stakeholderID].set('isDeleting', false);
          focussedStakeholders[stakeholderID].rollbackAttributes();
        }
      }
      this.deselectStakeholders();
    },
    finishRemoveStakeholders:function(){
      var focussedStakeholders = this.get("focussedStakeholders");
      for (var stakeholderID in focussedStakeholders) {
        if (focussedStakeholders.hasOwnProperty(stakeholderID)) {
         focussedStakeholders[stakeholderID].save();
        }
      }
      this.deselectStakeholders();
    },
    editStakeholder:function(){
      var focussedStakeholders = this.get("focussedStakeholders");
      var selectedStakeholder = focussedStakeholders[Object.keys(focussedStakeholders)[0]];
      selectedStakeholder.set('editMode',true)
      this.deselectStakeholders();
    },
    pollStakeholders:function(){
      var stakeholderCount = this.focussedStakeholderCount;
      var focussedStakeholders = this.get("focussedStakeholders");
      var firstStakeholder = focussedStakeholders[Object.keys(focussedStakeholders)[0]];

      for (var stakeholder in focussedStakeholders) {
        if (focussedStakeholders.hasOwnProperty(stakeholder)) {
          //TODO: Do some kind of API call to actually poll stakeholders
        }
      }
      if (stakeholderCount>1) {
        this.set('alertMessage',"Polled <b>"+this.focussedStakeholderCount+"</b> stakeholders")
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
    },
    defocusStakeholders:function(){
      this.deselectStakeholders()
    },
    sendMessageToScattercube:function(){
      this.send('closeStakeholderList')
      this.get('focusOnSelectedStakeholders')()
      this.get('stakeholderFilter').trigger('showFocussedStakeholders', this.get('focussedStakeholders'))
    },
  },
  observeFocussedStakeholderCount:function(){
    var focussedStakeholderCount = this.get('focussedStakeholderCount');
    if(focussedStakeholderCount < 0){
      console.warn('focussedStakeholderCount went into negative, setting back to 0');
      this.set('focussedStakeholderCount',0)
    }
    if(focussedStakeholderCount === 1){
      this.set('selection',true)
      this.set('multiSelection',false)
    }
    else if (focussedStakeholderCount > 1) {
      this.set('multiSelection',true)
    }
    else {
      this.set('selection',false)
      this.set('multiSelection',false)
    }
    }.observes('focussedStakeholderCount')
});
