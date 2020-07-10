import { Meteor } from 'meteor/meteor';
import '../imports/api/tasks';

Meteor.startup(() => {
  // If the Links collection is empty, add some data.
  console.log('AWS is up !');
});
