import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Interview } from '../api/interviews.js';
import { Question } from '../api/questions.js';
import { Submission } from '../api/submissions.js';
import Files from '../api/Files.js';
import { Mongo } from 'meteor/mongo';

// App component - represents the whole app
class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    deleteInterview(interview){
        Meteor.call('interview.delete', interview, function(err, res){
            if(err){
                alert("error in deleting interview");                
            }else{
                console.log(res);   
            }
        });
    }
    downloadFile(imageId){
        var image = Files.findOne(imageId);
        window.open("/~/uploads/" + image.copies.Files.key);
    }
    createInterview(event){
        event.preventDefault();
        FlowRouter.go('CreateInterview');
    }
    handleSubmit(event) {
        event.preventDefault();
        // Find the text field via the React ref
        const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
        
        Meteor.call('tasks.insert', text);
    
        // Clear form
        ReactDOM.findDOMNode(this.refs.textInput).value = '';
    }
    
    handleLogout(event){
        event.preventDefault();
        Meteor.logout(()=>{
            FlowRouter.go('Login');
        });        
    }
    render() {

        var userName = "User";
        var user = Meteor.user();
        if(user){
            userName = user.username;
        }

        return (
            <div className="row main main-login" style={{padding: "20px 20px", margin: '50px'}}>           
                <div className="col-xs-12">
                    <span>
                        <h4 style={{display: 'inherit'}}>Submissions</h4>
                    </span>
                    <span className="pull-right"> Welcome {userName} <a href="javascript:void(0);" onClick={this.handleLogout}>Logout</a></span>
                </div>
                <div className="col-xs-12">
                    <button type="button" className="pull-right" style={{marginTop: '20px'}} onClick={this.createInterview}>Create New Interview</button>
                </div>
                {
                    this.props.interviews.map((interview)=>{
                        return <div className="col-xs-12" style={{marginTop:'50px'}}  key={interview._id}>
                                <span><h4 style={{display:'inherit'}}>{interview.position}</h4></span>
                                <a className="pull-right" href="javascript:void(0);" onClick={this.deleteInterview.bind(this, interview)}>delete</a>
                                <table className="table table-striped table-bordered" style={{marginTop:'10px'}}>
                                    <thead>
                                        <tr>
                                            {
                                                interview.questions.map((question)=>{
                                                    return <th  key={question._id}>{question.question}</th>
                                                })
                                            }
                                            <th>Time to complete</th>
                                            <th>Files Uploaded</th>
                                        </tr>
                                    </thead>
                                    <tbody>    
                                        {
                                            interview.submissions.map((submission)=>{
                                                return <tr>
                                                    {
                                                        interview.questions.map((question)=>{
                                                            return <td>{submission.answers[question._id]}</td>
                                                        })
                                                    }
                                                    <td>{submission.completionTime}</td>
                                                    <td>
                                                        {
                                                            submission.image?<a href="javascript:void(0);" onClick={this.downloadFile.bind(this, submission.imageid)} target="_blank">{submission.image}</a>:''
                                                        }                                                        
                                                    </td>

                                                </tr> 
                                            })
                                        }                                   
                                    </tbody>
                                </table>
                            </div>
                    })                   
                }
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('interviews');
    Meteor.subscribe('questions');
    Meteor.subscribe('submissions');
    Meteor.subscribe('files');
    
    var data = {
        interviews: Interview.find({}).fetch(),
        questions: [],
        currentUser: Meteor.user(),
    };
    data.interviews.forEach(function(interview){
        interview.questions = Question.find({interview : interview._id}).fetch();
        interview.submissions = Submission.find({interviewid : interview._id}).fetch();
    });    

    return data;
})(Admin);
