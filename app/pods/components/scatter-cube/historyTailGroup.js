import HistoryTail from './historyTail'

export default function HistoryTailGroup () {
  // this allows us to have more than one history tail. Current implementation is for only one tail at a time
  this.historyTails = []
}

HistoryTailGroup.prototype.buildTails = function(opts) {
  this.historyTails = []
  var tail = new HistoryTail ({
    sHPoint : opts.sHPoint,
    environment : opts.environment
  })
  this.historyTails.push(tail)
};