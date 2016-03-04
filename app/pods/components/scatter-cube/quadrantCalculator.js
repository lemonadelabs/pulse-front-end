export default function QuadrantCalculator (opts) {
  this.cameraPosition = opts.cameraPosition
  this.onQuadrantUpdate = opts.onQuadrantUpdate
  this.quadrant = 1 // initial quadrant
  this.prevQuadrant = undefined
}

QuadrantCalculator.prototype.update = function() {
  var x = this.cameraPosition.x
  var z = this.cameraPosition.z
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