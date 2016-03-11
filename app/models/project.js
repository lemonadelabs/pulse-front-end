import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  client: DS.attr('string'),
  timeframe: DS.attr('number'),
  timeFormat: DS.attr('string'),
  totalStakeholders: DS.attr('number'),
  description: DS.attr('string'),

  stakeholderSnapshots: DS.hasMany('stakeholder-snapshot', { async: true }),
  stakeholders: DS.hasMany('stakeholder', { async: true })

});
