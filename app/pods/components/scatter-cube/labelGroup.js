import Label from './label'

export default function LabelGroup (opts) {
  this.objLoader = new THREE.ObjectLoader()
  this.scene = opts.scene
  this.camera = opts.camera

  this.labels = []
  this.quadrant = null

  this.prevQuadrant = undefined

}

LabelGroup.prototype.createLabels = function() {
  var self = this
  this.objLoader.load("./assets/geometries/labels.json", function (labelScene) {
    for (var i = 0; i < 9; i++) {
      var child = labelScene.children[0]
      child.material = new THREE.MeshBasicMaterial({
        shading: THREE.FlatShading,
        color: 0xffffff,
        transparent: true,
        opacity: 0,
        depthTest: false // makes the labels render in front of the danger zone
      });

      var label = new Label({
        mesh: child,
        name: child.name
      })
      self.labels.push(label)
      self.scene.add(label.mesh)
    };
    self.initLocation(self.camera.position)
  })
};

LabelGroup.prototype.updateLocation = function(cameraPosition) {
  this.updateQuadrant(cameraPosition)
  if (this.prevQuadrant != this.quadrant) {
    this.animateLabels()
  }
};

LabelGroup.prototype.initLocation = function(cameraPosition) {
  var self = this
  self.updateQuadrant(cameraPosition) // added this in to fix an error
  forEach(this.labels, function (label) {
    label.initLocation(self.quadrant)
  })
};

LabelGroup.prototype.animateLabels = function() {
  var self = this
  forEach(this.labels, function (label) {
    label.updateLocation(self.quadrant)
  })
};

LabelGroup.prototype.updateQuadrant = function(cameraPosition) {
  var x = cameraPosition.x
  var z = cameraPosition.z
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
};




function forEach(array, action) {
  for (var i = 0; i < array.length; i++)
    action(array[i]);
}