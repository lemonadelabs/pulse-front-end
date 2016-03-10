export default function AxisGuides () {
  this.linesVertices = this.linesVertices()
  this.material = this.createMaterial()
  this.mesh = this.createMesh()
}

AxisGuides.prototype.createMesh = function() {
  var geometries = []
  var geometry = new THREE.Geometry();
  _.forEach(this.linesVertices, function (vertices) {
    _.forEach(vertices, function (vert) {
      geometry.vertices.push(vert);
    })
  })

  var grid = new THREE.LineSegments( geometry, this.material )

  return grid
};

AxisGuides.prototype.createMaterial = function() {
  return new THREE.MeshBasicMaterial({
    color: 0xffffff,
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




  // todo: make the line segments all the same geometry. Also, maybe try and merge them with the cube geometry
  // use THREE.LineSegment ???????

  _.forEach(linesVertices, function (vertices) {
    var line = new AxisGuideLine({
      vertices : vertices,
      material : self.material
    })
    lines.push(line)
  })
  return lines
}