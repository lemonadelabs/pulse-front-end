import Ember from 'ember';

export default Ember.Component.extend({
  classNames:["stakeholder-card-container"],
  classNameBindings:['isDeleting','selected','editMode'],
  selected:false,
  isDeleted:false,
  isDeleting:false,
  editMode: Ember.computed('stakeholder.editMode', function(){
    if(this.stakeholder.editMode){
      return this.stakeholder.editMode
    }
    else{
      return false
    }
     }),
  readOnly: Ember.computed('editMode', function(){
    console.log('readOnly Editmode',this.get("editMode"));
    if (this.get("editMode")) {
      return false
    }
    else{
      return true
    }
  }),
  onInit:function(){
    //We need to get isDeleted so that the observer will fire correctly :(
    this.set('isDeleted',this.stakeholder.get('isDeleted'));
    this.set('isDeleting',this.stakeholder.get('isDeleting'));
  }.on('init'),
  click(){
    console.log('editMode ', this.get('editMode'));
    console.log('readOnly ', this.get('readOnly'));

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
