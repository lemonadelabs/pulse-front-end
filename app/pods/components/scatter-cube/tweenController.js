export default function TweenController (opts) {
  this.environment = opts.environment

}

/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// singular animations //////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

TweenController.prototype.distroCloudBirth = function(currentWeek) {
  var self = this

  var tweens = []

  var points = this.environment.distributionCloud.distributionPoints

  var data = self.environment.distributionCloud.data[currentWeek]

  for (var i = 0; i < points.length; i++) {
    var x = (data[i].power) * 1.8  + 0.1
    var y = (data[i].support) * 1.8  + 0.1
    var z = (data[i].vital) * 1.8  + 0.1

    var tween = new TWEEN.Tween(points[i].mesh.position)
      .to({x: x, y: y, z: z}, 1500)
      .easing(TWEEN.Easing.Exponential.Out)
      .start();

    tweens.push(tween)
  }
  return tweens
}

TweenController.prototype.distroCloudDeath = function() {
  var self = this

  var tweens = []

  var points = this.environment.distributionCloud.distributionPoints

  var coords = this.environment.distributionCloud.selectedStakeholder.mesh.position
  var x = coords.x
  var y = coords.y
  var z = coords.z

  for (var i = 0; i < points.length; i++) {

    var tween = new TWEEN.Tween(points[i].mesh.position)
      .to({x: x, y: y, z: z}, 2000)
      .easing(TWEEN.Easing.Exponential.Out)
      .start();

    tweens.push(tween)
  }
  return tweens
};

TweenController.prototype.updateSHPoints = function(time) {
  var tweens = []
  var pointCloud = this.environment.pointCloud


  _.forEach(pointCloud.sHPointClickTargets, createPointTweens)
  _.forEach(pointCloud.sHPoints, createPointTweens)

  function createPointTweens (sHPoint) {
    var x = (sHPoint.weeks[time].power) * 1.8  + 0.1
    var y = (sHPoint.weeks[time].support) * 1.8  + 0.1
    var z = (sHPoint.weeks[time].vital) * 1.8  + 0.1

    var tween = new TWEEN.Tween(sHPoint.mesh.position)
        .to({x: x, y: y, z: z}, 1500)
        .easing(TWEEN.Easing.Exponential.Out)
        .start();

    tweens.push(tween)
  }
  return tweens
};

/////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////// chained animations //////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

TweenController.prototype.updateTimeNoViews = function(time) {
  this.updateSHPoints(time)
};

TweenController.prototype.updateTimeRelationView = function(time) {
  var self = this

  this.environment.removeConnectingLines()
  self.environment.lineGroup.drawConnections(self.environment.focussedPoint, time)
  self.environment.addObjectsToScene(self.environment.lineGroup.primaryConnections)

  var sHPointTweens = this.updateSHPoints(time)

  var lastTween = _.last(sHPointTweens)

  lastTween.onUpdate(function () {
    self.environment.target.updatePosition(self.environment.focussedPoint) // make the target follow the point
    self.environment.lineGroup.needsUpdate = true // make the lines follow the points
  })

  lastTween.onComplete(function () {
    self.environment.lineGroup.needsUpdate = false
  })
};

TweenController.prototype.updateTimeDistroView = function(time) {
  var self = this
  var environment = this.environment

  var deathTweens = this.distroCloudDeath() // returns a promise
  var lastDeathTween = _.last(deathTweens)

  lastDeathTween.onComplete( function () {
    environment.removeObjectsFromScene(environment.distributionCloud.distributionPoints)

    var sHPointTweens = self.updateSHPoints(time)
    var lastSHPointTween = _.last(sHPointTweens)
        .onUpdate(function () {
          self.environment.target.updatePosition(self.environment.focussedPoint)
        })
        .onComplete(function () {
          environment.distributionCloud.createDistributionPoints(time)
          environment.addObjectsToScene(environment.distributionCloud.distributionPoints)
          var birthTweens = self.distroCloudBirth(time)
        })
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