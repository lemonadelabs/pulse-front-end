import DS from 'ember-data';

export default DS.Model.extend({
  strength: DS.attr('number'),
  stakeholder: DS.belongsTo('stakeholder'),
  stakeholderSnapshot: DS.belongsTo('stakeholder-snapshot')
});
