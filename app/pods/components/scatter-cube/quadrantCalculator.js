/**
* @method QuadrantCalculator
* @param {Object} opts
*   @param {Object} THREE.Vector3 opts.cameraPosition
*   @param {Function} opts.onQuadrantUpdate
*/
export default function QuadrantCalculator (opts) {
  this.cameraPosition = opts.cameraPosition
  this.onQuadrantUpdate = opts.onQuadrantUpdate
  this.quadrant = 1 // initial quadrant
  this.prevQuadrant = undefined
}

// called in the raf loop
QuadrantCalculator.prototype.update = function() {
  var x = this.cameraPosition.x
  var z = this.cameraPosition.z
  var quadrant
  // calculates current quadrant of camera based on camera position
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
  // if quadrant changes, execute onQuadrantUpdate
  if (this.prevQuadrant !== this.quadrant) {
    this.onQuadrantUpdate(quadrant)
  }
};