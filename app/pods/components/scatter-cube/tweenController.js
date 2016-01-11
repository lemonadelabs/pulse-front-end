export default function TweenController (opts) {
  this.environment = opts.environment

}

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

TweenController.prototype.onUpdateTime = function(time) {
  var self = this
  var environment = this.environment
  var birthTweens


  var deathTweens = this.distroCloudDeath() // returns a promise

  var lastDeathTween = _.last(deathTweens)

  lastDeathTween.onComplete( function () {

    environment.removeObjectsFromScene(environment.distributionCloud.distributionPoints)

    environment.distributionCloud.createDistributionPoints(time)

    // animate the points!!!

    environment.addObjectsToScene(environment.distributionCloud.distributionPoints)

    birthTweens = self.distroCloudBirth(time)


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