import ConnectingLine from './connectingLine';

export default function LineGroup (opts) {
  this.connections = opts.connections

  this.primaryConnections = []
  this.needsUpdate = false
}

LineGroup.prototype.drawConnections = function(sHPoint) {
  this.createPrimaryConnections(sHPoint)
};

LineGroup.prototype.createPrimaryConnections = function(sHPoint) {
  var connectingLines = []
  forEach(this.connections, function (pointB) {
    var line = new ConnectingLine({
      // pass in material depending on the connection strength
      pointA: sHPoint,
      pointB: pointB
    })
    connectingLines.push(line)
  })
  this.primaryConnections = connectingLines
};

LineGroup.prototype.update = function () {
  var self = this
  if (this.needsUpdate) {
    forEach(self.primaryConnections, function (connectingLine) {
      connectingLine.mesh.geometry.verticesNeedUpdate = true
    })
  }
}

function forEach(array, action) {
  for (var i = 0; i < array.length; i++) {
    action(array[i])
  }
}