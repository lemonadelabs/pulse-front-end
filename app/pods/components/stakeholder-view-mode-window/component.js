import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['stakeholder-view-mode-window','fancy-corners'],
  classNameBindings: ['visible','ignore-pointer'],
  visible: false,
  connections:false,
  distribution:false,
  history:true,
  "ignore-pointer":true,
  observeConnections:function(){
    this.get("toggleConnections")();
  }.observes("connections"),
  observeDistribution:function(){
    this.get("toggleDistribution")();
  }.observes("distribution"),
  observeHistory:function(){
    this.get("toggleHistory")();
  }.observes("history"),
  showWindowOnSelection:function(){
    if(this.get("selectedStakeholder")!== undefined && this.get("visible") === false){
      this.set("visible",true);
      this.set("ignore-pointer",false);
    }
    else if(this.get("selectedStakeholder") === undefined && this.get("visible") === true){
      this.set("visible",false);
      this.set("ignore-pointer",true);
    }
  }.observes("selectedStakeholder")
});
