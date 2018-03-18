import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Submission = new Mongo.Collection('Submission');

if (Meteor.isServer) {
    Meteor.publish('submissions', function submissionPublication() {
        return Submission.find({});
    });
}

Meteor.methods({
    'submission.insert'(submission) {
        return Submission.insert(submission);
    },
    'submission.update'(submission, submissionid) {
        Submission.update(submissionid, { $set: submission });
    }
});