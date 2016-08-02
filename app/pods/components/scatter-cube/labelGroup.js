import Label from './label'

/**
* constructor
* @method LabelGroup
* @param {Object} opts
*   @param {Object} opts.scene three.js scene
*/
export default function LabelGroup (opts) {
  this.objLoader = new THREE.ObjectLoader()
  this.scene = opts.scene

  this.labels = []
}

/**
* instantiates all text labels
* @method createLabels
* @param {Object} opts
*   @param {Function} opts.runFunctionAtFps
*   @param {Number} opts.initialQuadrant
*/

LabelGroup.prototype.createLabels = function(opts) {
  var self = this
  this.objLoader.load("./assets/geometries/labels.json", function (labelScene) {
    // the label meshes are the first 9 children in the labelscene. Not sure what the other children are.
    var labelMeshes = labelScene.children.splice(0,9)
    _.forEach(labelMeshes, function (labelMesh) {
      labelMesh.material = new THREE.MeshBasicMaterial({
        shading: THREE.FlatShading,
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        depthTest: false // makes the labels render in front of the danger zone
      });

      var label = new Label({
        mesh: labelMesh,
        name: labelMesh.name
      })
      self.labels.push(label)
      self.scene.add(label.mesh)
    })
    opts.runFunctionAtFps({
      toRun : self.animateLabels.bind(self),
      args : opts.initialQuadrant
    })
  })
};

LabelGroup.prototype.animateLabels = function(quadrant) { // executed on quadrant change
  _.forEach(this.labels, function (label) {
    label.updateLocation(quadrant)
  })
};

