/*jshint -W083 */
import coordsFromSnapshot from './services/coordsFromSnapshot';

export default function TweenController (opts) {
  this.environment = opts.environment
}

/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// singular animations //////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////


TweenController.prototype.distroCloudBirth = function(opts) {
  // this animation causes points to explode out from the position of the selected stakeholder point
  var environment = this.environment
  var tweens = []
  var points = environment.distributionCloud.distributionPoints
  // var data = environment.distributionCloud.data[opts.time]

  environment.distributionCloud.transitioning = true
  _.forEach(points, function (point) {


    var opacityProxy = {opacity: 0}

    var positionProxy = {
      x : point.mesh.position.x,
      y : point.mesh.position.y,
      z : point.mesh.position.z
    }

    var destinationPosition = coordsFromSnapshot(point.destination) // normalization to make the points sit within the cube and not collide with the edges
    point.updateColor(environment.camera.position, destinationPosition) // work out destination opacity
    var destinationOpacity = point.mesh.material.opacity
    point.mesh.material.opacity = 0 // hide point for begining of animation

    var positionTween = new TWEEN.Tween(positionProxy)
      .easing(opts.easing)
      .to({
        x : destinationPosition.x,
        y : destinationPosition.y,
        z : destinationPosition.z
      }, opts.duration)
      .onUpdate(function () {
        point.mesh.position.set(positionProxy.x,positionProxy.y,positionProxy.z)
      })
      .start();
    tweens.push(positionTween)

    var opacityTween = new TWEEN.Tween(opacityProxy)
      .easing(TWEEN.Easing.Quadratic.In)
      .to({ opacity: destinationOpacity }, (opts.duration * 0.5))
      .onUpdate(function () {
        point.mesh.material.opacity = opacityProxy.opacity
      })
      .start();
    tweens.push(opacityTween)
  })
  _.last(tweens).onComplete(function (){
    environment.distributionCloud.transitioning = false
  })
  return tweens
}

/**
* makes the distro points implode into sHPoint location and fade out
* @method distroCloudDeath
* @param {Object} opts
*   @param {Number} opts.duration
*   @param {Function} opts.easing
*/
TweenController.prototype.distroCloudDeath = function(opts) {
  var distributionCloud = this.environment.distributionCloud
  var tweens = []
  var points = distributionCloud.distributionPoints

  var coords = distributionCloud.selectedStakeholder.mesh.position
  var x = coords.x
  var y = coords.y
  var z = coords.z

  distributionCloud.transitioning = true
  for (var i = 0; i < points.length; i++) {

    var tween = new TWEEN.Tween(points[i].mesh.position)
      .to({x: x, y: y, z: z}, opts.duration)
      .easing(opts.easing)
      .start();
    tweens.push(tween)

    var deathFadeTween = new TWEEN.Tween(points[i].mesh.material)
      .to({opacity:0}, opts.duration)
      .easing(TWEEN.Easing.Quadratic.In)
    deathFadeTween.start();
  }
  return tweens
};

