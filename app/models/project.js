import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  client: DS.attr('string'),
  timeframe: DS.attr('number'),
  timeFormat: DS.attr('string'),
  totalStakeholders: DS.attr('number'),
  projectOverview: DS.attr('string'),
  stakeholderSnapshots: DS.hasMany('stakeholder-snapshot')
});
