import SHPoint from './SHPoint';
import SHPointClickTarget from './sHPointClickTarget';

export default function PointCloud (opts) {
  this.data = opts.data
  this.timeFrame = opts.timeFrame
  this.selectedPoint = undefined

  this.sHPointClickTargets = this.createSHPointClickTargets()
  this.sHPoints = this.createSHPoints()
}

PointCloud.prototype.createSHPointClickTargets = function() {
  var self = this
  var sHPointClickTargets = []
  _.forEach(this.data, function (stakeHolder) {
    var sHPointClickTarget = new SHPointClickTarget({
      weeks : stakeHolder.data,
      id : stakeHolder.id,
      name : stakeHolder.name,
      image : stakeHolder.image,
      organisation : stakeHolder.organisation,
      role : stakeHolder.role,
      tags : stakeHolder.tags,
      timeFrame : self.timeFrame
    })
    sHPointClickTargets.push(sHPointClickTarget)
  })
  return sHPointClickTargets
};

PointCloud.prototype.createSHPoints = function() {
  var self = this
  var shPoints = []
  _.forEach(this.data, function (stakeHolder) {
    var point = new SHPoint({
      weeks : stakeHolder.data,
      timeFrame : self.timeFrame
    })
    shPoints.push(point)
  })
  return shPoints
};