/**
* moves the sHPoints
* @method updateSHPoints
* @param {Object} opts
*   @param {Number} opts.time
*   @param {Number} opts.oldTime
*   @param {Function} opts.easing
*   @param {Number} opts.duration
*/
TweenController.prototype.updateSHPoints = function(opts) {
  var tweens = []
  var environment = this.environment
  var pointCloud = environment.pointCloud

  var deltaT = Math.abs(opts.time - opts.oldTime) //Work out the difference between the old time and the new time

  if (deltaT <= 2 ) { // if the difference is 2 or less make the animations follow the curve
    allPointsFromCurve()
  } else if ( ( deltaT >= 3 ) && environment.component.historyView && environment.focussedPoint ) { // linear, focussed point is curvy
    linearAndCurve()
  } else { // all linear animations
    allPointsLinear(opts)
  }

  function allPointsFromCurve () {
    _.forEach(pointCloud.sHPoints, function (sHPoint, i) {
      var clickTarget = pointCloud.sHPointClickTargets[i]
      createPointTweensFromCurve(clickTarget, clickTarget.curve)
      createPointTweensFromCurve(sHPoint, clickTarget.curve)
    })
  }

  function linearAndCurve() {

    _.forEach(pointCloud.sHPoints, function (sHPoint, i) {
      var clickTarget = pointCloud.sHPointClickTargets[i] // get the clickTarget

      if (clickTarget.id === environment.focussedPoint.id) { // if the point is the selectedStakeholder, then move it along the curve
        createPointTweensFromCurve(sHPoint, clickTarget.curve)
        createPointTweensFromCurve(clickTarget, clickTarget.curve)
      } else { // for all other points, move them in a straight line
        var snap = clickTarget.snapshots.objectAt( opts.time - 1 )
        var newCoords = coordsFromSnapshot(snap)

        createPointTweens({
          newCoords : newCoords,
          point : sHPoint,
          duration : opts.duration,
          easing : opts.easing
        })
        createPointTweens({
          newCoords : newCoords,
          point : clickTarget,
          duration : opts.duration,
          easing : opts.easing
        })
      }
    })
  }

  function allPointsLinear () {
    var week = opts.time
    var sHPoints = pointCloud.sHPoints
    var clickTargets = pointCloud.sHPointClickTargets

    _.forEach(clickTargets, function (clickTarget, i) {
      var sHPoint = sHPoints[i]
      var snap = clickTarget.snapshots.objectAt(week-1)
      var newCoords = coordsFromSnapshot(snap)
      createPointTweens({
        newCoords : newCoords,
        point : sHPoint,
        duration : opts.duration,
        easing : opts.easing
      })
      createPointTweens({
        newCoords : newCoords,
        point : clickTarget,
        duration : opts.duration,
        easing : opts.easing
      })
    })
  }

  //Given a curve it will make the dot follow the line
  function createPointTweensFromCurve (sHPoint, curve) {
    if (curve) {
      sHPoint.curveLocation = curveLocation(opts.oldTime)
      var newCurveLocation = curveLocation(opts.time)

      var tween = new TWEEN.Tween(sHPoint)
          .to({curveLocation: newCurveLocation}, opts.duration)
          .easing(opts.easing)
          .onUpdate(function () {
            sHPoint.mesh.position.copy(
              // use the tweened curve location float to get the current coordinates of the point on the curve
              curve.getPoint(sHPoint.curveLocation)
            )
          })
          .start();
      tweens.push(tween)
    }
  }
  // returns a float between 0 and 1 that represent where the point sits on the curve.
  // 0 would be the beginning of the curve, 1 would be the end.
  function curveLocation(week) {
    var timeFrame = environment.project.get('timeframe') // timeframe is the total amount of weeks in the project
    return ( ( week - 1 ) / ( timeFrame - 1 ) )
  }

  /**
  * moves a mesh from its current location to opts.newCoords
  * @method createPointTweens
  * @param {Object} opts
  *   @param {Object} opts.newCoords THREE.Vector3
  *   @param {Object} opts.point sHPoint
  *   @param {number} opts.duration
  *   @param {Function} opts.easing
  */
  function createPointTweens (opts) {
    var point = opts.point
    var coords = opts.newCoords

    var tween = new TWEEN.Tween(point.mesh.position)
        .to({x: coords.x, y: coords.y, z: coords.z}, opts.duration)
        .easing(opts.easing)
        .start();
    tweens.push(tween)
  }
  return tweens
};

TweenController.prototype.fadeInConnections = function(opts) {
  var tweens = []
  var connections = this.environment.lineGroup.primaryConnections

  _.forEach(connections, function (connection) {
    var destinationOpacity = connection.mesh.material.opacity
    connection.mesh.material.opacity = 0
    var tween = new TWEEN.Tween(connection.mesh.material)
        .to({opacity: destinationOpacity}, opts.duration)
        .easing(opts.easing)
    tween.start();
    tweens.push(tween)
  })
  return tweens
};

