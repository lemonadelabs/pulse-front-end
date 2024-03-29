import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  image: DS.attr('string'),
  organisation: DS.attr('string'),
  role: DS.attr('string'),
  tags: DS.attr(),
  notes: DS.attr('string'),
  stakeholderSnapshots: DS.hasMany('stakeholder-snapshot', { async: true } ),
  projects: DS.hasMany('project' , { async: true } ), // through stakeholder-snapshots
});
