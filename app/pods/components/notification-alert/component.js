import Ember from 'ember';

export default Ember.Component.extend({
  classNames:['notification-container'],
  undoableAlert:true,
  showNotification:false,
  alertMessage:"!!WARNING!! alertMessage not defined",
  alertMessageStringSafe: function(){
    console.log(this.get('alertMessage'));
    return Ember.String.htmlSafe(this.get('alertMessage'))
  }.property('alertMessage'),
  onShowNotification: function(){
    var self = this;
    if(this.get('showNotification')){
      Ember.run.later(function(){
        self.set("showNotification", false);
      }, 6000);
    }
 }.observes('showNotification')
});
