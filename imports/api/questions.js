import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Question = new Mongo.Collection('Question');

if (Meteor.isServer) {
    Meteor.publish('questions', function questionPublication() {
        return Question.find({});
    });
}

Meteor.methods({
    'questions.insert'(questions, interviewid) {
        if (!this.userId) {
            throw new Meteor.Error('not-authorized');
        }
        var result = [];
        var questionObj = {};
        questions.forEach(function(question){
            questionObj.question = question;
            questionObj.interview = interviewid;
            result.push(Question.insert(questionObj));
        });
        return result;
    }
});