TweenController.prototype.fadeOutConnections = function(opts) {
  var tweens = []
  var connections = this.environment.lineGroup.primaryConnections

  _.forEach(connections, function (connection) {
    var tween = new TWEEN.Tween(connection.mesh.material)
        .to({opacity: 0}, opts.duration)
        .easing(opts.easing)
    tween.start();
    tweens.push(tween)
  })
  return tweens
};

TweenController.prototype.fadeInHistory = function(opts) {
  var tweens = []
  var lines = this.environment.historyTailGroup.historyTails

  _.forEach(lines, function (line) {
    var tween = new TWEEN.Tween(line.mesh.material)
        .to({opacity: 1}, opts.duration)
        .easing(opts.easing)
        .onComplete(function () {
          line.mesh.material.transparent = false
        })
    tween.start();
    tweens.push(tween)
  })
  return tweens
};

TweenController.prototype.fadeOutHistory = function(opts) {
  var tweens = []
  var lines = this.environment.historyTailGroup.historyTails
  // Lines is an array, as defined in the HistoryTailGroup. This is to allow for the potential to have multiple tails
  // Current implementation is for only one tail at a time
  _.forEach(lines, function (line) {
    var tween = new TWEEN.Tween(line.mesh.material)
        .to({opacity: 0}, opts.duration)
        .easing(opts.easing)
        .onStart(function () {
          line.mesh.material.transparent = true
        })
        .start();
    tweens.push(tween)
  })
  return tweens
};

/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// chained animations //////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////// simple //////////////////////////////////////

TweenController.prototype.buildHistorytails = function(sHPoint) {
  var environment = this.environment

  environment.historyTailGroup.buildTails({
    sHPoint : sHPoint
  })

  environment.addObjectsToScene(environment.historyTailGroup.historyTails)
  var tweens = this.fadeInHistory({
    duration : 300,
    easing : TWEEN.Easing.Quadratic.Out
  })
  return _.last(tweens)
};

TweenController.prototype.removeHistoryTails = function () {
  // tweens are started in fadeOutHistory
  var fadeOutTweens = this.fadeOutHistory({
    duration : 300,
    easing : TWEEN.Easing.Quadratic.In
  })
  var lastTween = _.last(fadeOutTweens)
  // return last tween to access .onComplete
  return lastTween
}

TweenController.prototype.updateHistoryTail = function(sHPoint) {
  var self = this
  var environment = this.environment
  var tween
  if (_.isEmpty(environment.historyTailGroup.historyTails)) {
    // create historyTail
    tween = this.buildHistorytails(sHPoint)
    tween.onComplete(function () {
      // move target
      environment.target.updatePosition(environment.focussedPoint)
    })
  } else {
    // remove old historyTail
    tween = this.removeHistoryTails()
    tween.onComplete( function () {
      environment.removeObjectsFromScene(environment.historyTailGroup.historyTails)
      // move target
      environment.target.updatePosition(environment.focussedPoint)
      // create new history tail
      self.buildHistorytails(sHPoint)
    })
  }
  return tween
};

TweenController.prototype.buildDistroCloud = function() {
  var self = this
  var environment = this.environment
  var distributionCloud = environment.distributionCloud
  var week = environment.currentWeek
  var sh_id = environment.focussedPoint.id
  var projectId = environment.project.get('id')

  distributionCloud.getVotes({ // ajax call
    week : week,
    stakeholderId : sh_id,
    projectId : projectId
  }).then(function (votes) {

    distributionCloud.createDistributionPoints({
      votes : votes,
      sHPoint : environment.focussedPoint
    })

    environment.addObjectsToScene(distributionCloud.distributionPoints)
    self.distroCloudBirth({
      time : week,
      duration : 400,
      easing : TWEEN.Easing.Quadratic.Out
    })
  })
};

