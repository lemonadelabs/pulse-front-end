export default function QuadrantCalculator (opts) {
  this.camera = opts.camera
  this.onQuadrantUpdate = opts.onQuadrantUpdate
  this.quadrant = undefined
  this.prevQuadrant = undefined
}

QuadrantCalculator.prototype.update = function() {
  var x = this.camera.position.x
  var z = this.camera.position.z
  var quadrant
  if (x <= 1 && z <= 1) {
    quadrant = 0
  } else if ( x >= 1 && z <= 1) {
    quadrant = 1
  } else if ( x >= 1 && z >= 1) {
    quadrant = 2
  } else if ( x <= 1 && z >= 1) {
    quadrant = 3
  }
  this.prevQuadrant = this.quadrant
  this.quadrant = quadrant
  if (this.prevQuadrant !== this.quadrant) {
    this.onQuadrantUpdate(quadrant)
  }
};