import Ember from 'ember';

export default Ember.Component.extend({
  classNames:["stakeholder-card"],
  classNameBindings:['selected','deselected'],
  selected:false,
  click(){
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
});
