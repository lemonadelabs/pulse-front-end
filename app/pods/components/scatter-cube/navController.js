// todo:: tidy up this code so that the fading of the arrows uses the same function as the fading of the danger zone and the lables. Currently the arrows are passed as objects that have a mesh, but the lables are passed as an array of meshes. This needs to be standardised

export default function NavController (opts) {
  this.environment = opts.environment
  this.focalPoint = new THREE.Vector3(1,1,1)
  this.returnLocation = undefined
  this.hiddenLabels = []
}



NavController.prototype.fadeOutArrows = function(opts) {
  var arrows = this.environment.navArrows[opts.arrowType]
  var tweens = []

  _.forEach(arrows, function (arrow) {

    var tween = new TWEEN.Tween(arrow.mesh.material)
      .to( { opacity : 0 }, opts.duration )
      .easing(opts.easing)
      .onStart(function () {
        arrow.mesh.material.transparent = true
      })
      .onComplete(function () {
        arrow.mesh.material.visible = false
        arrow.mesh.material.transparent = false
      })
      .start();
    tweens.push(tween)
  })
  return _.last(tweens)
};

NavController.prototype.fadeInArrows = function(opts) {
  var arrows = this.environment.navArrows[opts.arrowType]
  var tweens = []

  _.forEach(arrows, function (arrow) {

    var tween = new TWEEN.Tween(arrow.mesh.material)
      .to( { opacity : 1 }, opts.duration )
      .easing(opts.easing)
      .onStart(function () {
        arrow.mesh.material.transparent = true
        arrow.mesh.material.visible = true
      })
      .onComplete(function () {
        arrow.mesh.material.transparent = false
      })
      .start();
    tweens.push(tween)
  })
  return _.last(tweens)
};


NavController.prototype.fadeInMeshes = function(opts) {
  var meshes = opts.meshes
  var tweens = []

  _.forEach(meshes, function (mesh) {

    mesh.material.opacity = 0
    mesh.material.transparent = true
    mesh.material.visible = true

    var tween = new TWEEN.Tween(mesh.material)
      .to( { opacity : opts.opacity }, opts.duration )
      .easing(opts.easing)
      .onComplete(function () {
        if ( opts.opacity === 1 ) {
          mesh.material.transparent = false
        }
      })
      .start();
    tweens.push(tween)
  })
  return _.last(tweens)
};

NavController.prototype.fadeOutMeshes = function(opts) {
  var meshes = opts.meshes
  var tweens = []

  _.forEach(meshes, function (mesh) {

    mesh.material.transparent = true

    var tween = new TWEEN.Tween(mesh.material)
      .to( { opacity : 0 }, opts.duration )
      .easing(opts.easing)
      .onComplete(function () {
        mesh.material.visible = false
        mesh.material.transparent = false
      })
      .start();
    tweens.push(tween)
  })
  return _.last(tweens)
};


NavController.prototype.powerXsupportOrthographicLoHi = function() {
  var self = this
  var camera = this.environment.camera
  this.environment.controls.enabled = false

  this.fadeOutArrows({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    arrowType: 'cornerArrows'
  })

  // bring in the arrows
  var toFadeIn = []
  toFadeIn.push( this.environment.scene.getObjectByName( "sidePowerLoHiSupportLeft" ) )
  toFadeIn.push( this.environment.scene.getObjectByName( "sidePowerLoHiSupportRight" ) )

  this.fadeInMeshes({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.Out,
    meshes : toFadeIn,
    opacity : 1
  })

  // hide the labels
  this.hiddenLabels = []
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Label-High-Vital" ) )
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Label-Low-Vital" ) )
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Vital" ) )

  this.fadeOutMeshes({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    meshes : [self.environment.scene.getObjectByName( "dangerZone" )]
  })

  this.fadeOutMeshes({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    meshes : self.hiddenLabels
  })

  moveAndDollyOut()
  function moveAndDollyOut () {
    self.focalPoint = new THREE.Vector3(1,1,1)
    var moveTween = self.moveCamera({
      destination : new THREE.Vector3(1,1,4.9),
      duration : 800,
      easing : TWEEN.Easing.Quadratic.InOut,
    })

    // dolly zoom out
    moveTween.onComplete(function () {
      self.returnLocation = camera.position.clone()
      self.focalPoint = new THREE.Vector3(1,1,2)
      self.dollyZoom({ // dolly out
        destination : new THREE.Vector3(1,1,1004.2),
        duration : 800
      })
    })
  }

}

