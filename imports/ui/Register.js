import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { FlowRouter } from 'meteor/kadira:flow-router';


// Task component - represents a single todo item
export default class Regiser extends Component {
    handleRegister(event) {
        event.preventDefault();
        const username = ReactDOM.findDOMNode(this.refs.username).value.trim();
        const password = ReactDOM.findDOMNode(this.refs.password).value.trim();
        const confirmPassword = ReactDOM.findDOMNode(this.refs.confirmPassword).value.trim();
        if(password !== confirmPassword){
            alert("password and confirm password do not match");
            return;
        }
        Accounts.createUser({
            username: username,
            password: password,
        }, (error) => {
            if(error){
                console.log(error);
            }else{
                FlowRouter.go('Admin');
            }
        });        
    }
    render() {
        // Give tasks a different className when they are checked off,
        // so that we can style them nicely in CSS
        // const taskClassName = classnames({
        //     checked: this.props.task.checked,
        //     private: this.props.task.private,
        // });
    
        return (
            <div className="row main" style={{padding: "0px 50px"}}>
				<div className="main-login main-center"  style={{maxWidth: "330px"}}>
					<form className="form-horizontal" method="post" action="#" onSubmit={this.handleRegister.bind(this)}>										
						<div className="form-group">
							<label htmlFor="username" className="cols-sm-2 control-label">Username</label>
							<div className="cols-sm-10">
								<div className="input-group">
									<span className="input-group-addon"><i className="fa fa-users fa" aria-hidden="true"></i></span>
									<input required type="text" className="form-control" ref="username" placeholder="Enter your Username"/>
								</div>
							</div>
						</div>

						<div className="form-group">
							<label htmlFor="password" className="cols-sm-2 control-label">Password</label>
							<div className="cols-sm-10">
								<div className="input-group">
									<span className="input-group-addon"><i className="fa fa-lock fa-lg" aria-hidden="true"></i></span>
									<input required type="password" className="form-control" ref="password" placeholder="Enter your Password"/>
								</div>
							</div>
						</div>

						<div className="form-group">
							<label htmlFor="confirm" className="cols-sm-2 control-label">Confirm Password</label>
							<div className="cols-sm-10">
								<div className="input-group">
									<span className="input-group-addon"><i className="fa fa-lock fa-lg" aria-hidden="true"></i></span>
									<input required type="password" className="form-control" ref="confirmPassword"  placeholder="Confirm your Password"/>
								</div>
							</div>
						</div>

						<div className="form-group ">
							<button type="submit" className="btn btn-primary btn-lg btn-block login-button">Register</button>
						</div>
						<div className="login-register">
				            <a href="/login">Login</a>
                        </div>
					</form>
				</div>
            </div>  
        );
    }
}