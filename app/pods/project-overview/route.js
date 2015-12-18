import Ember from 'ember';
import projectData from '../../mockData/getProjects'
import getRelationships from '../../mockData/getRelationships'
import data4Week from '../../mockData/testDataMultiWeek'

export default Ember.Route.extend({
  model: function() {
    var mockModel = {
      projectData : undefined,
      stakeholders : undefined,
      relationships : undefined
    }
    mockModel.projectData = projectData();
    mockModel.stakeholders = data4Week();
    mockModel.relationships = getRelationships();
    return mockModel;
  }
});
