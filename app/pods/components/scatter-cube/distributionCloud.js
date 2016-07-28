import DistributionPoint from './distributionPoint';

export default function DistributionCloud (opts) {
  this.getVotes = opts.getVotes

  this.selectedStakeholder = undefined
  this.transitioning = false
  this.distributionPoints = []
}


/**
* @method createDistributionPoints
* @param {Object} opts
*   @param {Array} opts.votes data from the backend
*   @param {Object} opts.sHPoint current focussed stakeholder point
*/
DistributionCloud.prototype.createDistributionPoints = function(opts) {
  var self = this
  this.selectedStakeholder = opts.sHPoint
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