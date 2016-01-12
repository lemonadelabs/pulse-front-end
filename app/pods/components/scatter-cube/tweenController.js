/*global TWEEN,_*/
export default function TweenController (opts) {
  this.environment = opts.environment

}

/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// singular animations //////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

TweenController.prototype.replaceLines = function(sHPoint) {
  var environment = this.environment
  environment.removeConnectingLines()
  environment.lineGroup.drawConnections(sHPoint, environment.currentWeek)
  environment.addObjectsToScene(environment.lineGroup.primaryConnections)
};

TweenController.prototype.distroCloudBirth = function(opts) {
  var self = this

  var tweens = []

  var points = this.environment.distributionCloud.distributionPoints

  var data = self.environment.distributionCloud.data[opts.time]


  for (var i = 0; i < points.length; i++) {
    var x = (data[i].power) * 1.8  + 0.1
    var y = (data[i].support) * 1.8  + 0.1
    var z = (data[i].vital) * 1.8  + 0.1

    var tween = new TWEEN.Tween(points[i].mesh.position)
      .to({x: x, y: y, z: z}, opts.duration)
      .easing(opts.easing)
      .start();
    //
    // var deathFadeTween = new TWEEN.Tween(points[i].mesh.material)
    //   .to({opacity:points[i].mesh.material.opacity}, opts.duration)
    //   .easing(TWEEN.Easing.Quadratic.In)
    //   .start();

    tweens.push(tween)
  }
  return tweens
}

TweenController.prototype.distroCloudDeath = function(opts) {
  var self = this

  var tweens = []

  var points = this.environment.distributionCloud.distributionPoints

  // var coords = this.environment.focussedPoint.mesh.position
  var coords = this.environment.distributionCloud.selectedStakeholder.mesh.position
  var x = coords.x
  var y = coords.y
  var z = coords.z

  for (var i = 0; i < points.length; i++) {

    var tween = new TWEEN.Tween(points[i].mesh.position)
      .to({x: x, y: y, z: z}, opts.duration)
      .easing(opts.easing)
      .start();

    var deathFadeTween = new TWEEN.Tween(points[i].mesh.material)
      .to({opacity:0}, opts.duration)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start();

    tweens.push(tween)
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

/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// chained animations //////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////



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

TweenController.prototype.removeDistroCloud = function() {
  var environment = this.environment
  var deathTweens = this.distroCloudDeath({
    duration : 200,
    easing : TWEEN.Easing.Quadratic.Out
  }) // returns a promise
  var lastDeathTween = _.last(deathTweens)
      .onComplete(function () {
        environment.removeObjectsFromScene(environment.distributionCloud.distributionPoints)
      })
}

TweenController.prototype.updateTimeRelationView = function(time) {
  var self = this
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
};

TweenController.prototype.updateTimeDistroView = function(time) {

  var self = this
  var environment = this.environment

  var deathTweens = this.distroCloudDeath({
    duration : 500,
    easing : TWEEN.Easing.Exponential.Out
  }) // returns a promise
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
          self.environment.target.updatePosition(self.environment.focussedPoint)
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

};

TweenController.prototype.updateTimeRelationDistroViews = function(time) {
  var self = this
  var environment = this.environment

  var deathTweens = this.distroCloudDeath({
    duration : 300,
    easing : TWEEN.Easing.Quadratic.Out
  }) // returns a promise
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
        })
  })

};

TweenController.prototype.updateSelectedStakeholderDistroView = function (sHPoint) {

  var self = this
  var environment = this.environment
  var time = this.environment.currentWeek
  var deathTweens = this.distroCloudDeath({
    duration : 300,
    easing : TWEEN.Easing.Quadratic.In
  }) // returns a promise
  var lastDeathTween = _.last(deathTweens)
      .onComplete(function () {
        environment.removeObjectsFromScene(environment.distributionCloud.distributionPoints)
        environment.target.updatePosition(self.environment.focussedPoint)
        environment.distributionCloud.selectedStakeholder = sHPoint
        environment.distributionCloud.createDistributionPoints(time)
        environment.addObjectsToScene(environment.distributionCloud.distributionPoints)
        self.distroCloudBirth({
          time : time,
          duration : 500,
          easing : TWEEN.Easing.Quadratic.Out
        })

      })
}

TweenController.prototype.updateSelectedStakeholderDistroConnectionsViews = function(sHPoint) {
  var self = this
  var environment = this.environment
  var time = this.environment.currentWeek
  var deathTweens = this.distroCloudDeath({
    duration : 300,
    easing : TWEEN.Easing.Quadratic.In
  }) // returns a promise
  var lastDeathTween = _.last(deathTweens)
      .onComplete(function () {
        environment.removeObjectsFromScene(environment.distributionCloud.distributionPoints)
        environment.target.updatePosition(self.environment.focussedPoint)
        environment.distributionCloud.selectedStakeholder = sHPoint
        environment.distributionCloud.createDistributionPoints(time)
        environment.addObjectsToScene(environment.distributionCloud.distributionPoints)
        self.distroCloudBirth({
          time : time,
          duration : 500,
          easing : TWEEN.Easing.Quadratic.Out
        })

        self.replaceLines(sHPoint)

      })
};




    // tween already returns a promise
      // whats a promise?
        // its a promise that something will happen in the future
          // there are two types of things taht can happen in the future
            // 1. resolved
              // usually, we know when a promise is resolved when the `.then` for the promise executes (see fig. A)
              // with a resolved promise, you can return something (whatever you want)
                // might look like: promise.resolve(thingIWantToReturn)
            // 2. rejected
              // you can probably also return soemthing when you reject a promise


    // fig. A
      /*

        $.ajax({
          url: ,
          method: ,
          ...
        }).then(function (data) { // ajax returns a promise, and when  `.then` is called, that means the promise was resolved

        }).catch(function (err) { // when a promise is rejected, `.catch` is called,

        })


      */




  // }

  // what we need is a way of seeing when all tweens are made,
    // and then when they're all made we want to return an array of them to whoever calls this thing
