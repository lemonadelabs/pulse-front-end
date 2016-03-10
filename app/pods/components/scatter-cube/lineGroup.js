import ConnectingLine from './connectingLine';

export default function LineGroup (opts) {
  this.addObjectsToScene = opts.addObjectsToScene
  this.getConnections = opts.getConnections
  this.fadeInConnections = opts.fadeInConnections
  this.removeConnectingLines = opts.removeConnectingLines
  this.sHPoints = undefined
  this.previousStakeholderId = undefined

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

LineGroup.prototype.getConnectionsForStakeholder = function(opts) {
  return this.getConnections({
    projectId : opts.projectId,
    stakeholderId : opts.sHPoint.id,
    week: opts.currentWeek
  })
}

LineGroup.prototype.drawConnections = function(opts) {
  this.createPrimaryConnections(opts)
}

LineGroup.prototype.createPrimaryConnections = function(opts) {

  var self = this
  this.getConnectionsForStakeholder(opts).then(function (connections) {
    self.removeConnectingLines()
    var connectingLines = []
    _.forEach(connections, function (connection) {
      var acquaintance = self.sHPoints[connection.acquaintance_id]
      var line = new ConnectingLine({
        pointA: opts.sHPoint,
        pointB: acquaintance,
        strength: connection.strength
      })
      connectingLines.push(line)
    })
    self.primaryConnections = connectingLines
    if (opts.sHPoint.id !== self.previousStakeholderId) {
      self.fadeInConnections({
        duration : 300,
        easing : TWEEN.Easing.Quadratic.Out
      })
    }
    self.addObjectsToScene(connectingLines)
    self.previousStakeholderId = opts.sHPoint.id
  })
}


LineGroup.prototype.update = function () {
  var self = this
  if (this.needsUpdate) {
    _.forEach(self.primaryConnections, function (connectingLine) {
      connectingLine.mesh.geometry.verticesNeedUpdate = true
    })
  }
}

