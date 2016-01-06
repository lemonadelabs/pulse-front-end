import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['stakeholder-stats'],

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

    _.forEach(data, function (value, key) {
      weekNumbers.push(key)
      power.push(value.power)
      support.push(value.support)
      vital.push(value.vital)
    })

    var processedData = {
      labels: weekNumbers,
      series: [ support, vital, power ]
    };

    this.set('processedData', processedData)
  }

});
