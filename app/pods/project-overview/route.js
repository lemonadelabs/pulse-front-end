import Ember from 'ember';
import projectData from '../../mockData/getProjects'
import data4Week from '../../mockData/testDataMultiWeek'

export default Ember.Route.extend({
   model: function() {
     var mockModel = {
       metadata : undefined,
       data4Week : undefined
     }
     mockModel.metadata = projectData();
     mockModel.data4Week = data4Week();
    return mockModel;
  }
});
