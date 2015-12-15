import SHPoint from './SHPoint';

export default function PointCloud (opts) {
  this.data = opts.data

  this.sHPoints = this.createSHPoints()
}

PointCloud.prototype.createSHPoints = function() {
  var shPoints = []
  forEach(this.data, function (stakeHolder) {
    var point = new SHPoint({
      weeks : stakeHolder.data,
      name : stakeHolder.name,
      image : stakeHolder.image,
      organisation : stakeHolder.organisation,
      role : stakeHolder.role,
      tags : stakeHolder.tags
      // scene: self.scene
    })
    shPoints.push(point)
  })
  return shPoints
};

PointCloud.prototype.updatePositions = function(week) {
  forEach(this.sHPoints, function (sHPoint) {
    sHPoint.animate(week)
  })
};

function forEach(array, action) {
  for (var i = 0; i < array.length; i++)
    action(array[i]);
}