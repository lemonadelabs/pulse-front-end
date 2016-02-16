import Ember from 'ember';
import projectData from '../../mockData/getProjects'
import getRelationships from '../../mockData/getRelationships'
import data4Week from '../../mockData/testDataMultiWeek'

export default Ember.Route.extend({

  model: function (params) {
    return this.store.findRecord('project', 1 )
  },
});
