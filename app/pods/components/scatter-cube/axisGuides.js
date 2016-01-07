import AxisGuideLine from './axisGuideLine';

export default function AxisGuides () {
  this.material = this.createMaterial()
  this.lines = this.createLines()
}

AxisGuides.prototype.createMaterial = function() {
  return new THREE.MeshBasicMaterial({
    color: 0xffffff,
    linewidth: 1,
    transparent: true,
    opacity: 0.1
  });
};

AxisGuides.prototype.createLines = function() {
  var self = this
  var lines = []
  var linesVertices

  linesVertices = [
    // x = power
    // y = support
    // z = vital

    // middel lines
    [
      new THREE.Vector3(1,1,0),
      new THREE.Vector3(1,1,2)
    ],
    [
      new THREE.Vector3(1,0,1),
      new THREE.Vector3(1,2,1)
    ],
    [
      new THREE.Vector3(0,1,1),
      new THREE.Vector3(2,1,1)
    ],

    // other lines
    [
      new THREE.Vector3(1,0,0),
      new THREE.Vector3(1,2,0)
    ],
    [
      new THREE.Vector3(1,0,2),
      new THREE.Vector3(1,2,2)
    ],
    [
      new THREE.Vector3(0,1,2),
      new THREE.Vector3(2,1,2)
    ],
    [
      new THREE.Vector3(0,1,2),
      new THREE.Vector3(0,1,0)
    ],
    [
      new THREE.Vector3(0,1,0),
      new THREE.Vector3(2,1,0)
    ],
    [
      new THREE.Vector3(2,1,0),
      new THREE.Vector3(2,1,2)
    ],
    [
      new THREE.Vector3(0,0,1),
      new THREE.Vector3(0,2,1)
    ],
    [
      new THREE.Vector3(2,0,1),
      new THREE.Vector3(2,2,1)
    ],

    [
      new THREE.Vector3(2,0,1),
      new THREE.Vector3(0,0,1)
    ],
    [
      new THREE.Vector3(2,2,1),
      new THREE.Vector3(0,2,1)
    ],

    [
      new THREE.Vector3(1,0,0),
      new THREE.Vector3(1,0,2)
    ],
    [
      new THREE.Vector3(1,2,0),
      new THREE.Vector3(1,2,2)
    ]
  ]

  _.forEach(linesVertices, function (vertices) {
    lines.push(
      new AxisGuideLine({
        vertices: vertices,
        material : self.material,
      })
    )
  })

  return lines
}

