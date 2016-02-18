import SHPoint from './SHPoint';
import SHPointClickTarget from './sHPointClickTarget';

export default function PointCloud (opts) {
  this.stakeholders = opts.stakeholders
  this.selectedTime = opts.selectedTime

  this.selectedPoint = undefined

  this.sHPointClickTargets = this.createSHPointClickTargets()
  // this.sHPoints = this.createSHPoints()
}

PointCloud.prototype.createSHPointClickTargets = function() {

  var self = this
  var sHPointClickTargets = []
  var stakeholders = this.stakeholders

  _.forEach(this.stakeholders, function (stakeholder) {

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





// PointCloud.prototype.createSHPointClickTargets = function() {
//   var self = this
//   var sHPointClickTargets = []

//     this.project.get('stakeholders').then(function (stakeholders) {
//       stakeholders.forEach(function(stakeholder){
//         console.log(stakeholder.get('name'))
//       })
//     })

//   _.forEach(this.data, function (stakeHolder) {
//     var sHPointClickTarget = new SHPointClickTarget({
//       weeks : stakeHolder.data,
//       id : stakeHolder.id,
//       name : stakeHolder.name,
//       image : stakeHolder.image,
//       organisation : stakeHolder.organisation,
//       role : stakeHolder.role,
//       tags : stakeHolder.tags,
//       timeFrame : self.timeFrame
//     })
//     sHPointClickTargets.push(sHPointClickTarget)
//   })
//   return sHPointClickTargets
// };

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

