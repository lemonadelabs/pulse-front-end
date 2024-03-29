// todo:: tidy up this code so that the fading of the arrows uses the same function as the fading of the danger zone and the lables. Currently the arrows are passed as objects that have a mesh, but the lables are passed as an array of meshes. This needs to be standardised

/**
* @method NavController
* @param {Object} opts
*   @param {Object} opts.environment
*/
export default function NavController (opts) {
  this.environment = opts.environment
  this.focalPoint = new THREE.Vector3(1,1,1)
  this.returnLocation = undefined
  this.hiddenLabels = []
  this.tweens = {}
  this.hasListners = []
}


/**
* Fades out navigational arrows, as specified by arrowType.
* This function is used when navigating via clicking on arrows.
* It isn't used when navigating manually via threejs controls.
* @method fadeOutArrows
* @param {Object} opts
*   @param {Number} opts.duration
*   @param {Function} opts.easing
*   @param {String} opts.arrowType optional tring defining type of arrows to fade out
*   @param {Array} opts.arrows optional array of arrows to be faded out
* @return {Object} last tween object
*/
NavController.prototype.fadeOutArrows = function(opts) {
  var self = this
  var arrows
  if (opts.arrows) {
    arrows = opts.arrows
  } else {
    arrows = this.environment.navArrows[opts.arrowType]
  }

  var tweens = []
  _.forEach(arrows, function (arrow) {
    var tween = new TWEEN.Tween(arrow.mesh.material)
      .to( { opacity : 0 }, opts.duration )
      .easing(opts.easing)
      .onStart(function () {
        // make transparent to allow for fading
        arrow.mesh.material.transparent = true
        // make meshes not clickable
        self.removeListnersFromMesh( arrow )
      })
      .onComplete(function () {
        // make invisible. Saves rendering resources
        arrow.mesh.material.visible = false
        arrow.mesh.material.transparent = false
      })
      .start();
    tweens.push(tween)
  })
  return _.last(tweens)
};

/**
* Fades in navigational arrows, as specified by arrowType.
* This function is used when navigating via clicking on arrows.
* It isn't used when navigating manually via threejs controls.
* @method fadeInArrows
*   @param {Number} opts.duration
*   @param {Function} opts.easing
*   @param {String} opts.arrowType optional tring defining type of arrows to fade out
*   @param {Array} opts.arrows optional array of arrows to be faded out
* @return {Object} last tween object
*/

NavController.prototype.fadeInArrows = function(opts) {
  var self = this
  var arrows
  if (opts.arrows) {
    arrows = opts.arrows
  } else {
    arrows = this.environment.navArrows[opts.arrowType]
  }
  var tweens = []
  _.forEach(arrows, function (arrow) {

    arrow.mesh.material.opacity = 0
    var tween = new TWEEN.Tween(arrow.mesh.material)
      .to( { opacity : 1 }, opts.duration )
      .easing(opts.easing)
      .onStart(function () {
        // make transparent and visible to allow for fading
        arrow.mesh.material.transparent = true
        arrow.mesh.material.visible = true
      })
      .onComplete(function () {
        // remove transparency, as fading has finished. Prevents potential rendering draw order issues.
        arrow.mesh.material.transparent = false
        // make arrow respond to mouse events
        self.addListnersToMesh(arrow)
      })
      .start();
    tweens.push(tween)
  })
  return _.last(tweens)
};


/**
* generic function for fading meshes
* @method fadeInMeshes
* @param {Object} opts
*   @param {Number} opts.opacity
*   @param {Number} opts.duration
*   @param {Function} opts.easing
*   @param {Array} opts.meshes
* @return {Object} last tween object
*/

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

/**
* generic function for fading meshes
* @method fadeOutMeshes
* @param {Object} opts
*   @param {Number} opts.opacity
*   @param {Number} opts.duration
*   @param {Function} opts.easing
*   @param {Array} opts.meshes
* @return {Object} last tween object
*/
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
  // disable camera controls
  this.environment.controls.enabled = false

  // fade out cornerArrows
  this.fadeOutArrows({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    arrowType: 'cornerArrows'
  })

  // fade in appropriate flat arrows
  var toFadeIn = []
  toFadeIn.push( this.environment.navArrows[ "sidePowerLoHiSupportLeft" ] )
  toFadeIn.push( this.environment.navArrows[ "sidePowerLoHiSupportRight" ] )
  this.fadeInArrows({
    duration : 1500,
    easing : TWEEN.Easing.Quadratic.Out,
    arrows : toFadeIn,
    opacity : 1
  })

  // hide labels that aren't needed for this view
  this.hiddenLabels = []
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Label-High-Vital" ) )
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Label-Low-Vital" ) )
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Vital" ) )

  // fade out labels and dangerzone
  this.fadeOutMeshes({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    meshes : [...self.hiddenLabels, self.environment.scene.getObjectByName( "dangerZone" )]
  })

  // make camera orthographic
  this.moveAndDollyOut(new THREE.Vector3(1,1,4.9), new THREE.Vector3(1,1,1004.2), new THREE.Vector3(1,1,2))
}

