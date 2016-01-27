/*jshint -W083 */

export default function TweenController (opts) {
  this.environment = opts.environment
}

/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// singular animations //////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////


TweenController.prototype.distroCloudBirth = function(opts) {
  var environment = this.environment
  var tweens = []
  var points = environment.distributionCloud.distributionPoints
  var data = environment.distributionCloud.data[opts.time]

  environment.distributionCloud.transitioning = true
  for (var i = 0; i < points.length; i++) {
    var x = (data[i].power) * 1.8  + 0.1
    var y = (data[i].support) * 1.8  + 0.1
    var z = (data[i].vital) * 1.8  + 0.1


    var tween = new TWEEN.Tween(points[i].mesh.position)
      .easing(opts.easing)
      .to({x: x, y: y, z: z}, opts.duration)
      .onComplete(function () {
        environment.distributionCloud.transitioning = false
      })
      .start();
    tweens.push(tween)

    points[i].updateColor(environment.camera.position) // premeditates the change in color for the tween to fade to
    var birthFadeTween = new TWEEN.Tween(points[i].mesh.material)
      .to({opacity:points[i].mesh.material.opacity}, opts.duration)
      .easing(TWEEN.Easing.Exponential.In)
    birthFadeTween.start();
  }
  return tweens
}

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

TweenController.prototype.updateSHPoints = function(opts) {
  var self = this
  var tweens = []
  var environment = this.environment
  var pointCloud = environment.pointCloud

  var deltaT = Math.abs(opts.time - opts.oldTime)

  if (deltaT <= 2 ) { // make the animations follow the curve
    allPointsFromCurve()
  } else if ( ( deltaT >= 3 ) && environment.component.historyView && environment.focussedPoint ) { // linear, focussed point is curvy
    linearAndCurve()
  } else { // all linear animations
    allPointsLinear()
  }

  function linearAndCurve() {
    for (var i = 0; i < pointCloud.sHPoints.length; i++) {
      if (pointCloud.sHPointClickTargets[i].id === environment.focussedPoint.id) {
        createPointTweensFromCurve(pointCloud.sHPoints[i], pointCloud.sHPointClickTargets[i].curve)
        createPointTweensFromCurve(pointCloud.sHPointClickTargets[i], pointCloud.sHPointClickTargets[i].curve)
      } else {
        createPointTweens(pointCloud.sHPoints[i])
        createPointTweens(pointCloud.sHPointClickTargets[i])
      }
    }
  }

  function allPointsFromCurve () {
    for (var i = 0; i < pointCloud.sHPoints.length; i++) {
      createPointTweensFromCurve(pointCloud.sHPointClickTargets[i], pointCloud.sHPointClickTargets[i].curve)
      createPointTweensFromCurve(pointCloud.sHPoints[i], pointCloud.sHPointClickTargets[i].curve)
    }
  }

  function allPointsLinear () {
    _.forEach(pointCloud.sHPoints, function (sHPoint) {createPointTweens(sHPoint)} )
    _.forEach(pointCloud.sHPointClickTargets, function (sHPoint) {createPointTweens(sHPoint)} )
  }

  function createPointTweensFromCurve (sHPoint, curve) {

    if (curve) {
      sHPoint.curveLocation = curveLocation(opts.oldTime)
      var newCurveLocation = curveLocation(opts.time)

      var tween = new TWEEN.Tween(sHPoint)

          .to({curveLocation: newCurveLocation}, opts.duration)
          .easing(opts.easing)
          .onUpdate(function () {
            sHPoint.mesh.position.copy(
              curve.getPoint(sHPoint.curveLocation)
            )
          })
          .start();
      tweens.push(tween)
    }
  }

  function curveLocation(week) {
    var timeFrame = self.environment.metaData[0].timeFrame
    return ( ( week - 1 ) * 1 / ( timeFrame - 1 ) )
  }

  function createPointTweens (sHPoint) {
    var x = (sHPoint.weeks[opts.time].power) * 1.8  + 0.1
    var y = (sHPoint.weeks[opts.time].support) * 1.8  + 0.1
    var z = (sHPoint.weeks[opts.time].vital) * 1.8  + 0.1

    var tween = new TWEEN.Tween(sHPoint.mesh.position)
        .to({x: x, y: y, z: z}, opts.duration)
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
  var fadeOutTweens = this.fadeOutHistory({
    duration : 300,
    easing : TWEEN.Easing.Quadratic.In
  })
  var lastTween = _.last(fadeOutTweens)
  return lastTween
}

TweenController.prototype.updateHistoryTail = function(sHPoint) {
  var self = this
  var environment = this.environment
  var tween
  if (_.isEmpty(environment.historyTailGroup.historyTails)) {
    tween = this.buildHistorytails(sHPoint).onComplete(function () {
      environment.target.updatePosition(environment.focussedPoint)
    })
  } else {
    this.removeHistoryTails().onComplete(function () {
      environment.removeObjectsFromScene(environment.historyTailGroup.historyTails)
      environment.target.updatePosition(environment.focussedPoint)
      self.buildHistorytails(sHPoint)
    })
  }
  return tween
};

TweenController.prototype.buildDistroCloud = function() {
  var environment = this.environment
  environment.distributionCloud.selectedStakeholder = environment.focussedPoint
  environment.distributionCloud.createDistributionPoints(environment.currentWeek)
  environment.addObjectsToScene(environment.distributionCloud.distributionPoints)
  this.distroCloudBirth({
    time : environment.currentWeek,
    duration : 400,
    easing : TWEEN.Easing.Quadratic.Out
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
  var tweens = this.updateSHPoints({
    time : time,
    oldTime : oldTime,
    easing: TWEEN.Easing.Exponential.Out,
    duration : 1500
  })
  var lastTween = _.last(tweens)
  lastTween.onUpdate(function () {
    environment.target.updatePosition(environment.focussedPoint)
  })
};


TweenController.prototype.updateTimeRelationView = function(time, oldTime) {
  var environment = this.environment

  environment.removeConnectingLines()
  environment.lineGroup.drawConnections(environment.focussedPoint, time)
  environment.addObjectsToScene(environment.lineGroup.primaryConnections)

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
      easing : TWEEN.Easing.Linear.None,
      duration : 500
    })
    var lastSHPointTween = _.last(sHPointTweens)
    lastSHPointTween.onUpdate(function () {
      environment.target.updatePosition(environment.focussedPoint)
    })
    .onComplete(function () {
      environment.distributionCloud.createDistributionPoints(time)
      environment.addObjectsToScene(environment.distributionCloud.distributionPoints)
      self.distroCloudBirth({
        time : time,
        duration : 700,
        easing : TWEEN.Easing.Exponential.Out
      })
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
      environment.distributionCloud.createDistributionPoints(time)
      environment.addObjectsToScene(environment.distributionCloud.distributionPoints)
      self.distroCloudBirth({
        time : time,
        duration : 300,
        easing : TWEEN.Easing.Exponential.Out
      })
    });
  })

};

