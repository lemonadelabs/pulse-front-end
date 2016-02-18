import SHPoint from './SHPoint';
import SHPointClickTarget from './sHPointClickTarget';

export default function PointCloud (opts) {
  this.stakeholders = opts.stakeholders
  this.selectedTime = opts.selectedTime

  this.selectedPoint = undefined

  this.sHPointClickTargets = this.createSHPointClickTargets()
  this.sHPoints = this.createSHPoints()
}

PointCloud.prototype.createSHPointClickTargets = function() {

  var self = this
  var sHPointClickTargets = []
  var stakeholders = this.stakeholders

  _.forEach(stakeholders, function (stakeholder) {

    var snapshots = stakeholder.get('stakeholderSnapshots')

    var sHPointClickTarget = new SHPointClickTarget({
      snapshots : snapshots,
      id : stakeholder.get('id'),
      name : stakeholder.get('name'),
      image : stakeholder.get('image'),
      organisation : stakeholder.get('organisation'),
      role : stakeholder.get('role'),
      tags : stakeholder.get('tags'),
      selectedTime : self.selectedTime
    })
    sHPointClickTargets.push(sHPointClickTarget)
  })
  return sHPointClickTargets
};

PointCloud.prototype.createSHPoints = function() {
  var self = this
  var shPoints = []
  var stakeholders = this.stakeholders

  _.forEach(stakeholders, function (stakeholder) {
    var snapshots = stakeholder.get('stakeholderSnapshots')
    var point = new SHPoint({
      snapshots : snapshots,
      selectedTime : self.selectedTime
    })
    shPoints.push(point)
  })
  return shPoints
};

