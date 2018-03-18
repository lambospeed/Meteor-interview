import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Interview } from '../api/interviews.js';
import { Question } from '../api/questions.js';
import { Submission } from '../api/submissions.js';

// App component - represents the whole app
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedInterview : {}
        };
    }
    setActiveInterview(event){
        event.preventDefault();
        const interviewid = ReactDOM.findDOMNode(this.refs.interviewid).value.trim();
        var selectedInterview = this.props.interviews.filter(function(interview){
            return interview._id === interviewid;
        });
        this.setState({
            selectedInterview : selectedInterview.length>0?selectedInterview[0]:{}
        });
    }
    handleSubmit(event) {
        event.preventDefault();
        const interviewid = ReactDOM.findDOMNode(this.refs.interviewid).value.trim();
        var answers = {};
        for(var key in this.refs){
            if(key !== 'interviewid'){
                var ref = this.refs[key];            
                var value = ReactDOM.findDOMNode(ref).value.trim();
                answers[key] = value;
            }                    
        }
        var submission = {
            interviewid: interviewid,
            answers: answers
        }
        Meteor.call('submission.insert', submission, function(err, submissionId) {            
            if (err) {
                alert("could not insert interview, please try again latter");
            } else {
                FlowRouter.go('/description/'+interviewid+"/"+submissionId);
            }
        });
    }
    
    handleLogout(event){
        event.preventDefault();
        Meteor.logout(()=>{
            FlowRouter.go('Login');
        });        
    }
    render() {

        var userName = "";
        var user = Meteor.user();
        if(user){
            userName = user.username;
        }
        const textBoxStyle = {marginLeft:'50px'};
        const sectionStyle = {marginTop:'20px'};
        var questions = [];        
        if(this.state.selectedInterview.questions){
            questions = this.state.selectedInterview.questions;
        }
        return (
            <div className="row main main-login" style={{padding: "20px 20px", margin: '50px'}}>           
                <div className="col-xs-12">
                    <span>
                        <h4 style={{display: 'inherit'}}>Smartlaw Interviews</h4>
                    </span>
                    {userName?
                        <span className="pull-right"> Welcome <a href="/Admin">{userName}</a> <a href="javascript:void(0);" onClick={this.handleLogout}>Logout</a></span>
                        :<span className="pull-right"> <a href="/login">Admin Login</a></span>}
                </div>
                <form action="#"  onSubmit={this.handleSubmit.bind(this)}>
                    <div className="col-xs-12">
                        <div style={{margin:'auto', marginTop: '50px', width: '600px', padding: '20px', border: '1px solid black'}}>
                            <h4>Step One: What position are you applying for?</h4>
                            <section style={sectionStyle}>
                                <h5 className="section-header">What is the position?</h5>
                                <div className="form-group">
                                    <div style={textBoxStyle}>
                                        <select required ref="interviewid" className="form-control input-sm" onChange={this.setActiveInterview.bind(this)}>
                                            <option value="">Select a position</option>
                                            {
                                                this.props.interviews.map(function(interview){
                                                    return <option value={interview._id} key={interview._id}>{interview.position}</option>
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                            </section>                          
                        </div>
                    </div>
                    <div className="col-xs-12">
                        <div style={{margin:'auto', marginTop: '20px', width: '600px', padding: '20px', border: '1px solid black'}}>
                            <h4>Step Two: A few quick questions</h4>
                            {
                                questions.map(function(question){
                                    return <section style={sectionStyle} key={question._id}>
                                        <h5 className="section-header">{question.question}</h5>
                                        <div className="form-group">
                                            <div style={textBoxStyle}>
                                                <input required type="text" ref={question._id} className="form-control input-sm"/>
                                            </div>
                                        </div>
                                    </section>
                                })
                            }
                            
                            <section style={sectionStyle}>
                                <div className="form-group text-right">
                                    <button type="submit">Next</button>
                                </div>
                            </section>                            
                        </div>
                    </div>                 
                </form>  
            </div>
        );
    }
}

export default withTracker(() => {
    Meteor.subscribe('interviews');
    Meteor.subscribe('questions');
    var data = {
        interviews: Interview.find({}).fetch(),
        questions: [],
        currentUser: Meteor.user(),
    };
    data.interviews.forEach(function(interview){
        interview.questions = Question.find({interview : interview._id}).fetch();
    });    
    return data;
})(Home);