////////////////////////////////////// updateSelectedStakeholder //////////////////////////////////////

TweenController.prototype.updateSelectedStakeholderConnectionView = function(sHPoint) { // also history
  var self = this
  var environment = this.environment

  environment.target.updatePosition(sHPoint)

  if (environment.component.historyView) { // history tail stuff
    var tween = _.last(self.fadeOutHistory({
      duration : 150,
      easing : TWEEN.Easing.Quadratic.In
    }))
    tween.onComplete(function () {
      environment.removeObjectsFromScene( environment.historyTailGroup.historyTails )
      self.buildHistorytails(sHPoint)
    })
  }

  if (!_.isEmpty(environment.lineGroup.primaryConnections)) {
    var fadeOutTweens = this.fadeOutConnections({
      duration : 150,
      easing : TWEEN.Easing.Quadratic.In
    })

    var lastFadeOutTween = _.last(fadeOutTweens)
    lastFadeOutTween.onComplete(function () {
      environment.removeConnectingLines()
      environment.lineGroup.drawConnections(sHPoint, environment.currentWeek)
      environment.addObjectsToScene(environment.lineGroup.primaryConnections)
      self.fadeInConnections({
        duration : 500,
        easing : TWEEN.Easing.Quadratic.Out
      })
    })
  } else { // clicking a point after having the modal closed
    environment.lineGroup.drawConnections(sHPoint, environment.currentWeek)
    environment.addObjectsToScene(environment.lineGroup.primaryConnections)
    self.fadeInConnections({
      duration : 500,
      easing : TWEEN.Easing.Quadratic.Out
    })
  }
};

TweenController.prototype.updateSelectedStakeholderDistroView = function (sHPoint) { // also history

  var self = this
  var environment = this.environment
  var time = this.environment.currentWeek

  if (environment.component.historyView) { this.removeHistoryTails().onComplete(function () {environment.removeObjectsFromScene(environment.historyTailGroup.historyTails) } ) }

  var deathTweens = this.distroCloudDeath({
    duration : 300,
    easing : TWEEN.Easing.Quadratic.In
  })
  var lastDeathTween = _.last(deathTweens)
  lastDeathTween.onComplete(function () {
    environment.removeObjectsFromScene(environment.distributionCloud.distributionPoints)
    environment.target.updatePosition(environment.focussedPoint)
    environment.distributionCloud.selectedStakeholder = sHPoint
    environment.distributionCloud.createDistributionPoints(time)
    environment.addObjectsToScene(environment.distributionCloud.distributionPoints)
    self.distroCloudBirth({
      time : time,
      duration : 500,
      easing : TWEEN.Easing.Quadratic.Out
    });
    if (environment.component.historyView) { self.buildHistorytails(sHPoint) }
  })
}

TweenController.prototype.updateSelectedStakeholderAllViews = function(sHPoint) {
  var self = this
  var environment = this.environment
  var time = this.environment.currentWeek

  if (environment.component.historyView) { this.removeHistoryTails().onComplete(function () {environment.removeObjectsFromScene(environment.historyTailGroup.historyTails) } ) }

  var cloudDeathTweens = this.distroCloudDeath({
    duration : 300,
    easing : TWEEN.Easing.Quadratic.In
  })
  var lastDeathTween = _.last(cloudDeathTweens)
  lastDeathTween.onComplete(function () {
    environment.removeObjectsFromScene(environment.distributionCloud.distributionPoints)
    environment.target.updatePosition(sHPoint)
    environment.distributionCloud.selectedStakeholder = sHPoint
    environment.distributionCloud.createDistributionPoints(time)
    environment.addObjectsToScene(environment.distributionCloud.distributionPoints)
    self.distroCloudBirth({
      time : time,
      duration : 500,
      easing : TWEEN.Easing.Quadratic.Out
    })

    environment.removeConnectingLines()
    environment.lineGroup.drawConnections(sHPoint, environment.currentWeek)
    environment.addObjectsToScene(environment.lineGroup.primaryConnections)
    self.fadeInConnections({
      duration : 150,
      easing : TWEEN.Easing.Quadratic.Out
    })

    if (environment.component.historyView) { self.buildHistorytails(sHPoint) }

  })

  if (!_.isEmpty(environment.lineGroup.primaryConnections)) {
    this.fadeOutConnections({
      duration : 300,
      easing : TWEEN.Easing.Quadratic.In
    })
  }
}

