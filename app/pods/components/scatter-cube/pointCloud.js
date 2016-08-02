import SHPoint from './SHPoint';
import SHPointClickTarget from './sHPointClickTarget';

export default function PointCloud (opts) {
  this.stakeholders = opts.stakeholders
  this.selectedTime = opts.selectedTime

  this.selectedPoint = undefined

  this.sHPointClickTargets = this.createSHPointClickTargets() // interaction logic
  this.sHPoints = this.createSHPoints() // visual component
}

PointCloud.prototype.startupAnimation = function(opts) {
  var tweens = []
  _.forEach(this.sHPoints, function (point) {
    var destinationOpacity = point.mesh.material.opacity

    point.mesh.material.opacity = 0
    var counter = {opacity: 0}
    var tween = new TWEEN.Tween(counter)
    .to( { opacity : destinationOpacity }, 300 )
    .easing(TWEEN.Easing.Linear.None)
    .onStart(function () {
      opts.addObjectToScene(point)
    })
    .onUpdate(function () {
      point.mesh.material.opacity = counter.opacity
    })
    tweens.push(tween)
  })
  _.forEach(tweens, function (tween) { tween.start() })
};

PointCloud.prototype.createSHPointClickTargets = function() {

  var self = this
  var sHPointClickTargets = []
  var stakeholders = this.stakeholders

  stakeholders.forEach( function (stakeholder) {

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

  stakeholders.forEach( function (stakeholder) {
    var snapshots = stakeholder.get('stakeholderSnapshots')
    var point = new SHPoint({
      snapshots : snapshots,
      selectedTime : self.selectedTime,
      id : stakeholder.get('id'),
    })
    shPoints.push(point)
  })
  return shPoints
};

/**
* foccusses stakeholder as selected in the `stakeholders` modal
* @method focusPoints
* @param {Object} opts
*   @param {Object} opts.focussedStakeholders stakeholders with id as key
*/
PointCloud.prototype.focusPoints = function(opts) {
  console.log('opts.focussedStakeholders', opts.focussedStakeholders)
  var focusAll
  if (_.isEmpty(opts.focussedStakeholders)) {
    focusAll = true
  }
  _.forEach(this.sHPoints, function (point) {
    if (focusAll) {
      point.focussed = true
    } else {
      // Check to see if stakeholder is in focussedStakeholders. If it is, set focussed to true. Otherwise set it to false
      point.focussed = (opts.focussedStakeholders[point.id]) ? true : false
    }
  })
};
