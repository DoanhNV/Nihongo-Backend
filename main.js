import React from 'react';
import { render } from 'react-dom';
import App from './App.jsx';
import Layout from './Layout';
import Home from './Home.js';
import Error404 from './Error404';
import QuestionCreate from './controller/QuestionCreate.js';
import QuestionList from './controller/QuestionList.js';
import DocumentCreate from './controller/DocumentCreate.js';
import DocumentQuestionCreate from './controller/DocumentQuestionCreate.js';
import { BrowserRouter as Router, Switch, Route, Link, browserHistory } from 'react-router-dom';

class Application extends React.Component {
    render() {
        return (
            <div>
                <Router history={browserHistory}>
                    <Switch>
                        <Route exact path="/" component={() => <Layout><Home/></Layout>}/>
                        {/* Question */}
                        <Route exact path="/question/create" component={() => <Layout><QuestionCreate/></Layout>}/>
                        <Route exact path="/question/list" component={() => <Layout><QuestionList/></Layout>}/>
                        {/* Document */}
                        <Route exact path="/document/create" component={() => <Layout><DocumentCreate/></Layout>}/>
                        <Route exact path="/document/insertquestion/:documentId?" component={() => <Layout><DocumentQuestionCreate/></Layout>}/>
                        <Route component={Error404} />
                    </Switch>
                </Router>
            </div>
        ); 
    }
}
render(<Application />, document.getElementById('app'));