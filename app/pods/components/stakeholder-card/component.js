import Ember from 'ember';

export default Ember.Component.extend({
  classNames:["stakeholder-card"],
  attributeBindings: ['style'],
  classNameBindings:['isDeleting','selected','editMode'],
  selected:false,
  isDeleted:false,
  isDeleting:false,
  style: Ember.computed('transformationDistance',function(){
    var style = '';
    if(this.get('element')!==null){
       var transformationDistance = this.get('transformationDistance');
      if(this.stakeholder.editMode){
        style = `transform: translate3d(${transformationDistance.x}px,${transformationDistance.y}px,30px);`
      }
      else{
        style = ""
      }
    }
    return style.htmlSafe();

  }),
  transformationDistance:undefined,
  editMode: false,
  readOnly: true,
  onInit:function(){
    //We need to get isDeleted so that the observer will fire correctly :(
    this.set('isDeleted',this.stakeholder.get('isDeleted'));
    this.set('isDeleting',this.stakeholder.get('isDeleting'));
    this.set('selected', this.stakeholder.get('isFocussed'))
    window.addEventListener('resize',
      () => {
        if(this.editMode){
          Ember.run.debounce(this, this.recalculateTransformationDistance, 400, false)
        }
      })
  }.on('init'),
  calculateTransformationDistance: function(){
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var elementRect = this.get('element').getBoundingClientRect()
    this.set('elementRect',elementRect)
    var distanceToTranslate = {}
    distanceToTranslate.x = windowWidth / 2 - (elementRect.left + elementRect.width/2);
    distanceToTranslate.y = (windowHeight / 2) - (elementRect.top + elementRect.height/2);
    this.set('transformationDistance',distanceToTranslate);
  },
  recalculateTransformationDistance: function(){
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var oldElementRect = this.get('elementRect')
    var elementRect = this.get('element').getBoundingClientRect()
    var attributes = this.get('element').attributes;
    var outerHeight = this.$('#'+this.get('element').id).height();
    console.log(this.get('element').id);
    console.log('oldElementRect',oldElementRect,'elementRect',elementRect,'outerHeight',outerHeight);
    var oldDistanceToTranslate =  this.get('transformationDistance')

    var newDistanceTarget = {}
    newDistanceTarget.x = windowWidth / 2 - (elementRect.left + elementRect.width/2);
    newDistanceTarget.y = (windowHeight / 2) - (elementRect.top + elementRect.height/2);

    var distanceToTranslate = {}
    distanceToTranslate.x = oldDistanceToTranslate.x + newDistanceTarget.x;
    distanceToTranslate.y = oldDistanceToTranslate.y + newDistanceTarget.y;
    console.log('elementRect',elementRect,'oldElementRect',oldElementRect);
    console.log('oldDistanceToTranslate',oldDistanceToTranslate, 'newDistanceTarget', newDistanceTarget);
    this.set('transformationDistance',distanceToTranslate);
  },
  click(){
    if(!this.get('editMode')){
      if(this.get('selected')){
        this.set('selected', false);
        if(typeof this.get("onDeselectAction") === "function"){
          this.get('onDeselectAction')(this.stakeholder);
        }
        else {
          console.warn("stakeholder-card needs a function 'onSelectAction'");
        }
      }
      else {
        this.set('selected', true);
        if(typeof this.get("onSelectAction") === "function"){
          this.get('onSelectAction')(this.stakeholder);
        }
        else {
          console.warn("stakeholder-card needs a function 'onSelectAction'");
        }
      }
    }
  },
  actions:{
    save:function(){
      this.set('stakeholder.editMode',false)
      this.stakeholder.save();
    },
    cancel:function(){
      this.set('stakeholder.editMode',false)
      this.stakeholder.rollbackAttributes();
    }
  },
  observeEditMode:function(){
    var stakeholderEditMode = this.get('stakeholder.editMode');
    this.set('editMode',stakeholderEditMode)
    this.set('readOnly',!stakeholderEditMode)
    this.calculateTransformationDistance();
  }.observes('stakeholder.editMode'),
  observeDeletedStatus:function(){
    if (this.stakeholder.get('isDeleted')) {
      this.set('isDeleted', true)
      this.set('selected', false)
    }
    else {
      this.set('isDeleted', false)
    }
  }.observes('stakeholder.isDeleted'),
  observeDeletingStatus:function(){
    if (this.stakeholder.get('isDeleting')) {
      this.set('isDeleting',true)
      this.set('selected', false)
    }
  }.observes('stakeholder.isDeleting'),
  observeEdit:function(){
    this.set('selected', false)
  }.observes('editMode'),
  observeFocussedStatus:function(){
    if (this.stakeholder.get('isFocussed')) {
      this.set('selected', true)
    } else {
      this.set('selected', false)
    }
  }.observes('stakeholder.isFocussed'),
});
