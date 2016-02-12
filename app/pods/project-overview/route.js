import Ember from 'ember';
import projectData from '../../mockData/getProjects'
import getRelationships from '../../mockData/getRelationships'
import data4Week from '../../mockData/testDataMultiWeek'

export default Ember.Route.extend({

  model: function (params) {

    var mockModel = {
      metadata : undefined, // aka project
      stakeholders : undefined,
      relationships : undefined
    }

    // project from store
    this.store.findRecord('project', 1 ).then(function (project) {


      project.get('stakeholderSnapshots').then(function (data) {
        console.log(data)
      })

      project.get('stakeholders').then(function (data) {
        console.log(data)
      })

    })



    // return {
    //   project: this.store.findRecord('project', {id: params.id} ),
    //   // stakeholders: this.store.findRecords('stakeholders', params.id),
    //   relationships: getRelationships()
    // }

    // stakeholders for project from store

    // mock relationships

    mockModel.metadata = projectData()
    mockModel.stakeholders = data4Week();
    mockModel.relationships = getRelationships();

    // console.log(mockModel.metadata.getContent())

    return mockModel;
  }


});
