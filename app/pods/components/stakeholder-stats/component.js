import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['stakeholder-stats'],

  chartOptions: {
    showPoint: false,
    lineSmooth: false,
    width:"100%",
    fullWidth: true,

    axisX: {
      //showGrid: false
    },

    axisY: {
      //showGrid: false
      type: Chartist.FixedScaleAxis,
      ticks: [0, 2, 4, 6, 8, 10],
      low: 0,
      high:10,
      offset: 20,
    },

    chartPadding: {
      left: 0
    }


  },

  onDataUpdate: function (){
    if(this.get('data')===undefined){
      this.set('processedData', undefined)
    } else {
      this.processData()
    }
  }.observes('data'),

  processData: function () {
    var data = this.get('data')
    var weekNumbers = []
    var power = []
    var support = []
    var vital = []

    data.forEach(function(snapshot, index){
      var weekNumber = index+1;
      weekNumbers.push(`W${weekNumber}`);
      power.push(snapshot.get('power')*10);
      support.push(snapshot.get('support')*10);
      vital.push(snapshot.get('vital')*10);

    });

    var processedData = {
      labels: weekNumbers,
      series: [ support, vital, power ]
    };

    this.set('processedData', processedData)
  }

});
