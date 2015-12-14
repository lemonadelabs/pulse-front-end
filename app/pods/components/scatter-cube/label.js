export default function Label (opts) {
  this.mesh = opts.mesh
  this.name = opts.name
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
  var fadeOutTween = new TWEEN.Tween(this.mesh.material)
      .to({opacity: 0.0}, 250)
      .easing(TWEEN.Easing.Exponential.Out)
      .onComplete(function () {
        self.mesh.position.set(coords[0],coords[1],coords[2])
        fadeInTween.start()
      })
      .start();

  var fadeInTween = new TWEEN.Tween(self.mesh.material)
      .to({opacity: 1.0}, 300)
};

Label.prototype.generateCoords = function() {
  if (this.name === "Power") {
    var coords = [
        [1,-0.1,-0.5],
        [1,-0.1,-0.5],
        [1,-0.1,2.5],
        [1,-0.1,2.5]
      ]
    return coords
  } else if (this.name === "Label-High-Power") {
    var coords = [
        [1.9,-0.1,-0.1],
        [1.9,-0.1,-0.1],
        [1.9,-0.1,2.1],
        [1.9,-0.1,2.1]
      ]
    return coords
  } else if (this.name === "Label-Power-Low") {
    var coords = [
        [0.1,-0.1,-0.1],
        [0.1,-0.1,-0.1],
        [0.1,-0.1,2.1],
        [0.1,-0.1,2.1]
      ]
    return coords
  } else if (this.name === "Support") {
    var coords = [
        [-0.5,-0.1,1],
        [2.5,-0.1,1],
        [2.5,-0.1,1],
        [-0.5,-0.1,1]
      ]
    return coords
  } else if (this.name === "Label-Support-High") {
    var coords = [
        [-0.1,-0.1,1.9],
        [2.1,-0.1,1.9],
        [2.1,-0.1,1.9],
        [-0.1,-0.1,1.9],
      ]
    return coords
  } else if (this.name === "Label-Support-Low") {
    var coords = [
        [-0.1,-0.1,0.1],
        [2.1,-0.1,0.1],
        [2.1,-0.1,0.1],
        [-0.1,-0.1,0.1],
      ]
    return coords
  } else if (this.name === "Vital") {
    var coords = [
        [-0.3,1,2.3],
        [-0.3,1,-0.3],
        [2.3,1,-0.3],
        [2.3,1,2.3]
      ]
    return coords
  } else if (this.name === "Label-Low-Vital") {
    var coords = [
        [-0.1,0.1,2.1],
        [-0.1,0.1,-0.1],
        [2.1,0.1,-0.1],
        [2.1,0.1,2.1],
      ]
    return coords
  } else if (this.name === "Label-High-Vital") {
    var coords = [
        [-0.1,1.9,2.1],
        [-0.1,1.9,-0.1],
        [2.1,1.9,-0.1],
        [2.1,1.9,2.1],
      ]
    return coords
  }
}