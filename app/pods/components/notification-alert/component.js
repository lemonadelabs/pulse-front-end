import Ember from 'ember';

export default Ember.Component.extend({
  classNames:['notification-container'],
  undoableAlert:true,
  showNotification:false,
  hideNotificationAction:undefined,
  alertMessage:"!!WARNING!! alertMessage not defined",
  alertMessageStringSafe: function(){
    console.log(this.get('alertMessage'));
    return Ember.String.htmlSafe(this.get('alertMessage'))
  }.property('alertMessage'),
  onShowNotification: function(){
    var self = this;
  if(this.get('showNotification')){
      self.hideNotificationAction = Ember.run.later(function(){
        self.set("showNotification", false);
        self.get("finishAction")();
      }, 6000);
    }
 }.observes('showNotification'),
 actions:{
   undo: function(){
     Ember.run.cancel(this.hideNotificationAction);
     this.get("undoAction")();
     this.set("showNotification", false);
   }
 }
});