NavController.prototype.powerXvitalPerspectiveHiHi = function() {
  var self = this

  this.fadeOutArrows({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    arrowType: 'sideArrows'
  })

  this.fadeInArrows({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.Out,
    arrowType: 'cornerArrows'
  })

  var dollyInTween = self.dollyZoom({
    destination : self.returnLocation,
    duration : 800,
  })
  .onStart(function () {
    self.environment.navArrows.navArrowAnimator.update({ quadrant : self.environment.quadrantCalculator.quadrant })
  })
  dollyInTween.onComplete(function () {

    self.fadeInMeshes({ // fade in label
      opacity : 1,
      duration : 1000,
      easing : TWEEN.Easing.Quadratic.Out,
      meshes : self.hiddenLabels
    })

    self.fadeInMeshes({ // fade in danger zone
      opacity : 0.5,
      duration : 1000,
      easing : TWEEN.Easing.Quadratic.Out,
      meshes : [self.environment.scene.getObjectByName( "dangerZone" )]
    })

    var moveTween = self.moveCamera({
      destination : new THREE.Vector3(3.7, 1.5, 4.4),
      duration : 800,
      easing : TWEEN.Easing.Quadratic.InOut,
      focalPoint : new THREE.Vector3(1,1,1)
    })
    moveTween.onComplete(function () {
      self.environment.controls.enabled = true
    })
  })

};


NavController.prototype.vitalXsupportOrthographicHiLo = function() {
  var camera = this.environment.camera
  var self = this

  this.environment.controls.enabled = false

  var fadeOutTween = this.fadeOutArrows({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    arrowType: 'cornerArrows'
  })

  fadeOutTween.onComplete(function () {
    var cornerArrows = self.environment.navArrows['cornerArrows']
    _.forEach(cornerArrows, function (arrow) {
      arrow.mesh.material.visible = false
      arrow.mesh.transparent = false
    })
  })

  var toFadeIn = []
  toFadeIn.push( this.environment.scene.getObjectByName( "sideVitalHiLoSupportLeft" ) )
  toFadeIn.push( this.environment.scene.getObjectByName( "sideVitalHiLoSupportRight" ) )

  this.fadeInMeshes({
    opacity : 1,
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.Out,
    meshes : toFadeIn
  })

  // hide the labels
  self.hiddenLabels = []
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Label-High-Power" ) )
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Label-Power-Low" ) )
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Power" ) )

  this.fadeOutMeshes({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    meshes : [self.environment.scene.getObjectByName( "dangerZone" )]
  })

  this.fadeOutMeshes({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    meshes : self.hiddenLabels
  })

  moveAndDollyOut()
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
      self.focalPoint = new THREE.Vector3(2,1,1)
      self.dollyZoom({ // dolly out
        destination : new THREE.Vector3(1004.6,1,1),
        duration : 800
      })
    })
  }
}

NavController.prototype.vitalXpowerPerspectiveLoHi = function() {
  var self = this

  this.fadeOutArrows({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    arrowType: 'sideArrows'
  })

  this.fadeInArrows({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.Out,
    arrowType: 'cornerArrows'
  })


  var dollyInTween = self.dollyZoom({
    destination : self.returnLocation,
    duration : 800,
  })
  .onStart(function () {
    self.environment.navArrows.navArrowAnimator.update({ quadrant : self.environment.quadrantCalculator.quadrant })
  })
  dollyInTween.onComplete(function () {
    self.fadeInMeshes({ // fade in label
      opacity : 1,
      duration : 1000,
      easing : TWEEN.Easing.Quadratic.Out,
      meshes : self.hiddenLabels
    })

    self.fadeInMeshes({ // fade in dangerzone
      opacity : 0.5,
      duration : 1000,
      easing : TWEEN.Easing.Quadratic.Out,
      meshes : [self.environment.scene.getObjectByName( "dangerZone" )]
    })
    var moveTween = self.moveCamera({
      destination : new THREE.Vector3(4.5, 1.5, -1.6),
      duration : 800,
      easing : TWEEN.Easing.Quadratic.InOut,
      focalPoint : new THREE.Vector3(1,1,1)
    })
    moveTween.onComplete(function () {
      self.environment.controls.enabled = true
    })
  })
};

NavController.prototype.powerXsupportOrthographicHiLo = function() {
  var self = this
  var camera = this.environment.camera
  this.environment.controls.enabled = false

  var fadeOutTween = this.fadeOutArrows({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    arrowType: 'cornerArrows'
  })

  fadeOutTween.onComplete(function () {
    var cornerArrows = self.environment.navArrows['cornerArrows']
    _.forEach(cornerArrows, function (arrow) {
      arrow.mesh.material.visible = false
      arrow.mesh.transparent = false
    })
  })

  var toFadeIn = []
  toFadeIn.push( this.environment.scene.getObjectByName( "sidePowerHiLoSupportLeft" ) )
  toFadeIn.push( this.environment.scene.getObjectByName( "sidePowerHiLoSupportRight" ) )

  this.fadeInMeshes({
    opacity : 1,
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.Out,
    meshes : toFadeIn
  })

  // hide the labels
  self.hiddenLabels = []
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Label-High-Vital" ) )
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Label-Low-Vital" ) )
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Vital" ) )

  this.fadeOutMeshes({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    meshes : [self.environment.scene.getObjectByName( "dangerZone" )]
  })

  this.fadeOutMeshes({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    meshes : self.hiddenLabels
  })

  moveAndDollyOut()
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
      self.dollyZoom({ // dolly out
        destination : new THREE.Vector3(1,1,-1002.6),
        duration : 800
      })
    })
  }
};

