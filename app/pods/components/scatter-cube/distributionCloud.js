import DistributionPoint from './distributionPoint';

export default function DistributionCloud () {
  this.selectedStakeholder = undefined
  this.distributionPoints = []
}

DistributionCloud.prototype.createDistributionPoints = function(currentWeek) {
  var self = this
  var data = this.buildData()
  this.distributionPoints = []

  _.forEach(data[currentWeek], function (pointData) {
    self.distributionPoints.push(
      new DistributionPoint({
        data : pointData
      })
    )
  })

};


DistributionCloud.prototype.buildData = function() {
  var data = {}
  var weeks = this.selectedStakeholder.weeks
  for (var week in weeks) {
    data[week] = []
    var currentWeek = weeks[week]
    for (var i = 0; i < 20; i++) {
      data[week].push({
        power : randomise(currentWeek.power),
        support : randomise(currentWeek.support),
        vital : randomise(currentWeek.vital)
      })
    }
  }
  return data

  function randomise(number) {
    var randomised = parseFloat(number) + (Math.random()/4 - 0.5/4)
    if (randomised < 0) randomised = 0
    if (randomised > 1) randomised = 1
    console.log(randomised)
    return randomised

  }
}
