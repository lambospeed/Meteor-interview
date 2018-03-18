import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import '../imports/startup/client/accounts-config.js';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount , withOptions} from 'react-mounter';

import Admin from '../imports/ui/Admin.js';
import Home from '../imports/ui/Home.js';
import Login from '../imports/ui/Login.js';
import Register from '../imports/ui/Register.js';
import CreateInterview from '../imports/ui/CreateInterview.js';
import Description from '../imports/ui/Description.js';
import SubmitWork from '../imports/ui/SubmitWork.js';


FlowRouter.animationDuration = 100;
privateRoute = FlowRouter.group({
  triggersEnter:  [checkLoggedIn]
});
publicRoute = FlowRouter.group({});

const MainLayout = ({content}) => (
  <div className="row main" style={{padding: "0px 50px"}}>
      {content}
  </div>
);

publicRoute.route('/', {
  name: 'Home',
  action:  function(params, queryParams) {
    mount(Home, {});
  }
});
publicRoute.route('/description/:interviewid/:submissionid', {
  name: 'Description',
  action:  function(params, queryParams) {
    mount(Description, {interviewid : params.interviewid, submissionid:params.submissionid});
  }
});
publicRoute.route('/submitwork/:interviewid/:submissionid', {
  name: 'SubmitWork',
  action:  function(params, queryParams) {
    mount(SubmitWork, {interviewid : params.interviewid, submissionid:params.submissionid});
  }
});
privateRoute.route('/admin', {
  name: 'Admin',
  action:  function(params, queryParams) {
    mount(Admin, {});
  }
});
privateRoute.route('/login', {
  name: 'Login',
  action: function(params, queryParams){
    mount(Login, {})
  }
});
// privateRoute.route('/register', {
//   name: 'Register',
//   action: function(params, queryParams){
//     mount(Register, {})
//   }
// });
privateRoute.route('/create-interview', {
  name: 'CreateInterview',
  action: function(params, queryParams){
    mount(CreateInterview, {})
  }
});

function checkLoggedIn(){
  var routeName = FlowRouter.current().route.name; 
  if(!Meteor.userId()){  	
  	if (routeName !== "Login" && routeName !== "Register"){
      FlowRouter.go("Login");
  	}  	
  }else if (routeName === "Login" || routeName === "Register"){
    FlowRouter.go("Admin");      
  }
};