NavController.prototype.powerXvitalPerspectiveHiHi = function() {
  var self = this

  // fade out flat/side arrows
  this.fadeOutArrows({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    arrowType: 'sideArrows'
  })

  // fade in cornerArrows
  this.fadeInArrows({
    duration : 1500,
    easing : TWEEN.Easing.Quadratic.Out,
    arrowType: 'cornerArrows'
  })

  // transition to perspective view
  var dollyInTween = self.dollyZoom({
    destination : self.returnLocation,
    duration : 800,
  })
  .onStart(function () {
    self.update({ quadrant : self.environment.quadrantCalculator.quadrant })
  })
  dollyInTween.onComplete(function () {

    // fade in the labels that had been previously hidden
    self.fadeInMeshes({
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

    // move camera to the home position for this view
    var moveTween = self.moveCamera({
      destination : new THREE.Vector3(3.7, 1.5, 4.4),
      duration : 800,
      easing : TWEEN.Easing.Quadratic.InOut,
      focalPoint : new THREE.Vector3(1,1,1)
    })
    moveTween.onComplete(function () {
      // re enable threejs controls for manual navigation
      self.environment.controls.enabled = true
    })
  })
};


NavController.prototype.vitalXsupportOrthographicHiLo = function() {
  var camera = this.environment.camera
  var self = this

  // disable camera controls
  this.environment.controls.enabled = false

  // fade out cornerArrows
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

  // fade in appropriate flat arrows
  var toFadeIn = []
  toFadeIn.push( this.environment.navArrows[ "sideVitalHiLoSupportLeft" ] )
  toFadeIn.push( this.environment.navArrows[ "sideVitalHiLoSupportRight" ] )

  this.fadeInArrows({
    opacity : 1,
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.Out,
    arrows : toFadeIn
  })

  // hide labels that aren't needed for this view
  self.hiddenLabels = []
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Label-High-Power" ) )
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Label-Power-Low" ) )
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Power" ) )

  // fade out labels and dangerzone
  this.fadeOutMeshes({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    meshes : [...self.hiddenLabels, self.environment.scene.getObjectByName( "dangerZone" )]
  })

  // make camera orthographic
  this.moveAndDollyOut(new THREE.Vector3(4.6,1,1), new THREE.Vector3(1004.6,1,1), new THREE.Vector3(2,1,1))
}

NavController.prototype.vitalXpowerPerspectiveLoHi = function() {
  var self = this


  // fade out flat/side arrows
  this.fadeOutArrows({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    arrowType: 'sideArrows'
  })

  // fade in cornerArrows
  this.fadeInArrows({
    duration : 1500,
    easing : TWEEN.Easing.Quadratic.Out,
    arrowType: 'cornerArrows'
  })

  // transition to perspective view
  var dollyInTween = self.dollyZoom({
    destination : self.returnLocation,
    duration : 800,
  })
  .onStart(function () {
    self.update({ quadrant : self.environment.quadrantCalculator.quadrant })
  })
  dollyInTween.onComplete(function () {
    // fade in the labels that had been previously hidden
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
    // move camera to the home position for this view
    var moveTween = self.moveCamera({
      destination : new THREE.Vector3(4.5, 1.5, -1.6),
      duration : 800,
      easing : TWEEN.Easing.Quadratic.InOut,
      focalPoint : new THREE.Vector3(1,1,1)
    })
    moveTween.onComplete(function () {
      // re enable threejs controls for manual navigation
      self.environment.controls.enabled = true
    })
  })
};

NavController.prototype.powerXsupportOrthographicHiLo = function() {
  var self = this
  // disable camera controls
  var camera = this.environment.camera
  this.environment.controls.enabled = false

  // fade out cornerArrows
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

  // fade in appropriate flat arrows
  var toFadeIn = []
  toFadeIn.push( this.environment.navArrows[ "sidePowerHiLoSupportLeft" ] )
  toFadeIn.push( this.environment.navArrows[ "sidePowerHiLoSupportRight" ] )

  this.fadeInArrows({
    opacity : 1,
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.Out,
    arrows : toFadeIn
  })

  // hide labels that aren't needed for this view
  self.hiddenLabels = []
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Label-High-Vital" ) )
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Label-Low-Vital" ) )
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Vital" ) )

  // fade out labels and dangerzone
  this.fadeOutMeshes({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    meshes : [...self.hiddenLabels, self.environment.scene.getObjectByName( "dangerZone" )]
  })

  // make camera orthographic
  this.moveAndDollyOut(new THREE.Vector3(1,1,-2.6), new THREE.Vector3(1,1,-1002.6), new THREE.Vector3(1,1,0))
};

NavController.prototype.powerXvitalPerspectiveLoLo = function() {
  var self = this
  // fade out flat/side arrows
  this.fadeOutArrows({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    arrowType: 'sideArrows'
  })

  // fade in cornerArrows
  this.fadeInArrows({
    duration : 1500,
    easing : TWEEN.Easing.Quadratic.Out,
    arrowType: 'cornerArrows'
  })

  // transition to perspective view
  var dollyInTween = self.dollyZoom({
    destination : self.returnLocation,
    duration : 800,
  })
  .onStart(function () {
    self.update({ quadrant : self.environment.quadrantCalculator.quadrant })
  })
  dollyInTween.onComplete(function () {
    // fade in the labels that had been previously hidden
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
    // move camera to the home position for this view
    var moveTween = self.moveCamera({
      destination : new THREE.Vector3(-1.7, 1.6, -2.5),
      duration : 800,
      easing : TWEEN.Easing.Quadratic.InOut,
      focalPoint : new THREE.Vector3(1,1,1)
    })
    moveTween.onComplete(function () {
      // re enable threejs controls for manual navigation
      self.environment.controls.enabled = true
    })
  })
};

NavController.prototype.vitalXsupportOrthographicLoHo = function() {
  var self = this
  var camera = this.environment.camera
  // disable camera controls
  this.environment.controls.enabled = false

  // fade out cornerArrows
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

  // fade in appropriate flat arrows
  var toFadeIn = []
  toFadeIn.push( this.environment.navArrows[ "sideVitalLoHiSupportLeft" ] )
  toFadeIn.push( this.environment.navArrows[ "sideVitalLoHiSupportRight" ] )

  this.fadeInArrows({
    opacity : 1,
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.Out,
    arrows : toFadeIn
  })


  // hide labels that aren't needed for this view
  self.hiddenLabels = []
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Label-High-Power" ) )
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Label-Power-Low" ) )
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Power" ) )

  // fade out labels and dangerzone
  this.fadeOutMeshes({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    meshes : [...self.hiddenLabels, self.environment.scene.getObjectByName( "dangerZone" )]
  })

  // make camera orthographic
  this.moveAndDollyOut(new THREE.Vector3(-2.5,1,1), new THREE.Vector3(-1002.5,1,1), new THREE.Vector3(0,1,1))
};

NavController.prototype.vitalXpowerPerspectiveHiLo = function() {
  var self = this

  // fade out flat/side arrows
  this.fadeOutArrows({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    arrowType: 'sideArrows'
  })

  // fade in cornerArrows
  this.fadeInArrows({
    duration : 1500,
    easing : TWEEN.Easing.Quadratic.Out,
    arrowType: 'cornerArrows'
  })

  // transition to perspective view
  var dollyInTween = self.dollyZoom({
    destination : self.returnLocation,
    duration : 800,
  })
  .onStart(function () {
    self.update({ quadrant : self.environment.quadrantCalculator.quadrant })
  })
  dollyInTween.onComplete(function () {
    // fade in the labels that had been previously hidden
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
    // move camera to the home position for this view
    var moveTween = self.moveCamera({
      destination : new THREE.Vector3(-2.5, 1.5, 3.7),
      duration : 800,
      easing : TWEEN.Easing.Quadratic.InOut,
      focalPoint : new THREE.Vector3(1,1,1)
    })
    moveTween.onComplete(function () {
      // re enable threejs controls for manual navigation
      self.environment.controls.enabled = true
    })
  })
};


/**
* moves camera to destination, then dolly zooms out to zoomedDestination with zoomedFocalPt
*
* @method moveAndDollyOut
* @param {Object} destination THREE.Vector3
* @param {Object} zoomedDestination THREE.Vector3
* @param {Object} zoomedFocalPt THREE.Vector3
*/
NavController.prototype.moveAndDollyOut = function(destination, zoomedDestination, zoomedFocalPt) {
  var camera = this.environment.camera
  this.focalPoint = new THREE.Vector3(1,1,1)
  var moveTween = this.moveCamera({
    destination : destination,
    duration : 800,
    easing : TWEEN.Easing.Quadratic.InOut,
  })

  // dolly zoom out
  moveTween.onComplete(() => {
    this.returnLocation = camera.position.clone()
    this.focalPoint = zoomedFocalPt
    this.dollyZoom({ // dolly out
      destination : zoomedDestination,
      duration : 800
    })
  })
};


/**
* moves camera from current position to opts.position, while looking at NavController.focalPoint
*
* @method moveCamera
* @param {Object} opts
*   @param {Object} opts.destination THREE.Vector3
*   @param {Number} opts.duration in ms
*   @param {Function} opts.easing TWEEN.Easing
* @return {Object} TWEEN.Tween
*/
NavController.prototype.moveCamera = function (opts) {

  var focalPoint = this.focalPoint
  var camera = this.environment.camera

  var destination = opts.destination
  var newX = destination.x
  var newy = destination.y
  var newZ = destination.z

  var proxy = {
    x : camera.position.x,
    y : camera.position.y,
    z : camera.position.z
  }

  var tween = new TWEEN.Tween(proxy)
      .to({
        x : newX,
        y : newy,
        z : newZ
      }, opts.duration)
      .easing(opts.easing)
      .onUpdate(function () {
        camera.position.set(proxy.x, proxy.y, proxy.z)
        camera.lookAt(focalPoint)
      })
      .start();
  return tween
}

/**
* dolly zoom effect. See video for demonstration https://www.youtube.com/watch?v=NB4bikrNzMk
* @method dollyZoom
* @param {Object} opts
*   @param {Object} opts.destination  THREE.Vector3
*   @param {Number} opts.duration in ms
* @return {Object} TWEEN.Tween
*/
NavController.prototype.dollyZoom = function (opts) {
  var destination = opts.destination
  var duration = opts.duration
  var camera = this.environment.camera
  var focalPoint = this.focalPoint

  var frustrumHeight = frustrumHeightAtFocalPoint({
    camera : camera,
    focalPoint : focalPoint,
    vFOV : camera.fov
  })

  var currentDistance = camera.position.distanceTo(focalPoint)
  var newDistance = destination.distanceTo(focalPoint)
  var easing
  if (newDistance > currentDistance) {
    // if we are zooming out
    easing = TWEEN.Easing.Quartic.In
  } else {
    // if we are zooming in
    easing = TWEEN.Easing.Quartic.Out
  }


  var proxy = {
    x : camera.position.x,
    y : camera.position.y,
    z : camera.position.z
  }

  var tween = new TWEEN.Tween(proxy)
      .to({
        x : destination.x,
        y : destination.y,
        z : destination.z
      }, duration)
      .easing(easing)
      .onUpdate(function () {
        // set the camera position
        camera.position.set(proxy.x, proxy.y, proxy.z)

        var newVFOV = findVFOV({
          depth : camera.position.distanceTo(focalPoint),
          height : frustrumHeight,
        })

        // apply the new FOV
        camera.fov = newVFOV
        camera.updateProjectionMatrix()
      })
      .start();
  return tween
}

/**
* calculates the vertical FOV of the camera/frustrum in degrees using height of frustrum plane at focal point,
* and distance from camera to focal point.
* @method findVFOV
* @param {Object} opts
*   @param {Number} opts.depth
*   @param {Number} opts.height
* @return {Number} VFOV in degrees
*/
function findVFOV(opts) {
  // soh cah toa trigonometry
  var angleRadians = 2 * Math.atan(opts.height / (2*opts.depth) )
  var angleDegrees = radiansToDegrees(angleRadians)
  return angleDegrees
}

/**
* Calculates the height of the frustrum plane at the focal point
*
* @method frustrumHeightAtFocalPoint
* @param {Object} opts
*   @param {Object} opts.camera
*   @param {Object} opts.focalPoint THREE.Vector3
*   @param {Number} opts.vFOV
* @return {Number} frustrum height in meters
*/
function frustrumHeightAtFocalPoint(opts) {
  var distance = opts.camera.position.distanceTo(opts.focalPoint)
  var vFOV = degreesToRadians(opts.vFOV)
  var frustrumHeight = 2 * distance * Math.tan(vFOV/2)
  return frustrumHeight
}

function degreesToRadians(degrees) {
  return degrees * Math.PI /180
}
function radiansToDegrees(radians) {
  return radians * 180 / Math.PI
}


/**
* gets run on quadrant change
*
* @method update
* @param {Object} opts
*   @param {Number} opts.quadrant
* @return {Array} array of ids
*/
NavController.prototype.update = function(opts) {
  var self = this
  var cornerArrows = this.cornerArrows
  // decides which arrows to fade in and out, depending on the current quadrant
  _.forEach(cornerArrows, function (arrow) {
    if (arrow.quadrant !== opts.quadrant && arrow.mesh.material.visible) {
      self.fadeOutArrow( arrow )
    }
    if (arrow.quadrant === opts.quadrant) {
      self.fadeInArrow( arrow )
    }
  })
};

/**
* used only when fading due to quadrant change. Not used for arrow click transitions
* @method fadeInArrow
* @param {Object} arrow (with mesh)
*/
NavController.prototype.fadeInArrow = function(arrow) {
  var self = this
  var name = arrow.mesh.name

  var cachedTween
  if (cachedTween = self.tweens[name]) {
    cachedTween.stop()
    delete self.tweens[name]
  }

  var material = arrow.mesh.material
  var fadeInTween = new TWEEN.Tween(arrow.tweenCounter)
  .to({opacity: 1.0}, 300)
  .easing(TWEEN.Easing.Exponential.In)
  .onStart(function () {
    material.transparent = true
    material.visible = true
  })
  .onUpdate(function () {
    material.opacity = arrow.tweenCounter.opacity
  })
  .onComplete(function () {
    material.transparent = false
    self.addListnersToMesh(arrow)
    delete self.tweens[name]
  })
  this.tweens[name] = fadeInTween
  fadeInTween.start()
};

/**
* used only when fading due to quadrant change. Not used for arrow click transitions
* @method fadeOutArrow
* @param {Object} arrow (with mesh)
*/
NavController.prototype.fadeOutArrow = function(arrow) {
  var self = this
  var name = arrow.mesh.name

  var cachedTween
  if (cachedTween = self.tweens[name]) {
    cachedTween.stop()
    delete self.tweens[name]
  }

  var material = arrow.mesh.material
  arrow.tweenCounter.opacity = material.opacity
  var fadeOutTween = new TWEEN.Tween(arrow.tweenCounter)
      .to({opacity: 0.0}, 250)
      .easing(TWEEN.Easing.Exponential.Out)
      .onStart(function () {
        material.transparent = true
        self.removeListnersFromMesh( arrow )
      })
      .onUpdate(function () {
        material.opacity = arrow.tweenCounter.opacity
      })
      .onComplete(function () {
        material.transparent = false
        material.visible = false
        delete self.tweens[name]
      })
  this.tweens[name] = fadeOutTween
  fadeOutTween.start();
};




NavController.prototype.addListnersToMesh = function(arrow) {
  var name = arrow.hitBox.name
  if (!(_.includes(this.hasListners, name))) {
    this.environment.domEvents.addEventListener(arrow.hitBox, 'click', this.onCLick, false)
    this.environment.domEvents.addEventListener(arrow.hitBox, 'mouseover', this.onMouseover, false)
    this.environment.domEvents.addEventListener(arrow.hitBox, 'mouseout', this.onMouseout, false)

    this.hasListners.push(name)
  }
};

NavController.prototype.removeListnersFromMesh = function(arrow) {
  var self = this
  var name = arrow.hitBox.name
  if (_.includes(this.hasListners, name)) {
    this.environment.domEvents.removeEventListener(arrow.hitBox, 'click', this.onCLick, false)
    this.environment.domEvents.removeEventListener(arrow.hitBox, 'mouseover', this.onMouseover, false)
    this.environment.domEvents.removeEventListener(arrow.hitBox, 'mouseout', this.onMouseout, false)
    $('.scatter-cube').removeClass('threejs-hover')
    _.pull(this.hasListners, name)
  }
};


// calls the onClickFxn as defined in navArrows.js
NavController.prototype.onCLick = function(event) {
  event.target.onClickFxn()
};

NavController.prototype.onMouseover = function() {
  $('.scatter-cube').addClass('threejs-hover')
};

NavController.prototype.onMouseout = function() {
  $('.scatter-cube').removeClass('threejs-hover')
};

