import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';
import Layout from './Layout';
import QuestionCreate from './controller/QuestionCreate.js';
import QuestionList from './controller/QuestionList.js';
import { BrowserRouter as Router, Switch, Route, Link, browerHistory } from 'react-router-dom';

class Application extends React.Component {
    render() {
        return (
            <div>
                <Router history={browerHistory}>
                    <Switch>
                        <Route exact path="/question/create" component={() => <Layout><QuestionCreate/></Layout>}/>
                        <Route exact path="/question/list" component={() => <Layout><QuestionList/></Layout>}/>
                        <Route exact path="/" component={() => <Layout/>}/>
                    </Switch>
                </Router>
                <Layout/>
            </div>
        ); 
    }
}
ReactDOM.render(<Application />, document.getElementById('app'));