TweenController.prototype.removeDistroCloud = function() {
  var environment = this.environment
  var deathTweens = this.distroCloudDeath({
    duration : 200,
    easing : TWEEN.Easing.Quadratic.Out
  })
  var lastDeathTween = _.last(deathTweens)
  lastDeathTween.onComplete(function () {
    environment.removeObjectsFromScene(environment.distributionCloud.distributionPoints)
  })
}

////////////////////////////////////// updateTime //////////////////////////////////////

TweenController.prototype.updateTimeNoViewsWithFocus = function(time, oldTime) {
  var environment = this.environment
  // move sHPoints
  var tweens = this.updateSHPoints({
    time : time,
    oldTime : oldTime,
    easing: TWEEN.Easing.Exponential.Out,
    duration : 1500
  })
  var lastTween = _.last(tweens)
  // update position of target
  lastTween.onUpdate(function () {
    environment.target.updatePosition(environment.focussedPoint)
  })
};


TweenController.prototype.updateTimeRelationView = function(time, oldTime) {
  var environment = this.environment

  environment.lineGroup.drawConnections({
    projectId : environment.project.get('id'),
    sHPoint : environment.focussedPoint,
    currentWeek: time
  })

  var sHPointTweens = this.updateSHPoints({
    time : time,
    oldTime : oldTime,
    easing: TWEEN.Easing.Exponential.Out,
    duration : 1500
  })

  var lastTween = _.last(sHPointTweens)

  lastTween.onUpdate(function () {
    environment.target.updatePosition(environment.focussedPoint) // make the target follow the point
    environment.lineGroup.needsUpdate = true // make the lines follow the points
  })

  lastTween.onComplete(function () {
    environment.lineGroup.needsUpdate = false
  })
}

TweenController.prototype.updateTimeDistroView = function(time, oldTime) {

  var self = this
  var environment = this.environment
  //Distro cloud death animation
  var deathTweens = this.distroCloudDeath({
    duration : 300,
    easing : TWEEN.Easing.Quadratic.Out
  })
  var lastDeathTween = _.last(deathTweens)
  lastDeathTween.onComplete( function () {
    environment.removeObjectsFromScene(environment.distributionCloud.distributionPoints)
    //Moving the stakeholder points
    var sHPointTweens = self.updateSHPoints({
      time : time,
      oldTime : oldTime,
      easing : TWEEN.Easing.Linear.None,
      duration : 500
    })
    var lastSHPointTween = _.last(sHPointTweens)
    //Move the target with the selected stakeholder point
    lastSHPointTween.onUpdate(function () {
      environment.target.updatePosition(environment.focussedPoint)
    })
    .onComplete(function () {
      //Rebuild Dristro cloud
      self.buildDistroCloud()
    })
  })
}

TweenController.prototype.updateTimeRelationDistroViews = function(time, oldTime) {
  var self = this
  var environment = this.environment

  var deathTweens = this.distroCloudDeath({
    duration : 300,
    easing : TWEEN.Easing.Quadratic.Out
  })
  var lastDeathTween = _.last(deathTweens)

  lastDeathTween.onComplete( function () {
    environment.removeObjectsFromScene(environment.distributionCloud.distributionPoints)

    var sHPointTweens = self.updateSHPoints({
      time : time,
      oldTime : oldTime,
      easing : TWEEN.Easing.Quadratic.InOut,
      duration : 500
    })
    var lastSHPointTween = _.last(sHPointTweens)
    lastSHPointTween.onUpdate(function () {
      environment.target.updatePosition(environment.focussedPoint) // make the target follow the point
      environment.lineGroup.needsUpdate = true // make the lines follow the points
    })
    .onComplete(function () {
      environment.lineGroup.needsUpdate = false
      self.buildDistroCloud()
    });
  })
};

////////////////////////////////////// updateSelectedStakeholder //////////////////////////////////////

