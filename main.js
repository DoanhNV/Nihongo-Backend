import React from 'react';
import { render } from 'react-dom';
import App from './App.jsx';
import Layout from './Layout';
import Home from './Home.js';
import Error404 from './Error404';
import ExamList from './controller/ExamList.js';
import ExamCreate from './controller/ExamCreate.js';
import QuestionList from './controller/QuestionList.js';
import DocumentList from './controller/DocumentList.js';
import QuestionCreate from './controller/QuestionCreate.js';
import DocumentCreate from './controller/DocumentCreate.js';
import DocumentDetail from './controller/DocumentDetail.js';
import ExamSettingNumber from './controller/ExamSettingNumber.js';
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
                        <Route exact path="/question/list" component={() => <Layout><QuestionList/></Layout>}/>
                        <Route exact path="/question/create" component={() => <Layout><QuestionCreate/></Layout>}/>
                        {/* Document */}
                        <Route exact path="/document/create" component={() => <Layout><DocumentCreate/></Layout>}/>
                        <Route exact path="/document/:documentId?/insertquestion" component={DocumentQuestionCreate}/>
                        <Route exact path="/document/list" component={() => <Layout><DocumentList/></Layout>}/>
                        <Route exact path="/document/:documentId?" component={DocumentDetail}/>
                        {/* Setting */}
                        <Route exact path="/setting/exam/number" component={() => <Layout><ExamSettingNumber/></Layout>}/>
                        {/* Exam */}
                        <Route exact path="/exam/create" component={() => <Layout><ExamCreate/></Layout>}/>
                        <Route exact path="/exam/list" component={() => <Layout><ExamList/></Layout>}/>
                        <Route component={Error404} />
                    </Switch>
                </Router>
            </div>
        ); 
    }
}
render(<Application />, document.getElementById('app'));