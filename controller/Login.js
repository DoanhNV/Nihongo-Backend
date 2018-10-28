import React from 'react';
import Axios from 'axios';
import ReactDOM from 'react-dom';
import { Redirect, withRouter} from 'react-router-dom';
import * as TokenUtil from '../util/TokenUtil.js';
import * as SecurityUtil from '../util/SecurityUtil.js';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName : "",
            password : ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        var name = e.target.name;
        var value = e.target.value;
        this.setState({ [name] : value});
    }

    handleSubmit(e) {
        e.preventDefault();
        this.login();
    }

    login() {
        
        if (this.isValidLoginData()) {
            var url = "http://35.240.130.216:6868/user/login";
            var query = this.prepareQueryData();
            this.postToServer(url, query);
        }
    }

    postToServer(url, query) {
        Axios.post(url, query).then(response => {
            response.data = SecurityUtil.decryptData(response.data.data);
            var SUCCESS_CODE = 1.1;
            var NOT_EXIST_USER_CODE = 2.5;
            var code = response.data.code;
            if (code == SUCCESS_CODE) {
                var isAdminUser = response.data.user.userType == 0;
                if (isAdminUser) {
                    var token = response.data.user.accessToken;
                    TokenUtil.resetCookie(token);
                    this.redirectTo("/");
                }
            } else if(code ==  NOT_EXIST_USER_CODE) {
                alert("Incorrect username or password!");
            }
        }).catch (error => {
            alert("Server Error!: " + error);
        })
    }

    prepareQueryData() {
        var LOGIN_BY_USER_NAME = 0;
        return{
            "loginAlias" : this.state.userName,
            "loginType" : LOGIN_BY_USER_NAME,
            "password" : this.state.password
        }
    }

    isValidLoginData() {
        if(this.state.userName == null || this.state.userName === ""
                || this.state.password == null || this.state.password === "") {
            return false;
        }
        return true;
    }

    redirectTo(url) {
        window.location.href = url;
    }

    render() {
        return (
            <div class="login-img3-body">
                <div class="container">
                    <form class="login-form" action="index.html" onSubmit={this.handleSubmit}>
                    <div class="login-wrap">
                        <p class="login-img"><i class="icon_lock_alt"></i></p>
                        
                        <div class="input-group">
                            <span class="input-group-addon"><i class="icon_profile"></i></span>
                            <input name="userName" onChange={this.handleChange} type="text" class="form-control" placeholder="Username" autofocus/>
                        </div>
                        <div class="input-group">
                            <span class="input-group-addon"><i class="icon_key_alt"></i></span>
                            <input name="password"  onChange={this.handleChange} type="password" class="form-control" placeholder="Password"/>
                        </div>
                        <label class="checkbox">
                                <input type="checkbox" value="remember-me"/> Remember me
                                <span class="pull-right"> <a href="#"> Forgot Password?</a></span>
                        </label>
                        <button class="btn btn-primary btn-lg btn-block" type="submit">Login</button>
                    </div>
                    </form>
                    <div class="text-right">
                        <div class="credits"></div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;
