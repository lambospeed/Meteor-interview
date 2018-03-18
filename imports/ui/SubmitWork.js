import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Files from '../api/Files.js';
import Dropzone from 'react-dropzone';
import { Interview } from '../api/interviews.js';
import { Submission } from '../api/submissions.js';


// App component - represents the whole app
class SubmitWork extends Component {
    constructor(props) {
        super(props);
        this.state = {      
            files:[],
            startTime : new Date()
        };
    }  
    handleNextClick(event) {        
        if(this.state.files.length === 0){
            alert("Please select file to upload.")
            return;
        }
        var startTime = this.state.startTime;
        var endTime = new Date()
        
        function timeConversion(millisec) {

            var seconds = (millisec / 1000).toFixed(1);

            var minutes = (millisec / (1000 * 60)).toFixed(1);

            var hours = (millisec / (1000 * 60 * 60)).toFixed(1);

            var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);

            if (seconds < 60) {
                return seconds + " Sec";
            } else if (minutes < 60) {
                return minutes + " Min";
            } else if (hours < 24) {
                return hours + " Hrs";
            } else {
                return days + " Days"
            }
        }
        var submission = {};
        var submissionid = this.props.submission._id;
        submission.completionTime = timeConversion(endTime.getTime() - startTime.getTime());            
        var sampleWorkFile = new FS.File(this.state.files[0]);
        sampleWorkFile.interview = this.props.interview._id;
        Files.insert(sampleWorkFile, function(err, image){
            if(err){
                alert("Couldn't upload the file");
            }else{
                submission.imageid = image._id;                    
                submission.image = image.original.name;                    
                Meteor.call('submission.update', submission, submissionid, function(err, submissionid){
                    if(err){
                        alert("couldn't upload the file, please contact administrator");
                    }else{
                        FlowRouter.go('Home');
                    }
                }) 
            }
        });     
    }
    onDrop(acceptedFiles, rejectedFiles) {        
        this.setState({
            files : acceptedFiles
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
        const sectionStyle = {marginTop:'20px'};
        const dropZonStyle = {
            width: '300px',
            height: '200px',
            borderWidth: '2px',
            borderColor: 'rgb(102, 102, 102)',
            borderStyle: 'dashed',
            borderRadius: '5px',
            margin: 'auto',
            cursor: 'pointer'
        }
        var imageHtml = '';
        if(this.props.imagesURL){
            imageHtml = <div className="form-group">
                            <img src={this.props.imagesURL} style={{width:'100%'}}/>
                            <a href={this.props.imagesURL} target="_blank">
                                download
                            </a>            
                        </div>;
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
                <div className="col-xs-12">
                    <div style={{margin:'auto', marginTop: '50px', width: '600px', padding: '20px', border: '1px solid black'}}>
                        <section style={sectionStyle} className="text-center">
                            <h5 className="section-header text-center">
                                Use the provided files to complete the task.
                            </h5>
                            {imageHtml}    
                        </section>                          
                    </div>
                </div> 
                <div className="col-xs-12">
                    <div style={{margin:'auto', marginTop: '50px', width: '600px', padding: '20px', border: '1px solid black'}}>
                        <section style={sectionStyle}>
                            <h5 className="section-header text-center">
                                Upload Completed File To Stop The Timer
                            </h5>
                            <div className="dropzone">
                                <Dropzone onDrop={this.onDrop.bind(this)} style={dropZonStyle} multiple={false}>
                                    <div className="text-center" style={{paddingTop: '50px'}}>
                                        <i className="fa fa-upload fa-4x" aria-hidden="true"></i>
                                    </div>
                                </Dropzone>
                                <div className="text-center">
                                    <ul>
                                        {
                                        this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                                        }
                                    </ul>
                                </div>
                            </div>
                            <div className="form-group text-center">
                                <button type="button" onClick={this.handleNextClick.bind(this)}>Submit My Work</button>
                            </div>
                        </section>                          
                    </div>
                </div> 
            </div>
        );
    }
}

export default withTracker((SubmitWork) => {
    Meteor.subscribe('interviews');
    Meteor.subscribe('files');
    Meteor.subscribe('submissions');
    var data = {
        interview: Interview.find({_id: SubmitWork.interviewid}).fetch()[0],
        image: Files.find({interview: SubmitWork.interviewid}).fetch()[0],
        currentUser: Meteor.user(),
        submission: Submission.findOne({_id : SubmitWork.submissionid})
    };   
    if(data.image){        
        data.imagesURL = "/~/uploads/" + data.image.copies.Files.key;
    }
    return data;
})(SubmitWork);
