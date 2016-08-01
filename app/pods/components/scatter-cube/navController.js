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
        arrow.mesh.material.transparent = true
        self.removeListnersFromMesh( arrow )
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
        arrow.mesh.material.transparent = true
        arrow.mesh.material.visible = true
      })
      .onComplete(function () {
        arrow.mesh.material.transparent = false
        // console.log(arrow)
        self.addListnersToMesh(arrow)
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
  // disable camera controls
  this.environment.controls.enabled = false

  this.fadeOutArrows({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    arrowType: 'cornerArrows'
  })

  // bring in the arrows
  var toFadeIn = []
  toFadeIn.push( this.environment.navArrows[ "sidePowerLoHiSupportLeft" ] )
  toFadeIn.push( this.environment.navArrows[ "sidePowerLoHiSupportRight" ] )

  this.fadeInArrows({
    duration : 1500,
    easing : TWEEN.Easing.Quadratic.Out,
    arrows : toFadeIn,
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
    meshes : [...self.hiddenLabels, self.environment.scene.getObjectByName( "dangerZone" )]
  })

  this.moveAndDollyOut(new THREE.Vector3(1,1,4.9), new THREE.Vector3(1,1,1004.2), new THREE.Vector3(1,1,2))
}

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

NavController.prototype.powerXvitalPerspectiveHiHi = function() {
  var self = this

  this.fadeOutArrows({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    arrowType: 'sideArrows'
  })

  this.fadeInArrows({
    duration : 1500,
    easing : TWEEN.Easing.Quadratic.Out,
    arrowType: 'cornerArrows'
  })

  var dollyInTween = self.dollyZoom({
    destination : self.returnLocation,
    duration : 800,
  })
  .onStart(function () {
    self.update({ quadrant : self.environment.quadrantCalculator.quadrant })
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
  toFadeIn.push( this.environment.navArrows[ "sideVitalHiLoSupportLeft" ] )
  toFadeIn.push( this.environment.navArrows[ "sideVitalHiLoSupportRight" ] )

  this.fadeInArrows({
    opacity : 1,
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.Out,
    arrows : toFadeIn
  })

  // hide the labels
  self.hiddenLabels = []
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Label-High-Power" ) )
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Label-Power-Low" ) )
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Power" ) )

  this.fadeOutMeshes({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    meshes : [...self.hiddenLabels, self.environment.scene.getObjectByName( "dangerZone" )]
  })

  this.moveAndDollyOut(new THREE.Vector3(4.6,1,1), new THREE.Vector3(1004.6,1,1), new THREE.Vector3(2,1,1))
}

NavController.prototype.vitalXpowerPerspectiveLoHi = function() {
  var self = this

  this.fadeOutArrows({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    arrowType: 'sideArrows'
  })

  this.fadeInArrows({
    duration : 1500,
    easing : TWEEN.Easing.Quadratic.Out,
    arrowType: 'cornerArrows'
  })


  var dollyInTween = self.dollyZoom({
    destination : self.returnLocation,
    duration : 800,
  })
  .onStart(function () {
    self.update({ quadrant : self.environment.quadrantCalculator.quadrant })
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
  toFadeIn.push( this.environment.navArrows[ "sidePowerHiLoSupportLeft" ] )
  toFadeIn.push( this.environment.navArrows[ "sidePowerHiLoSupportRight" ] )

  this.fadeInArrows({
    opacity : 1,
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.Out,
    arrows : toFadeIn
  })

  // hide the labels
  self.hiddenLabels = []
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Label-High-Vital" ) )
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Label-Low-Vital" ) )
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Vital" ) )

  this.fadeOutMeshes({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    meshes : [...self.hiddenLabels, self.environment.scene.getObjectByName( "dangerZone" )]
  })

  this.moveAndDollyOut(new THREE.Vector3(1,1,-2.6), new THREE.Vector3(1,1,-1002.6), new THREE.Vector3(1,1,0))
};

NavController.prototype.powerXvitalPerspectiveLoLo = function() {
  var self = this

  this.fadeOutArrows({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    arrowType: 'sideArrows'
  })

  this.fadeInArrows({
    duration : 1500,
    easing : TWEEN.Easing.Quadratic.Out,
    arrowType: 'cornerArrows'
  })


  var dollyInTween = self.dollyZoom({
    destination : self.returnLocation,
    duration : 800,
  })
  .onStart(function () {
    self.update({ quadrant : self.environment.quadrantCalculator.quadrant })
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
  toFadeIn.push( this.environment.navArrows[ "sideVitalLoHiSupportLeft" ] )
  toFadeIn.push( this.environment.navArrows[ "sideVitalLoHiSupportRight" ] )

  this.fadeInArrows({
    opacity : 1,
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.Out,
    arrows : toFadeIn
  })

  // hide the labels
  self.hiddenLabels = []
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Label-High-Power" ) )
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Label-Power-Low" ) )
  this.hiddenLabels.push( this.environment.scene.getObjectByName( "Power" ) )

  this.fadeOutMeshes({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    meshes : [...self.hiddenLabels, self.environment.scene.getObjectByName( "dangerZone" )]
  })

  this.moveAndDollyOut(new THREE.Vector3(-2.5,1,1), new THREE.Vector3(-1002.5,1,1), new THREE.Vector3(0,1,1))
};

NavController.prototype.vitalXpowerPerspectiveHiLo = function() {
  var self = this

  this.fadeOutArrows({
    duration : 1000,
    easing : TWEEN.Easing.Quadratic.In,
    arrowType: 'sideArrows'
  })

  this.fadeInArrows({
    duration : 1500,
    easing : TWEEN.Easing.Quadratic.Out,
    arrowType: 'cornerArrows'
  })


  var dollyInTween = self.dollyZoom({
    destination : self.returnLocation,
    duration : 800,
  })
  .onStart(function () {
    self.update({ quadrant : self.environment.quadrantCalculator.quadrant })
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

