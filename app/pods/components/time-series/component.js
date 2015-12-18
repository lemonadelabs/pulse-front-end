import Ember from 'ember';

export default Ember.Component.extend({
  timeSeries : [],
  selectedTime : undefined,
  setupTimeSeries: function() {
    var metadata = this.metadata[0]
    this.selectedTime = metadata.timeFrame;
    for (var i = 1; i <= metadata.timeFrame; i++) {
      var selected = false;
      if(i === metadata.timeFrame){
        selected = true;
      }
      this.timeSeries.push({"title":metadata.timeFormat+i,"id":i,"selected":selected})
      this.timeSeries.arrayContentDidChange(i,0,1)
    }
  }.on('init'),
  actions:{
    selectTimeSeries:function(id){
      var oldTime = this.get("selectedTime")
      this.set("timeSeries."+(oldTime-1)+".selected",false);
      this.set("timeSeries."+(id-1)+".selected",true);
      this.set("selectedTime",id)
      this.get("updateTime")(id)
    }
  }
});
