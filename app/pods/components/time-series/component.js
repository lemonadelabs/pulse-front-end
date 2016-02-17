import Ember from 'ember';

export default Ember.Component.extend({
  timeSeries : [],
  selectedTime : undefined,
  setupTimeSeries: function() {
    var timeframe = this.model.get('timeframe')
    var timeFormat = this.model.get('timeFormat')
    this.set('selectedTime', timeframe);

    //reset the timeSeries
    this.set("timeSeries",[]);
    for (var i = 1; i <= timeframe; i++) {
      var selected = false;
      if(i === timeframe){
        selected = true;
      }
      this.timeSeries.push({"title":timeFormat+i,"id":i,"selected":selected})
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
