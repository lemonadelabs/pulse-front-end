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
    window.addEventListener('resize',
      () => {
        if(this.editMode){
          Ember.run.debounce(this, this.updateTransformationDistance, 400, false)
        }
      })
  }.on('init'),
  calculateTransformationDistance: function(){
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var elementRect = this.get('element').getBoundingClientRect()
    this.set('elementRect',elementRect)
    console.log(elementRect);
    var distanceToTranslate = {}
    distanceToTranslate.x = windowWidth / 2 - (elementRect.left + elementRect.width/2);
    distanceToTranslate.y = (windowHeight / 2) - (elementRect.top + elementRect.height/2);
    this.set('transformationDistance',distanceToTranslate);
  },
  updateTransformationDistance: function(){
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var elementRect = this.get('elementRect')
    var elWidth = this.get('element').getBoundingClientRect().width;
    var distanceToTranslate = {}
    distanceToTranslate.x = windowWidth / 2 - (elementRect.left + elWidth/2);
    distanceToTranslate.y = windowHeight / 2 - (elementRect.top + elementRect.height/2);
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
  }.observes('editMode')
});
