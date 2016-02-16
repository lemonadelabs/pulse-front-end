import Ember from 'ember';
import projectData from '../../mockData/getProjects'
import getRelationships from '../../mockData/getRelationships'
import data4Week from '../../mockData/testDataMultiWeek'

export default Ember.Route.extend({

  model: function (params) {

    // var model = {
    //   metadata : undefined,
    //   stakeholders : undefined,
    //   stakeholderSnapshots : undefined
    // }
    return this.store.findRecord('project', 1 )

    // this.store.findRecord('project', 1 ).then(function (project) {
    //   // Ember.set
    //   model.set('metadata', project)

    //   project.get('stakeholders').then(function (stakeholders) {
    //     model.set('stakeholders', stakeholders)
    //   })

    //   project.get('stakeholderSnapshots').then(function (stakeholderSnapshots) {
    //     model.set('stakeholderSnapshots', stakeholderSnapshots)
    //   })


    // })

    // var model = {
    //   metadata : projectData(), // aka project
    //   stakeholders : data4Week(),
    //   // stakeholderSnapshots : undefined,
    //   relationships : getRelationships()
    // }
  },
  // afterModel: function (model) {
  //   var self = this
  //   model.get('stakeholders').then(function(stakeholders) {
  //     model.set('stakeholders', stakeholders)
  //     // self.controllerFor('scatter-cube').set('stakeholders', stakeholders);
  //   });
  // },





});
