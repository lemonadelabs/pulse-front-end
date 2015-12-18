import Ember from 'ember';
import projectData from '../../mockData/getProjects'
import data4Week from '../../mockData/testDataMultiWeek'

export default Ember.Route.extend({
   model: function() {
     var mockModel = {
       projectData : undefined,
       data4Week : undefined
     }
     mockModel.projectData = projectData();
     mockModel.data4Week = data4Week();
    return mockModel;
  }
});
