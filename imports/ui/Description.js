import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Interview } from '../api/interviews.js';

// App component - represents the whole app
class Description extends Component {
    handleNextClick(event) {
        FlowRouter.go('/submitwork/'+this.props.interviewid+"/"+this.props.submissionid);    
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
        const sectionStyle = {marginTop:'20px'};

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
                <div className="col-xs-12">
                    <div style={{margin:'auto', marginTop: '50px', width: '600px', padding: '20px', border: '1px solid black'}}>
                        <section style={sectionStyle}>
                            <h5 className="section-header">
                                {this.props.interview?this.props.interview.taskTitle:''}
                            </h5>
                            <div className="form-group">
                                <p>{this.props.interview?this.props.interview.taskDescription:''}</p>
                            </div>
                            <div className="form-group text-right">
                                <button type="button" onClick={this.handleNextClick.bind(this)}>I'm ready to start</button>
                            </div>
                        </section>                          
                    </div>
                </div> 
            </div>
        );
    }
}

export default withTracker((Description) => {
    Meteor.subscribe('interviews');
    var data = {
        interview: Interview.find({_id: Description.interviewid}).fetch()[0],
        currentUser: Meteor.user(),
    };   
    return data;
})(Description);
