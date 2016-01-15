import HistoryTail from './historyTail'

export default function HistoryTailGroup (opts) {
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