import DistributionPoint from './distributionPoint';

export default function DistributionCloud () {
  this.selectedStakeholder = undefined
  this.transitioning = false
  this.distributionPoints = []
}

DistributionCloud.prototype.createDistributionPoints = function(currentWeek) {
  var self = this
  var data = this.buildData()
  this.data = data
  this.distributionPoints = []

  _.forEach(data[currentWeek], function () {
    self.distributionPoints.push(
      new DistributionPoint({
        selectedStakeholder : self.selectedStakeholder,
        // data : pointData,
        // currentWeek: currentWeek
      })
    )
  })
};


DistributionCloud.prototype.reset = function() {
  this.selectedStakeholder = undefined
  this.distributionPoints = undefined
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
    if (randomised < 0) { randomised = 0 }
    if (randomised > 1) { randomised = 1 }
    return randomised

  }
}
