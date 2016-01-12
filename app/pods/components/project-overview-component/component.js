import Ember from 'ember';


export default Ember.Component.extend({
  selectedStakeholder: undefined,
  selectedTime: undefined,
  connectionView:true,
  distributionView:false,
  historyView:false,

  actions : {
    userDidSelectStakeholder(stakeHolder) {
      this.set('selectedStakeholder', stakeHolder)
    },

    userDidCloseStakeholderModal() {
      this.set('selectedStakeholder', undefined)
    },

    userDidChangeTime(newTime) {
      this.set('selectedTime',newTime)
    },

    toggleConnections(){
      if(this.get("connectionView")){
        this.set("connectionView", false)
      }
      else{
        this.set("connectionView", true)
      }
    },

    toggleDistribution(){
      if(this.get("distributionView")){
        this.set("distributionView", false)
      }
      else{
        this.set("distributionView", true)
      }
    },

    toggleHistory(){
      if(this.get("historyView")){
        this.set("historyView", false)
      }
      else{
        this.set("historyView", true)
      }
    }
  }

});
