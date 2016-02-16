import Ember from 'ember';
import projectData from '../../mockData/getProjects'
import getRelationships from '../../mockData/getRelationships'
import data4Week from '../../mockData/testDataMultiWeek'

export default Ember.Route.extend({

  model: function (params) {

    // return Em.RSVP.hash({
    //   metadata : this.store.findRecord('project', 1 ),
    //   stakeholders : this.store.findRecord('project', 1).then( function (project) {
    //     project.get('stakeholders')
    //   }),
    //   stakeholderSnapshots : this.store.findRecord('project', 1).then( function (project) {
    //     project.get('stakeholderSnapshots')
    //   })
    // })

    var model = {
      metadata : projectData(), // aka project
      stakeholders : data4Week(),
      // stakeholderSnapshots : undefined,
      relationships : getRelationships()
    }

    return model
  }
    // var model = Ember.Object.extend({
    //   metadata : undefined, // aka project
    //   stakeholders : undefined,
    //   stakeholderSnapshots : undefined,
    //   relationships : undefined
    // })

    // // project from store
    // this.store.findRecord('project', 1 ).then(function (project) {
    //   // Ember.set
    //   model.set('metadata', project)

    //   project.get('stakeholderSnapshots').then(function (stakeholderSnapshots) {
    //     model.set('stakeholderSnapshots', stakeholderSnapshots)
    //   })

    //   project.get('stakeholders').then(function (stakeholders) {
    //     model.set('stakeholders', stakeholders)
    //   })

    // })



});
