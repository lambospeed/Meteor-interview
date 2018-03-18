import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Question } from './questions.js';
import Files from './Files.js';
import { Submission } from './submissions.js';


export const Interview = new Mongo.Collection('Interview');

if (Meteor.isServer) {
    Meteor.publish('interviews', function interviewPublication() {
        return Interview.find({});        
    });
}

Meteor.methods({
    'interview.insert'(interview) {
        if (! this.userId) {
            throw new Meteor.Error('not-authorized');
        }
        return Interview.insert(interview);
    },
    'interview.delete'(interview){        
        Question.remove({interview: interview._id});
        Files.remove({interview : interview._id});
        Submission.remove({interviewid : interview._id});        
        Interview.remove({_id: interview._id});
    }
});