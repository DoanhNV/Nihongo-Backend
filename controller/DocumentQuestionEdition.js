import React from 'react';
import Axios from 'axios';
import Layout from '../Layout';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Link, browerHistory } from 'react-router-dom';
import * as TokenUtil from '../util/TokenUtil.js';
import * as SecurityUtil from '../util/SecurityUtil.js';

export default class DocumentQuestionEdition extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          initData : initData,
          title : "",
          answers : [],
          subTitle: "",
          topicMode : 0,
          documentId : props.match.params.documentId,
          document : {},
          updateDQuestionId : props.match.params.questionId,
          question : {},
          answers : []
        }

        TokenUtil.redirectWhenNotExistToken(TokenUtil.getToken());
        this.initPage();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    initPage() {
      this.getParagraph();
      this.getQuestion();
    }

    getParagraph() {
      var url = "http://localhost:6868/document/get/" + this.state.documentId;
      var headerObject = {
        headers: {
          "Content-Type": "application/json",
          "access_token": TokenUtil.getToken()
        }
      }
      Axios.get(url, headerObject).then( response => {
        console.log(response.data);
        response.data = SecurityUtil.decryptData(response.data.data);
        this.state.document = response.data.document;
        var SUCCESS_CODE = 1.1;
        if (response.data.code == SUCCESS_CODE) {
          TokenUtil.resetCookie(TokenUtil.getToken());
        }
        this.forceUpdate();
      }).catch (error => {
        alert("Server Error :" + error);
        TokenUtil.deleteCookie();
        TokenUtil.redirectTo("/login");
      });
    }

    getQuestion() {
        var url = "http://localhost:6868/mvcquestion/detail/" + this.state.updateDQuestionId;
        var headerObject = {
          headers: {
            "Content-Type": "application/json",
            "access_token": TokenUtil.getToken()
          }
        }
        Axios.get(url, headerObject).then( response => {
          console.log(response.data);
          response.data = SecurityUtil.decryptData(response.data.data);
          this.state.question = response.data.question;
          this.state.answers = this.state.question.answers;
          this.state.subTitle = this.state.question.titleSub;
          
          var SUCCESS_CODE = 1.1;
          if (response.data.code == SUCCESS_CODE) {
            TokenUtil.resetCookie(TokenUtil.getToken());
          }
          this.forceUpdate();
          var title = this.state.question.title;
          CKEDITOR.on('instanceReady', function() {
            $("#editor").append(title); 
         });
        }).catch (error => {
          alert("Server Error :" + error);
          TokenUtil.deleteCookie();
          TokenUtil.redirectTo("/login");
        });
      }

    handleChange(e) {
      var name = e.target.name;
      var value = e.target.value;
      if(e.target.type === "select-one") {
        this.state.topicMode = e.target.value;
      }
      this.setState({ [name] : value});
    }

    async handleSubmit(e) {
      var formData = this.getFormData();
      var updateQuestionURL = "http://localhost:6868/mvcquestion/update";
      var headerObject = {
        headers: {
          "Content-Type": "application/json",
          "access_token": TokenUtil.getToken()
        }
      }

      if(this.isValidData(formData)) {
        var data  = this.preparePostData(formData);
        Axios.put(updateQuestionURL, data, headerObject).then (
          res => {
            res.data = SecurityUtil.decryptData(res.data.data);
            var SUCCESS_CODE = 1.1;
            var alertMessage = "";

            if (res.data.code == SUCCESS_CODE) {
                alertMessage = "Update success!";
                TokenUtil.resetCookie(TokenUtil.getToken());
            } else {
                alertMessage = "Update fail!";
            }

            alert(alertMessage);
        }).catch(error => {
            alert("Server Error!: " + error);
            TokenUtil.deleteCookie();
            TokenUtil.redirectTo("/login");
        });
      }
      e.preventDefault();
    }

    preparePostData(formData) {
      return {
        id : this.state.updateDQuestionId,
        title : formData.htmlTitle,
        topic : this.state.document.topic,
        level : this.state.document.level,
        answers: formData.answers,
        titleSub : this.state.subTitle,
      }
    }

    prepareUpdateData(questionId) {
      var questionIds = this.state.document.questionIds;
      questionIds.push(questionId);
      return {
        id: this.state.document.id,
        content : this.state.document.content,
        topic : this.state.document.topic,
        level : this.state.document.level,
        questionIds : questionIds,
      }
    }

    async uploadFileToServer(url, data) {
      return await Axios.post(url, data);
    }

    clearData() {
      ReactDOM.findDOMNode(document.getElementById("editor")).innerHTML = "";
      var contents = document.querySelectorAll("#answers");
      for(var i = 0; i < contents.length; i++) {
        contents[i].value = "";
      }
      $("#subTitleID").val("");
    }


    getFormData() {
      var htmlTitle = "";
      htmlTitle += ReactDOM.findDOMNode(document.getElementById("editor")).innerHTML;
      var isCorrectValues = document.querySelectorAll(".isCorrects");
      var contents = document.querySelectorAll("#answers");
      var answers = [];
      var domContent = $.parseHTML(htmlTitle);
      var innerText = domContent != null ? domContent[0].innerText : "";
      htmlTitle = this.isHTML(innerText) ? innerText : htmlTitle;
      htmlTitle = this.state.topicMode == 7 ? htmlTitle.replace(/<p>/g, "").replace(/<[/]p>/g, "") : htmlTitle;
      htmlTitle = htmlTitle.replace(/"/g, "'");
      
      for(var i = 0; i < isCorrectValues.length; i++) {
        if(contents[i].value === "") {
          answers = [];
          break;
        }
        var answer = {isCorrect : isCorrectValues[i].checked, content : contents[i].value};
        answers.push(answer);
      }

      
      return {
        htmlTitle : htmlTitle,
        isCorrectValues : isCorrectValues,
        contents : contents,
        answers : answers
      }
    }

    isHTML(str) {
      var a = document.createElement('div');
      a.innerHTML = str;
    
      for (var c = a.childNodes, i = c.length; i--; ) {
        if (c[i].nodeType == 1) return true; 
      }
    
      return false;
    }

    isValidData(formData) {
      if(formData.htmlTitle === "" || formData.htmlTitle === "<p><br></p>" || formData.answers.length == 0) {
        alert("please input correct data!");
        return false;
      }
      
      var correctValueNumber = 0;
      var isCorrectValues = formData.isCorrectValues;
      for(var i = 0; i < isCorrectValues.length; i++) {
        correctValueNumber += isCorrectValues[i].checked == true ? 1 : 0; 
      }

      if(correctValueNumber == 0) {
        alert("Question need at least 1 correct answer!");
        return false;
      }
      return true;
    }

    render() {
        return (
        <Layout>
         <div class="row">
            <div class="col-lg-12">
                <div class="profile-widget profile-widget-info">
                    <div class="panel-body">
                        <div class="col-lg-8 col-sm-8 follow-info">
                            <p ><div class="color-white" dangerouslySetInnerHTML={{__html: this.state.document.content}}></div></p>
                        </div>
                        <div class="col-lg-2 col-sm-6 follow-info weather-category">
                            <ul>
                                <li class="active info-display">
                                    <i class="fa fa-bell fa-2x"></i> <br/> 
                                    {
                                      this.state.initData.defaultLevel.map((level) => {
                                        if(level.value == this.state.document.level) {
                                          return (level.name);
                                        }
                                      })
                                    }
                                </li>
                            </ul>
                        </div>
                        <div class="col-lg-2 col-sm-6 follow-info weather-category">
                            <ul>
                                <li class="active info-display">
                                    <i class="fa fa-tachometer fa-2x"></i> <br/>
                                    {
                                      this.state.initData.defaultTopic.map((topic) => {
                                        if(topic.value == this.state.document.topic) {
                                          return (topic.name);
                                        }
                                      })
                                    }
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row">
          <div class="col-lg-12">
            <section class="panel">
              {/* Header title */}
              <header class="panel-heading">
                Update
              </header>
              <div class="panel-body">
                <div class="form">
                  <form class="form-validate form-horizontal " id="register_form" onSubmit={this.handleSubmit}>
                  <div class="col-lg-12">
                    <section class="panel">
                      <header class="panel-heading">
                        Question
                      </header>
                      <div class="panel-body">
                        <div id="editor" class="btn-toolbar" data-role="editor-toolbar" data-target="#editor"></div>
                      </div>
                    </section>
                    </div>
                    {/* Sub title */}
                    <div id="subTitleDiv" class="form-group">
                        <label class="control-label col-lg-1" for="exampleInputFile">Sub for Question</label>
                        <div class="col-lg-10">
                          <input type="text" defaultValue={this.state.question.titleSub} id="subTitleID" name="subTitle" class="form-control" onChange={this.handleChange} placeholder="placeholder" />
                        </div>
                    </div>
                    {/* Answers */}
                    <div class="form-group">
                      <label class="control-label col-lg-1" for="inputSuccess"><b>Answer</b></label>
                      <div class="col-lg-10">
                        {
                          this.state.answers.map((answer, i) => {
                            return (
                                  <div class="radio">
                                    <label>
                                      <input type="radio" defaultChecked={answer.isCorrect} name="correctvalues"  class="isCorrects"/>
                                      <input type="text" defaultValue={answer.content} class=" form-control" id="answers" name="answers"/>
                                    </label>
                                  </div>
                              );
                          })
                        }
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-lg-offset-2 col-lg-10">
                        <button class="btn btn-primary" type="submit">Save</button>
                        <button class="btn btn-default" type="button">Cancel</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </section>
          </div>
        </div>
        </Layout>
        );
    }
}

const initData = {
  defaultAnswerNumber : 4,
  defaultTopic : [
    {name : "Reading - Understanding Paragraph", value : 10},
    {name : "Fill according to stream Paragraph", value : 11}
  ],
  defaultLevel : [
    {name : "Beginer", value : 0},
    {name : "N1", value : 1},
    {name : "N2", value : 2},
    {name : "N3", value : 3},
    {name : "N4", value : 4},
    {name : "N5", value : 5}
  ]
}

