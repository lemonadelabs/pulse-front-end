import ConnectingLine from './connectingLine';

export default function LineGroup (opts) {
  // this.connections = opts.connections
  this.getConnections = opts.getConnections
  // this.sHPoints = undefined

  this.primaryConnections = []
  this.needsUpdate = false
}

// LineGroup.prototype.archiveSHPoints = function(sHPoints) {
//   var points = {}
//   for (var i = 0; i < sHPoints.length; i++) {
//     var id = sHPoints[i].id
//     points[id] = sHPoints[i]
//   }
//   this.sHPoints = points
// }

LineGroup.prototype.getConnectionsForStakeholder = function(opts) {
  var self = this
  // {sHPoint: SHPointClickTarget, currentWeek: 4}
  // return Ember.$.getJSON('projects/' +  opts.projectId + '/stakeholders/' + opts.stakeholderId + '/connections?week=' + opts.week)

  this.getConnections({
    projectId : opts.projectId,
    stakeholderId : opts.sHPoint.id,
    week: opts.currentWeek
  })

  console.log(opts)


  // var connectionsForStakeholder = []
  // _.forEach(this.connections, function (connection) {
  //   if (connection.stakeholderId == opts.sHPoint.id && connection.week == opts.currentWeek) {
  //     connectionsForStakeholder.push(connection)
  //   }
  // })
  // return connectionsForStakeholder
}

LineGroup.prototype.drawConnections = function(opts) {
  this.createPrimaryConnections(opts)
}

LineGroup.prototype.createPrimaryConnections = function(opts) {
  var self = this
  var connectingLines = []
  var connections = this.getConnectionsForStakeholder(opts)
  _.forEach(connections, function (connection) {

    var acquaintance = self.sHPoints[connection.acquaintance_id]
    var line = new ConnectingLine({
      // pass in material depending on the connection strength
      pointA: opts.sHPoint,
      pointB: acquaintance,
      strength: connection.strength
    })
    connectingLines.push(line)
  })
  this.primaryConnections = connectingLines
}

LineGroup.prototype.update = function () {
  var self = this
  if (this.needsUpdate) {
    _.forEach(self.primaryConnections, function (connectingLine) {
      connectingLine.mesh.geometry.verticesNeedUpdate = true
    })
  }
}

