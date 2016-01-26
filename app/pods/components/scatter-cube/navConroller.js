export default function NavConroller (opts) {
  this.environment = opts.environment
  this.focalPoint = new THREE.Vector3(1,1,1)
  this.dollyZoomed = false
  this.returnLocation = undefined
}


NavConroller.prototype.powerXsupportOrthographicLoHi = function() {
  var self = this
  var camera = this.environment.camera

  if (this.dollyZoomed) {
    var dollyInTween = self.dollyZoom({
      destination : self.returnLocation,
      duration : 800,
    })
    dollyInTween.onComplete(function () {
      moveAndDollyOut()
    })
  } else {
    moveAndDollyOut()
  }

  function moveAndDollyOut () {
    self.focalPoint = new THREE.Vector3(1,1,1)
    var moveTween = self.moveCamera({
      destination : new THREE.Vector3(1,1,4.2),
      duration : 800,
      easing : TWEEN.Easing.Quadratic.InOut,
    })

    // dolly zoom out
    moveTween.onComplete(function () {
      self.returnLocation = camera.position.clone()
      self.focalPoint = new THREE.Vector3(1,1,2)
      var dollyOutTween = self.dollyZoom({
        destination : new THREE.Vector3(1,1,1004.2),
        duration : 800
      })
    })
  }

}

NavConroller.prototype.powerXvitalPerspectiveHiHi = function() {
  var self = this
  var camera = this.environment.camera

  if (this.dollyZoomed) {
    var dollyInTween = self.dollyZoom({
      destination : self.returnLocation,
      duration : 800,
    })
    dollyInTween.onComplete(function () {
      move()
    })
  } else {
    move()
  }

  function move () {
    var moveTween = self.moveCamera({
      destination : new THREE.Vector3(3.2,1.7,3.7),
      duration : 800,
      easing : TWEEN.Easing.Quadratic.InOut,
      focalPoint : new THREE.Vector3(1,1,1)
    })
  }

};


NavConroller.prototype.vitalXsupportOrthographicHiLo = function() {
  var self = this
  var camera = this.environment.camera



  if (this.dollyZoomed) {
    var dollyInTween = self.dollyZoom({
      destination : self.returnLocation,
      duration : 800,
    })
    dollyInTween.onComplete(function () {
      moveAndDollyOut()
    })
  } else {
    moveAndDollyOut()
  }

  function moveAndDollyOut () {
    self.focalPoint = new THREE.Vector3(1,1,1)
    var moveTween = self.moveCamera({
      destination : new THREE.Vector3(4.6,1,1),
      duration : 800,
      easing : TWEEN.Easing.Quadratic.InOut,
    })

    // dolly zoom out
    moveTween.onComplete(function () {
      self.returnLocation = camera.position.clone()
      // self.returnFocalPoint =
      self.focalPoint = new THREE.Vector3(2,1,1)
      var dollyOutTween = self.dollyZoom({
        destination : new THREE.Vector3(1004.6,1,1),
        duration : 800
      })
    })
  }
}


NavConroller.prototype.vitalXpowerPerspectiveLoHi = function() {
  var self = this
  var camera = this.environment.camera

  if (this.dollyZoomed) {
    var dollyInTween = self.dollyZoom({
      destination : self.returnLocation,
      duration : 800,
    })
    dollyInTween.onComplete(function () {
      move()
    })
  } else {
    move()
  }

  function move () {
    var moveTween = self.moveCamera({
      destination : new THREE.Vector3(3.8, 1.5, -1.2),
      duration : 800,
      easing : TWEEN.Easing.Quadratic.InOut,
      focalPoint : new THREE.Vector3(1,1,1)
    })
  }
};

NavConroller.prototype.powerXsupportOrthographicHiLo = function() {

  var self = this
  var camera = this.environment.camera


  if (this.dollyZoomed) {
    var dollyInTween = self.dollyZoom({
      destination : self.returnLocation,
      duration : 800,
    })
    dollyInTween.onComplete(function () {
      moveAndDollyOut()
    })
  } else {
    moveAndDollyOut()
  }

  function moveAndDollyOut () {
    self.focalPoint = new THREE.Vector3(1,1,1)
    var moveTween = self.moveCamera({
      destination : new THREE.Vector3(1,1,-2.6),
      duration : 800,
      easing : TWEEN.Easing.Quadratic.InOut,
    })

    // dolly zoom out
    moveTween.onComplete(function () {
      self.returnLocation = camera.position.clone()
      // self.returnFocalPoint =
      self.focalPoint = new THREE.Vector3(1,1,0)
      var dollyOutTween = self.dollyZoom({
        destination : new THREE.Vector3(1,1,-1002.6),
        duration : 800
      })
    })
  }
};

