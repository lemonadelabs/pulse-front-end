import Ember from 'ember';
import projectData from '../../mockData/getProjects'
import getRelationships from '../../mockData/getRelationships'
import data4Week from '../../mockData/testDataMultiWeek'

export default Ember.Route.extend({

  model: function() {
    var mockModel = {
      metadata : undefined,
      stakeholders : undefined,
      relationships : undefined
    }
    mockModel.metadata = projectData();
    mockModel.stakeholders = data4Week();
    mockModel.relationships = getRelationships();

    return mockModel;
  }
});
