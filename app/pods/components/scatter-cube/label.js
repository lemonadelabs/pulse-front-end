export default function Label (opts) {
  this.tweenCounter = {}
  this.mesh = opts.mesh
  this.name = this.mesh.name = opts.name
  this.coords = this.generateCoords()
  this.currentQuadrant = undefined
}


Label.prototype.updateLocation = function(quadrant) {
  var currentCoords = this.coords[this.currentQuadrant]
  var newCoords = this.coords[quadrant]

  if (!_.isEqual(currentCoords, newCoords)) {
    this.animateLabel(newCoords)

    this.currentQuadrant = quadrant
  }
};

Label.prototype.initLocation = function(quadrant) {
  var coords = this.coords[quadrant]
  this.animateLabel(coords)
};

Label.prototype.animateLabel = function(coords) {
  var self = this
  var material = this.mesh.material
  this.tweenCounter.opacity = material.opacity
  var fadeOutTween = new TWEEN.Tween(this.tweenCounter)
      .to({opacity: 0.0}, 250)
      .easing(TWEEN.Easing.Exponential.Out)
      .onUpdate(function () {
        material.opacity = self.tweenCounter.opacity
      })
      .onComplete(function () {
        self.mesh.position.set(coords[0],coords[1],coords[2])
        fadeInTween.start()
      })
  fadeOutTween.start();

  var fadeInTween = new TWEEN.Tween(this.tweenCounter)
      .to({opacity: 1.0}, 300)
      .easing(TWEEN.Easing.Exponential.In)
      .onUpdate(function () {
        material.opacity = self.tweenCounter.opacity
      })
};

Label.prototype.generateCoords = function() {
  if (this.name === "Power") {
    return [
      [1,-0.1,-0.5],
      [1,-0.1,-0.5],
      [1,-0.1,2.5],
      [1,-0.1,2.5]
    ]
  } else if (this.name === "Label-High-Power") {
    return [
      [1.9,-0.1,-0.1],
      [1.9,-0.1,-0.1],
      [1.9,-0.1,2.1],
      [1.9,-0.1,2.1]
    ]
  } else if (this.name === "Label-Power-Low") {
    return [
      [0.1,-0.1,-0.1],
      [0.1,-0.1,-0.1],
      [0.1,-0.1,2.1],
      [0.1,-0.1,2.1]
    ]
  } else if (this.name === "Vital") {
    return [
      [-0.5,-0.1,1],
      [2.5,-0.1,1],
      [2.5,-0.1,1],
      [-0.5,-0.1,1]
    ]
  } else if (this.name === "Label-High-Vital") {
    return [
      [-0.1,-0.1,1.9],
      [2.1,-0.1,1.9],
      [2.1,-0.1,1.9],
      [-0.1,-0.1,1.9],
    ]
  } else if (this.name === "Label-Low-Vital") {
    return [
      [-0.1,-0.1,0.1],
      [2.1,-0.1,0.1],
      [2.1,-0.1,0.1],
      [-0.1,-0.1,0.1],
    ]


  } else if (this.name === "Support") {
    return [
      [-0.3,1,2.3],
      [-0.3,1,-0.3],
      [2.3,1,-0.3],
      [2.3,1,2.3]
    ]
  } else if (this.name === "Label-Support-High") {
    return [
      [-0.1,1.9,2.1],
      [-0.1,1.9,-0.1],
      [2.1,1.9,-0.1],
      [2.1,1.9,2.1],
    ]
  } else if (this.name === "Label-Support-Low") {
    return [
      [-0.1,0.1,2.1],
      [-0.1,0.1,-0.1],
      [2.1,0.1,-0.1],
      [2.1,0.1,2.1],
    ]
  }
}