import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['stakeholder-view-mode-window','fancy-corners'],
  classNameBindings: ['visible','ignore-pointer'],
  visible: true,
  connections:true,
  distribution:false,
  history:false,
  "ignore-pointer":false,
  observeConnections:function(){
    this.get("toggleConnections")();
  }.observes("connections"),
  observeDistribution:function(){
    this.get("toggleDistribution")();
  }.observes("distribution"),
  observeHistory:function(){
    this.get("toggleHistory")();
  }.observes("history")
});
