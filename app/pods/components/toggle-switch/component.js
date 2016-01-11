import Ember from 'ember';

export default Ember.Component.extend({
  checkboxId:function(){
    return this.get("title") + "-checkbox"
  }.property("title")
});
