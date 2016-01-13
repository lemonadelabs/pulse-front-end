/*global TWEEN,_*/
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
      .to({x: x, y: y, z: z}, opts.duration)
      .easing(opts.easing)
      .onComplete(function () {
        environment.distributionCloud.transitioning = false
      })
      .start();
    tweens.push(tween)

    points[i].updateColor(environment.camera.position) // premeditates the change in color for the tween to fade to
    var birthFadeTween = new TWEEN.Tween(points[i].mesh.material)
      .to({opacity:points[i].mesh.material.opacity}, opts.duration)
      .easing(TWEEN.Easing.Exponential.In)
      .start();
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
      .start();
  }
  return tweens
};

TweenController.prototype.updateSHPoints = function(opts) {
  var tweens = []
  var pointCloud = this.environment.pointCloud

  _.forEach(pointCloud.sHPointClickTargets, createPointTweens)
  _.forEach(pointCloud.sHPoints, createPointTweens)

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
        .start();
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
        .start();
    tweens.push(tween)
  })
  return tweens
};


/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// chained animations //////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////// simple //////////////////////////////////////

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
  .onComplete(function () {
    environment.removeObjectsFromScene(environment.distributionCloud.distributionPoints)
  })
}

////////////////////////////////////// updateTime //////////////////////////////////////

TweenController.prototype.updateTimeNoViewsWithFocus = function(time) {
  var environment = this.environment
  var tweens = this.updateSHPoints({
    time : time,
    easing: TWEEN.Easing.Exponential.Out,
    duration : 1500
  })
  var lastTween = _.last(tweens)
      .onUpdate(function () {
        environment.target.updatePosition(environment.focussedPoint)
      })
};


TweenController.prototype.updateTimeRelationView = function(time) {
  var environment = this.environment

  environment.removeConnectingLines()
  environment.lineGroup.drawConnections(environment.focussedPoint, time)
  environment.addObjectsToScene(environment.lineGroup.primaryConnections)

  var sHPointTweens = this.updateSHPoints({
    time : time,
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

TweenController.prototype.updateTimeDistroView = function(time) {

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
      easing : TWEEN.Easing.Linear.None,
      duration : 500
    })
    var lastSHPointTween = _.last(sHPointTweens)
    .onUpdate(function () {
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

TweenController.prototype.updateTimeRelationDistroViews = function(time) {
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
      easing : TWEEN.Easing.Quadratic.InOut,
      duration : 500
    })
    var lastSHPointTween = _.last(sHPointTweens)
    .onUpdate(function () {
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

TweenController.prototype.updateSelectedStakeholderConnectionView = function(sHPoint) {
  var self = this
  var environment = this.environment

  environment.target.updatePosition(sHPoint)

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
  } else {
    environment.lineGroup.drawConnections(sHPoint, environment.currentWeek)
    environment.addObjectsToScene(environment.lineGroup.primaryConnections)
    self.fadeInConnections({
      duration : 500,
      easing : TWEEN.Easing.Quadratic.Out
    })
  }
};

TweenController.prototype.updateSelectedStakeholderDistroView = function (sHPoint) {

  var self = this
  var environment = this.environment
  var time = this.environment.currentWeek
  var deathTweens = this.distroCloudDeath({
    duration : 300,
    easing : TWEEN.Easing.Quadratic.In
  })
  var lastDeathTween = _.last(deathTweens)
  .onComplete(function () {
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
  })
}

TweenController.prototype.updateSelectedStakeholderDistroConnectionsViews = function(sHPoint) {
  var self = this
  var environment = this.environment
  var time = this.environment.currentWeek

  var cloudDeathTweens = this.distroCloudDeath({
    duration : 300,
    easing : TWEEN.Easing.Quadratic.In
  })
  var lastDeathTween = _.last(cloudDeathTweens)
  .onComplete(function () {
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
  })

  if (!_.isEmpty(environment.lineGroup.primaryConnections)) {
    this.fadeOutConnections({
      duration : 300,
      easing : TWEEN.Easing.Quadratic.In
    })
  }
}

