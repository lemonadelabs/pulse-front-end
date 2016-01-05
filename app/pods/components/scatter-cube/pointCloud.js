import SHPoint from './SHPoint';
import SHPointClickTarget from './sHPointClickTarget';
// import SHPointClickTarget from './sHPointClickTarget';

export default function PointCloud (opts) {
  this.data = opts.data
  this.timeFrame = opts.timeFrame
  this.selectedPoint = undefined
  this.lineGroup = opts.lineGroup
  this.environment = opts.environment

  this.sHPointClickTargets = this.createSHPointClickTargets()
  this.sHPoints = this.createSHPoints()
}

PointCloud.prototype.createSHPointClickTargets = function() {
  var self = this
  var sHPointClickTargets = []
  forEach(this.data, function (stakeHolder) {
    var sHPointClickTarget = new SHPointClickTarget({
      weeks : stakeHolder.data,
      id : stakeHolder.id,
      name : stakeHolder.name,
      image : stakeHolder.image,
      organisation : stakeHolder.organisation,
      role : stakeHolder.role,
      tags : stakeHolder.tags,
      lineGroup : self.lineGroup,
      environment : self.environment,
      timeFrame : self.timeFrame
    })
    sHPointClickTargets.push(sHPointClickTarget)
  })
  return sHPointClickTargets
};

PointCloud.prototype.createSHPoints = function() {
  var self = this
  var shPoints = []
  forEach(this.data, function (stakeHolder) {
    var point = new SHPoint({
      weeks : stakeHolder.data,
      timeFrame : self.timeFrame
    })
    shPoints.push(point)
  })
  return shPoints
};

PointCloud.prototype.updatePositions = function(week) {
  forEach(this.sHPointClickTargets, function (sHPointClickTarget) {
    sHPointClickTarget.animate(week)
  })

  forEach(this.sHPoints, function (sHPoint) {
    sHPoint.animate(week)
  })
};

function forEach(array, action) {
  for (var i = 0; i < array.length; i++)
    action(array[i]);
}