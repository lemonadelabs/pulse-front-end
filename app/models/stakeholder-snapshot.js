import DS from 'ember-data';

export default DS.Model.extend({
  project: DS.belongsTo('project'),
  stakeholder: DS.belongsTo('stakeholder'),
  week: DS.attr('number'),
  power: DS.attr('number'),
  support: DS.attr('number'),
  vital: DS.attr('number')
});
