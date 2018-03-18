import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import Dropzone from 'react-dropzone';
import ReactDOM from 'react-dom';
import Files from '../api/Files.js';

// Task component - represents a single todo item
class CreateInterview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            counter : 0,
            renderQuestions: true,       
            files:[]
        };
    }    
    onDrop(acceptedFiles, rejectedFiles) {        
        this.setState({
            files : acceptedFiles
        });
    }
    addNewQuestion(event){
        event.preventDefault();
        this.props.questions.push({
            key : 'Question'+(this.state.counter+1)
        });
        this.setState({
           counter : this.state.counter+1 
        })
    }
    handleSubmit(event){
        event.preventDefault();
        if(this.state.files.length === 0){
            alert("Please select sample file.")
            return;
        }
        var files = this.state.files;
        var interview = {
            position : '',            
            taskTitle: '',
            taskDescription: '',
            sampleTitle: ''
        };
        var questions = [
                "Full Name",
        ];
        for(var key in this.refs){
            var ref = this.refs[key];            
            var value = ReactDOM.findDOMNode(ref).value.trim();
            if(key.indexOf('Question')>-1){
                questions.push(value);
            }else{
                interview[key] = value;
            }            
        }
        Meteor.call('interview.insert', interview, function(err, interviewid) {            
            if (err) {
                alert("could not insert interview, please try again latter");
            } else {
                Meteor.call('questions.insert', questions, interviewid, function(err, ids){
                    if(err){
                        alert("could not insert questions, please try again latter");
                    } else {
                        var sampleWorkFile = new FS.File(files[0]);
                        sampleWorkFile.interview = interviewid;
                        Files.insert(sampleWorkFile, function(err, fileObj){
                            if(err){
                                alert("Couldn't upload the file");
                            }else{
                                FlowRouter.go('Admin');
                            }
                        });
                    }
                })
            }
        });
        
    }
    handleLogout(event){
        event.preventDefault();
        Meteor.logout(()=>{
            FlowRouter.go('Login');
        });        
    }
    renderQuestionInputBoxes() {
        const textBoxStyle = {marginLeft:'50px'};
        return this.props.questions.map((question, index) => (
            <div className="form-group" key={question.key}>
                <label style={textBoxStyle}>Question</label>
                <div style={textBoxStyle}>
                    <input type="text" ref={question.key} className="form-control input-sm"/>
                </div>
            </div>
        ));
    }
    
    render() {
        var userName = "User";
        var user = Meteor.user();
        if(user){
            userName = user.username;
        }
        const textBoxStyle = {marginLeft:'50px'};
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
        return (
            <div className="row main main-login" style={{padding: "20px 20px", margin: '50px'}}>           
                <div className="col-xs-12">
                    <span>
                        <a href="/Admin">Home</a>
                    </span>
                    <span className="pull-right"> Welcome {userName} <a href="javascript:void(0);" onClick={this.handleLogout}>Logout</a></span>
                </div>                
                <div className="col-xs-12">
                    <form action="#"  onSubmit={this.handleSubmit.bind(this)}>
                        <section style={sectionStyle}>
                            <h5 className="section-header">What is the position?</h5>
                            <div className="form-group">
                                <div style={textBoxStyle}>
                                    <input required type="text" ref="position" className="form-control input-sm" placeholder="Position"/>
                                </div>
                            </div>
                        </section>
                        <section style={sectionStyle}>
                            <h5 className="section-header">Interview Questions</h5>
                                <div className="form-group">
                                    <label style={textBoxStyle}>Full Name</label>
                                    <div style={textBoxStyle}>
                                        <input required type="text" className="form-control input-sm" readOnly/>
                                    </div>
                                </div>
                                {this.renderQuestionInputBoxes()}
                                <div className="form-group">
                                    <a className="pull-right" href="javascript:void(0);" onClick={this.addNewQuestion.bind(this)}>Add a question <i className="fa fa-plus-circle" aria-hidden="true"></i></a>
                                </div>
                        </section>
                        <section style={sectionStyle}>
                            <h5 className="section-header">Title & Description</h5>
                            <div className="form-group">
                                <div style={textBoxStyle}>
                                    <input required type="text" ref="taskTitle" className="form-control input-sm" placeholder="Title"/>
                                </div>
                            </div>
                            <div className="form-group">
                                <div style={textBoxStyle}>
                                    <textarea 
                                    required 
                                    rows="4"
                                    ref="taskDescription" 
                                    className="form-control input-sm" 
                                    placeholder="Description"/>
                                </div>
                            </div>
                        </section>
                        <section style={sectionStyle}>
                            <h5 className="section-header">Upload sample of work you want done</h5>
                            <div className="form-group">
                                <label style={textBoxStyle}>Title of sample</label>
                                <div style={textBoxStyle}>
                                    <input required type="text" ref="sampleTitle" className="form-control input-sm" placeholder="Title"/>
                                </div>
                            </div>
                            <div className="dropzone">
                                <Dropzone onDrop={this.onDrop.bind(this)} style={dropZonStyle} multiple={false}>
                                    <div className="text-center" style={{paddingTop: '50px'}}>
                                        <i className="fa fa-upload fa-4x" aria-hidden="true"></i>
                                        <br/><br/>
                                        <p>Drop File Here</p>
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
                        </section>
                        <section style={sectionStyle}>
                            <div className="form-group text-center">
                                <button type="submit">Create New Interview</button>
                            </div>
                        </section>
                    </form>
                </div>
            </div>
        );
    }
}
CreateInterview.defaultProps = {  
    questions : [{
        key : 'Question0'
    }],
}  

export default CreateInterview;
