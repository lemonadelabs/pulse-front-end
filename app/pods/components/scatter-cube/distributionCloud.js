import DistributionPoint from './distributionPoint';

export default function DistributionCloud (opts) {
  this.getVotes = opts.getVotes

  this.selectedStakeholder = undefined
  this.transitioning = false
  this.distributionPoints = []
}

DistributionCloud.prototype.createDistributionPoints = function(opts) {
  var self = this
  this.distributionPoints = []
  _.forEach(opts.votes, function (vote) {
    self.distributionPoints.push(
      new DistributionPoint({
        vote : vote,
        sHPoint : opts.sHPoint
      })
    )
  })
};


DistributionCloud.prototype.reset = function() {
  this.selectedStakeholder = undefined
  this.distributionPoints = undefined
};

// DistributionCloud.prototype.buildData = function() {
//   var data = {}
//   var weeks = this.selectedStakeholder.weeks
//   for (var week in weeks) {
//     data[week] = []
//     var currentWeek = weeks[week]
//     for (var i = 0; i < 20; i++) {
//       data[week].push({
//         power : randomise(currentWeek.power),
//         support : randomise(currentWeek.support),
//         vital : randomise(currentWeek.vital)
//       })
//     }
//   }
//   return data

//   function randomise(number) {
//     var randomised = parseFloat(number) + (Math.random()/4 - 0.5/4)
//     if (randomised < 0) { randomised = 0 }
//     if (randomised > 1) { randomised = 1 }
//     return randomised

//   }
// }