NavConroller.prototype.powerXvitalPerspectiveLoLo = function() {
  var self = this
  var camera = this.environment.camera

  if (this.dollyZoomed) {
    var dollyInTween = self.dollyZoom({
      destination : self.returnLocation,
      duration : 800,
    })
    dollyInTween.onComplete(function () {
      move()
    })
  } else {
    move()
  }

  function move () {
    var moveTween = self.moveCamera({
      destination : new THREE.Vector3(-1.2, 1.5, -1.8),
      duration : 800,
      easing : TWEEN.Easing.Quadratic.InOut,
      focalPoint : new THREE.Vector3(1,1,1)
    })
  }
};

NavConroller.prototype.vitalXsupportOrthographicLoHo = function() {

  var self = this
  var camera = this.environment.camera

  if (this.dollyZoomed) {
    var dollyInTween = self.dollyZoom({
      destination : self.returnLocation,
      duration : 800,
    })
    dollyInTween.onComplete(function () {
      moveAndDollyOut()
    })
  } else {
    moveAndDollyOut()
  }

  function moveAndDollyOut () {
    self.focalPoint = new THREE.Vector3(1,1,1)
    var moveTween = self.moveCamera({
      destination : new THREE.Vector3(-2.5,1,1),
      duration : 800,
      easing : TWEEN.Easing.Quadratic.InOut,
    })

    // dolly zoom out
    moveTween.onComplete(function () {
      self.returnLocation = camera.position.clone()
      // self.returnFocalPoint =
      self.focalPoint = new THREE.Vector3(0,1,1)
      var dollyOutTween = self.dollyZoom({
        destination : new THREE.Vector3(-1002.5,1,1),
        duration : 800
      })
    })
  }
};

NavConroller.prototype.vitalXpowerPerspectiveHiLo = function() {
  var self = this
  var camera = this.environment.camera

  if (this.dollyZoomed) {
    var dollyInTween = self.dollyZoom({
      destination : self.returnLocation,
      duration : 800,
    })
    dollyInTween.onComplete(function () {
      move()
    })
  } else {
    move()
  }

  function move () {
    var moveTween = self.moveCamera({
      destination : new THREE.Vector3(-1.8, 1.5, 3.2),
      duration : 800,
      easing : TWEEN.Easing.Quadratic.InOut,
      focalPoint : new THREE.Vector3(1,1,1)
    })
  }
};




NavConroller.prototype.moveCamera = function (opts) {

  var self = this

  var camera = this.environment.camera

  var destination = opts.destination
  var newX = destination.x
  var newy = destination.y
  var newZ = destination.z

  var tweenIncrementors = {
    x : camera.position.x,
    y : camera.position.y,
    z : camera.position.z
  }

  var tween = new TWEEN.Tween(tweenIncrementors)
      .to({
        x : newX,
        y : newy,
        z : newZ
      }, opts.duration)
      .easing(opts.easing)
      .onUpdate(function () {
        camera.position.set(tweenIncrementors.x, tweenIncrementors.y, tweenIncrementors.z)
        camera.lookAt(self.focalPoint)

        // var newVFOV = findVFOV({
          // depth : camera.position.distanceTo(opts.focalPoint),
          // height : self.screenHeight,
        // })
        // camera.fov = newVFOV
        // camera.updateProjectionMatrix()
      })
      .start();
  return tween
}


NavConroller.prototype.dollyZoom = function (opts) {

  var self = this

  var camera = this.environment.camera
  var focalPoint = this.focalPoint

  var screenHeight = findHeight({
    distance : camera.position.distanceTo(focalPoint),
    vFOV : camera.fov
  })

  var destination = opts.destination

  var currentDistance = camera.position.distanceTo(focalPoint)
  var newDistance = destination.distanceTo(focalPoint)
  var easing = undefined
  if (newDistance > currentDistance) {
    self.dollyZoomed = true
    easing = TWEEN.Easing.Quartic.In
  } else {
    self.dollyZoomed = false
    easing = TWEEN.Easing.Quartic.Out
  }

  var newX = destination.x
  var newy = destination.y
  var newZ = destination.z

  var tweenIncrementors = {
    x : camera.position.x,
    y : camera.position.y,
    z : camera.position.z
  }

  var tween = new TWEEN.Tween(tweenIncrementors)
      .to({
        x : newX,
        y : newy,
        z : newZ
      }, opts.duration)
      .easing(easing)
      .onUpdate(function () {
        camera.position.set(tweenIncrementors.x, tweenIncrementors.y, tweenIncrementors.z)
        camera.lookAt(focalPoint)

        var newVFOV = findVFOV({
          depth : camera.position.distanceTo(focalPoint),
          height : screenHeight,
        })

        camera.fov = newVFOV
        camera.updateProjectionMatrix()
      })
      .start();
  return tween
}

function findVFOV(opts) {
  var angleRadians = 2 * Math.atan(opts.height / (2*opts.depth) )
  var angleDegrees = radiansToDegrees(angleRadians)
  return angleDegrees
}

function findHeight(opts) {
  var vFOV = degreesToRadians(opts.vFOV)
  var height = 2 * opts.distance * Math.tan(vFOV/2)
  return height
}

function degreesToRadians(degrees) {
  return degrees * Math.PI /180
}
function radiansToDegrees(radians) {
  return radians * 180 / Math.PI
}
