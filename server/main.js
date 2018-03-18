import { Meteor } from 'meteor/meteor';
import '../imports/api/interviews.js';
import '../imports/api/questions.js';
import '../imports/api/submissions.js';
import '../imports/api/Files.js';

Meteor.startup(() => {
    if ( Meteor.users.find().count() === 0 ) {
        Accounts.createUser({
            username: 'smartlawio',
            password: 'QK&V^Lnyrrd66v'
        });
    }
});
