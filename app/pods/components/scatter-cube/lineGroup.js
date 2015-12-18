import ConnectingLine from './connectingLine';

export default function LineGroup (opts) {
  this.allConnections = opts.connections
  this.sHPoints = undefined

  this.primaryConnections = []
  this.needsUpdate = false
}

LineGroup.prototype.archiveSHPoints = function(sHPoints) {
  var points = {}
  for (var i = 0; i < sHPoints.length; i++) {
    var id = sHPoints[i].id
    points[id] = sHPoints[i]
  }
  this.sHPoints = points
}

LineGroup.prototype.getConnectionsForStakeholder = function(sHPoint, currentWeek) {
  var connectionsForStakeholder = []
  for (var i = 0; i < this.allConnections.length; i++) {
    if (this.allConnections[i].sh1_id == sHPoint.id && this.allConnections[i].week == currentWeek) {
      connectionsForStakeholder.push(this.allConnections[i])
    }
  }
  return connectionsForStakeholder
}

LineGroup.prototype.drawConnections = function(sHPoint, currentWeek) {
  this.createPrimaryConnections(sHPoint, currentWeek)
}

LineGroup.prototype.createPrimaryConnections = function(sHPoint, currentWeek) {
  var self = this
  var connectingLines = []
  var connections = this.getConnectionsForStakeholder(sHPoint, currentWeek)
  forEach(connections, function (connection) {

    var sHPointB = self.sHPoints[connection.sh2_id]
    var line = new ConnectingLine({
      // pass in material depending on the connection strength
      pointA: sHPoint,
      pointB: sHPointB,
      strength: connection.strength
    })
    connectingLines.push(line)
  })
  this.primaryConnections = connectingLines
}

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