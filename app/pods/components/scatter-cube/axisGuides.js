import AxisGuideLine from './axisGuideLine';

export default function AxisGuides () {
  this.currentSHPoint = undefined

  this.material = this.createMaterial()
}

AxisGuides.prototype.updatePosition = function() {
  var pointPosition = this.currentSHPoint.mesh.position
  _.forEach(this.lines, function (line) {
    console.log(line)
  })
};

AxisGuides.prototype.createMaterial = function() {
  return new THREE.MeshBasicMaterial({
    color: 0xffffff,
    linewidth: 1,
    transparent: true,
    opacity: 0.1
  });
};

AxisGuides.prototype.createMeshes = function() {
  var self = this
  var lines = []
  var linesVertices

  // middel lines
  if (self.currentSHPoint === undefined) {
    linesVertices = [
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
      ]
    ]
  } else { // this will probably be deleted as it is dealing with the moving croshairs
    var position = self.currentSHPoint.mesh.position
      linesVertices = [
        [
          new THREE.Vector3(position.x,position.y,0),
          new THREE.Vector3(position.x,position.y,2)
        ],
        [
          new THREE.Vector3(position.x,0,position.z),
          new THREE.Vector3(position.x,2,position.z)
        ],
        [
          new THREE.Vector3(0,position.y, position.z),
          new THREE.Vector3(2,position.y, position.z)
        ]
      ]
  }

  // other lines

  var planeVertices = [
    // x = power
    // y = support
    // z = vital
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
    ],
  ]

  var allVertices = linesVertices.concat(planeVertices)

  _.forEach(allVertices, function (vertices) {
    lines.push(
      new AxisGuideLine({
        vertices: vertices,
        material : self.material,
      })
    )
  })

  this.lines = lines
}