NavController.prototype.powerXvitalPerspectiveLoLo = function() {
  var self = this

  this.fadeOutArrows({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    arrowType: 'sideArrows'
  })

  this.fadeInArrows({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.Out,
    arrowType: 'cornerArrows'
  })


  var dollyInTween = self.dollyZoom({
    destination : self.returnLocation,
    duration : 800,
  })
  .onStart(function () {
    self.environment.navArrows.navArrowAnimator.update({ quadrant : self.environment.quadrantCalculator.quadrant })
  })
  dollyInTween.onComplete(function () {
    self.fadeInMeshes({ // fade in label
      opacity : 1,
      duration : 1000,
      easing : TWEEN.Easing.Quadratic.Out,
      meshes : self.hiddenLabels
    })

    self.fadeInMeshes({ // fade in dangerzone
      opacity : 0.5,
      duration : 1000,
      easing : TWEEN.Easing.Quadratic.Out,
      meshes : [self.environment.scene.getObjectByName( "dangerZone" )]
    })
    var moveTween = self.moveCamera({
      destination : new THREE.Vector3(-1.7, 1.6, -2.5),
      duration : 800,
      easing : TWEEN.Easing.Quadratic.InOut,
      focalPoint : new THREE.Vector3(1,1,1)
    })
    moveTween.onComplete(function () {
      self.environment.controls.enabled = true
    })
  })
};

NavController.prototype.vitalXsupportOrthographicLoHo = function() {
  var self = this
  var camera = this.environment.camera
  this.environment.controls.enabled = false

  var fadeOutTween = this.fadeOutArrows({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    arrowType: 'cornerArrows'
  })

  fadeOutTween.onComplete(function () {
    var cornerArrows = self.environment.navArrows['cornerArrows']
    _.forEach(cornerArrows, function (arrow) {
      arrow.mesh.material.visible = false
      arrow.mesh.transparent = false
    })
  })

  var toFadeIn = []
  toFadeIn.push( this.environment.scene.getObjectByName( "sideVitalLoHiSupportLeft" ) )
  toFadeIn.push( this.environment.scene.getObjectByName( "sideVitalLoHiSupportRight" ) )

  this.fadeInMeshes({
    opacity : 1,
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.Out,
    meshes : toFadeIn
  })

  // hide the labels
  self.hiddenLabels = []
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Label-High-Power" ) )
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Label-Power-Low" ) )
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Power" ) )

  this.fadeOutMeshes({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    meshes : [self.environment.scene.getObjectByName( "dangerZone" )]
  })

  this.fadeOutMeshes({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    meshes : self.hiddenLabels
  })

  moveAndDollyOut()
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
      self.focalPoint = new THREE.Vector3(0,1,1)
      self.dollyZoom({ // dolly out
        destination : new THREE.Vector3(-1002.5,1,1),
        duration : 800
      })
    })
  }
};

NavController.prototype.vitalXpowerPerspectiveHiLo = function() {
  var self = this

  this.fadeOutArrows({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    arrowType: 'sideArrows'
  })

  this.fadeInArrows({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.Out,
    arrowType: 'cornerArrows'
  })


  var dollyInTween = self.dollyZoom({
    destination : self.returnLocation,
    duration : 800,
  })
  .onStart(function () {
    self.environment.navArrows.navArrowAnimator.update({ quadrant : self.environment.quadrantCalculator.quadrant })
  })
  dollyInTween.onComplete(function () {
    self.fadeInMeshes({ // fade in label
      opacity : 1,
      duration : 1000,
      easing : TWEEN.Easing.Quadratic.Out,
      meshes : self.hiddenLabels
    })

    self.fadeInMeshes({ // fade in dangerzone
      opacity : 0.5,
      duration : 1000,
      easing : TWEEN.Easing.Quadratic.Out,
      meshes : [self.environment.scene.getObjectByName( "dangerZone" )]
    })
    var moveTween = self.moveCamera({
      destination : new THREE.Vector3(-2.5, 1.5, 3.7),
      duration : 800,
      easing : TWEEN.Easing.Quadratic.InOut,
      focalPoint : new THREE.Vector3(1,1,1)
    })
    moveTween.onComplete(function () {
      self.environment.controls.enabled = true
    })
  })
};




NavController.prototype.moveCamera = function (opts) {

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
      })
      .start();
  return tween
}


NavController.prototype.dollyZoom = function (opts) {
  var camera = this.environment.camera
  var focalPoint = this.focalPoint

  var screenHeight = findHeight({
    distance : camera.position.distanceTo(focalPoint),
    vFOV : camera.fov
  })

  var destination = opts.destination

  var currentDistance = camera.position.distanceTo(focalPoint)
  var newDistance = destination.distanceTo(focalPoint)
  var easing
  if (newDistance > currentDistance) {
    easing = TWEEN.Easing.Quartic.In
  } else {
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