TweenController.prototype.updateSelectedStakeholderConnectionView = function(sHPoint) { // also history
  var self = this
  var environment = this.environment

  // move the target to the new point
  environment.target.updatePosition(sHPoint)

  if (environment.component.historyView) {
    // fade out the historyTail
    var tween = _.last(self.fadeOutHistory({
      duration : 150,
      easing : TWEEN.Easing.Quadratic.In
    }))
    tween.onComplete(function () {
      environment.removeObjectsFromScene( environment.historyTailGroup.historyTails )
      // Create the new historyTail
      self.buildHistorytails(sHPoint)
    })
  }

  if (environment.lineGroup.primaryConnections.length > 0) {
    // remove connecting lines
    var fadeOutTweens = this.fadeOutConnections({
      duration : 150,
      easing : TWEEN.Easing.Quadratic.In
    })

    var lastFadeOutTween = _.last(fadeOutTweens)
    lastFadeOutTween.onComplete(function () {
      // crate new connecting lines
      environment.lineGroup.drawConnections({
        projectId : environment.project.get('id'),
        sHPoint : sHPoint,
        currentWeek: environment.currentWeek
      })
    })
  } else { // clicking a point after having the modal closed
    // create connecting lines
    environment.lineGroup.drawConnections({
      projectId : environment.project.get('id'),
      sHPoint : sHPoint,
      currentWeek: environment.currentWeek
    })
  }
};

TweenController.prototype.updateSelectedStakeholderDistroView = function (sHPoint) { // also history
  var self = this
  var environment = this.environment

  if (environment.component.historyView) {
    // remove the old historyTail
    var removeHistoryTailsTween = this.removeHistoryTails()
    removeHistoryTailsTween.onComplete( function () {
      environment.removeObjectsFromScene( environment.historyTailGroup.historyTails )
    })
  }

  // remove the distro cloud
  var deathTweens = this.distroCloudDeath({
    duration : 300,
    easing : TWEEN.Easing.Quadratic.In
  })

  var lastDeathTween = _.last(deathTweens)
  lastDeathTween.onComplete(function () {
    environment.removeObjectsFromScene(environment.distributionCloud.distributionPoints)
    // move the target
    environment.target.updatePosition(environment.focussedPoint)
    // create new dirsto cloud
    self.buildDistroCloud()
    // crate new historyTail
    if (environment.component.historyView) { self.buildHistorytails(sHPoint) }
  })
}

TweenController.prototype.updateSelectedStakeholderAllViews = function(sHPoint) {
  var self = this
  var environment = this.environment

  // if historyView is active, remove old history tail
  if (environment.component.historyView) {
    var removeHistoryTailsTween = this.removeHistoryTails()
    removeHistoryTailsTween.onComplete( function () {
      environment.removeObjectsFromScene(environment.historyTailGroup.historyTails)
    })
  }

  // remove the distro points
  var cloudDeathTweens = this.distroCloudDeath({
    duration : 300,
    easing : TWEEN.Easing.Quadratic.In
  })

  // fade out old connections
  if (environment.lineGroup.primaryConnections.length > 0) {
    console.log('adfasdfasdf')
    this.fadeOutConnections({
      duration : 300,
      easing : TWEEN.Easing.Quadratic.In
    })
  }

  var lastDeathTween = _.last(cloudDeathTweens)
  lastDeathTween.onComplete(function () {
    environment.removeObjectsFromScene(environment.distributionCloud.distributionPoints)

    // move the target
    environment.target.updatePosition(sHPoint)
    // rebuild the distro cloud
    self.buildDistroCloud()
    // create new connections
    environment.lineGroup.drawConnections({
      projectId : environment.project.get('id'),
      sHPoint : sHPoint,
      currentWeek: environment.currentWeek
    })
    // if in historyView, rebuild the tail for the newly selected stakeholder
    if (environment.component.historyView) { self.buildHistorytails(sHPoint) }
  })
}

