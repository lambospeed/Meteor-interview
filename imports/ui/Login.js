import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import classnames from 'classnames';
import { FlowRouter } from 'meteor/kadira:flow-router';


export default class Login extends Component {
    handleLogin(event) {
        event.preventDefault();
        const username = ReactDOM.findDOMNode(this.refs.username).value.trim();
        const password = ReactDOM.findDOMNode(this.refs.password).value.trim();
        Meteor.loginWithPassword(username, password, (error) => {
            if(error){
                alert("Invalid Username Or Password");
            }else{
                FlowRouter.go("Admin");
            }
        });        
    }
    render() {

        // const taskClassName = classnames({
        //     checked: this.props.task.checked,
        //     private: this.props.task.private,
        // });
    
        return (
            <div className="row main" style={{padding: "0px 50px"}}>
				<div className="main-login main-center" style={{maxWidth: "330px"}}>
					<form className="form-horizontal" method="post" action="#" onSubmit={this.handleLogin.bind(this)}>										
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
						<div className="form-group ">
							<button type="submit" className="btn btn-primary btn-lg btn-block login-button">Login</button>
						</div>
						{/* <div className="login-register">
				            <a href="/register">Register</a>
                        </div> */}
					</form>
				</div>
            </div>            
        );
    }
}