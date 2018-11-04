import React from 'react';
import Axios from 'axios';
import ReactDOM from 'react-dom';
import Layout from '../Layout';
import * as TokenUtil from '../util/TokenUtil.js';
import * as SecurityUtil from '../util/SecurityUtil.js';

export default class QuestionEdition extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          initData : initData,
          title : "",
          answers : [],
          topic : 0,
          level : 0,
          subTitle: "",
          documentFileName : "",
          topicMode : 0,
          textAudioQuestion : "",
          updateQuestionId : props.match.params.questionId,
          question : {},
          initAnswer : [],
          initAudioDocument : "",
          initImageDocument : ""
        }

        TokenUtil.redirectWhenNotExistToken(TokenUtil.getToken());
        this.initPage();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleUploadImage = this.handleUploadImage.bind(this);
        this.handleTextAudioQuestionChange = this.handleTextAudioQuestionChange.bind(this);
    }

    initPage() {
      var url = "http://localhost:6868/mvcquestion/detail/" + this.state.updateQuestionId;
      var headerObject = {
        headers: {
          "Content-Type": "application/json",
          "access_token": TokenUtil.getToken()
        }
      }
      
      Axios.get(url, headerObject).then( response => {
        response.data = SecurityUtil.decryptData(response.data.data);
        console.log("response.data: " + response.data);
        var SUCCESS_CODE = 1.1;
        if (response.data.code == SUCCESS_CODE) {
          TokenUtil.resetCookie(TokenUtil.getToken());
          this.state.question = response.data.question;
          this.state.initAnswer = response.data.question.answers;
          this.state.topicMode = response.data.question.topic;
          var htmlTitle = this.state.question.title;

          if(this.state.question.document.endsWith(".png")) {
            var uploadFileURL = "http://localhost:6868/file/load/base64";
            var documentFile = { filePath : this.state.question.document};

            var headerObject = {
              headers: {
                "Content-Type": "application/json",
                "access_token": TokenUtil.getToken()
              }
            }

            Axios.post(uploadFileURL, documentFile, headerObject).then ( res => {
              res.data = SecurityUtil.decryptData(res.data.data);
              var SUCCESS_CODE = 1.1;
              if (res.data.code == SUCCESS_CODE) {
                TokenUtil.resetCookie(TokenUtil.getToken());
              }

              $("#previewImage").attr("src",res.data.base64Str);
              var imgaeTag = document.getElementById("previewImage");
              imgaeTag.className = "show";
            }).catch(error => {
                alert("Server Error!: " + error);
                TokenUtil.deleteCookie();
                TokenUtil.redirectTo("/login");
            });
          } else {
            this.state.initAudioDocument = this.state.question.document;
          }
          this.forceUpdate();
          CKEDITOR.on('instanceReady', function() {
             $("#editor").append(htmlTitle); 
          });
        }
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

    handleTextAudioQuestionChange(e) {
      this.clearImageField();
    }

    clearImageField() {
      $("#base64").val("");
      var imgaeTag = document.getElementById("previewImage");
      imgaeTag.src = "";
      imgaeTag.className = "hide";
      $("#documentImage").val("");
    }

     async handleSubmit(e) {
      
      var formData = this.getFormData();
      
      var uploadFileURL = "http://localhost:6868/file/upload/base64";
      var updateQuestionURL = "http://localhost:6868/mvcquestion/update";
      var base64Data =  $("#base64").val();
      if(this.isValidData(formData)) {
        var uploadData = this.prepareUploadImageData();

        console.log(" this.state.topicMode == 7 && base64Data != :" +  (this.state.topicMode == 7 && base64Data != ""));
        console.log("uploadData: " + JSON.stringify(uploadData));
        if( this.state.topicMode == 7 && base64Data != "") {
          var headerObject = {
            headers: {
              "Content-Type": "application/json",
              "access_token": TokenUtil.getToken()
            }
          }
          Axios.post(uploadFileURL, uploadData, headerObject).then(res => {
            alert("Done upload");
            res.data = SecurityUtil.decryptData(res.data.data);
            console.log("uploadFile: " +  res.data.code);
            var data  = this.preparePostData(formData, res.data.filePath);
            console.log(data);

            Axios.put(updateQuestionURL, data, headerObject).then (
                res => {
                res.data = SecurityUtil.decryptData(res.data.data);
                var alertStr = res.data.code == 1.1 ? "Update success!" : "Update Fail!";
                alert(alertStr);
                var SUCCESS_CODE = 1.1;
                if (res.data.code == SUCCESS_CODE) {
                  TokenUtil.resetCookie(TokenUtil.getToken());
                }
                this.clearData();
            }).catch(error => {
                alert("Server Error!: " + error);
                TokenUtil.deleteCookie();
                TokenUtil.redirectTo("/login");
            });
          }).catch(error => {
            alert("Server Error!");
            TokenUtil.deleteCookie();
            TokenUtil.redirectTo("/login");
          });
        } else if (this.state.topicMode == 7 && base64Data === "" && this.state.textAudioQuestion === "") {
          var data  = this.preparePostData(formData, this.state.question.document);
          console.log(data);
          this.postToServer(updateQuestionURL, data);
        } else {
          var data  = this.preparePostData(formData, this.state.textAudioQuestion);
          console.log(data);
          this.postToServer(updateQuestionURL, data);
        }
      }
      e.preventDefault();
    }

    prepareUploadImageData() {
      return {
        base64Stream : $("#base64").val().split(",")[1],
        fileName : this.state.documentFileName,
        fileType : this.state.initData.UPLOAD_IMAGE_TYPE
      }
    }

    preparePostData(formData, documentData) {
      return {
        id : this.state.question.id,
        title : formData.htmlTitle,
        topic : this.state.topicMode,
        level : this.state.level,
        answers: formData.answers,
        titleSub : this.state.subTitle,
        document : documentData
      }
    }

    postToServer(url, data) {
      var headerObject = {
        headers: {
          "Content-Type": "application/json",
          "access_token": TokenUtil.getToken()
        }
      }
      Axios.put(url, data, headerObject).then (
          res => {
          res.data = SecurityUtil.decryptData(res.data.data);
          var alertStr = res.data.code == 1.1 ? "Insert success!" : "Insert Fail!";
          alert(alertStr);
          var SUCCESS_CODE = 1.1;
          if (res.data.code == SUCCESS_CODE) {
            TokenUtil.resetCookie(TokenUtil.getToken());
          }
          this.clearData();
      }).catch(error => {
          alert("Server Error!: " + error);
          TokenUtil.deleteCookie();
          TokenUtil.redirectTo("/login");
      });
    }

    async uploadFileToServer(url, data) {
      var headerObject = {
        headers: {
          "Content-Type": "application/json",
          "access_token": TokenUtil.getToken()
        }
      }
      return await Axios.post(url, data, headerObject);
    }

    clearData() {
      ReactDOM.findDOMNode(document.getElementById("editor")).innerHTML = "";
      var contents = document.querySelectorAll("#answers");
      for(var i = 0; i < contents.length; i++) {
        contents[i].value = "";
      }
      $("#subTitleID").val("");
      $("#textAudioQ").val("");
      $("#documentImage").val("");
      this.clearImageField();
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

      for(var i = 0; i < isCorrectValues.length; i++) {
        if(contents[i].value === "") {
          answers = [];
          break;
        }
        var answer = {isCorrect : isCorrectValues[i].checked, content : contents[i].value};
        answers.push(answer);
      }

      
      return {
        htmlTitle : htmlTitle.replace(/"/g, "'"),
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

    handleUploadImage() {
      var fileList = $("#documentImage")[0].files;
      if (fileList && fileList[0]) {
        var fileReader = new FileReader();
        fileReader.addEventListener("load", function(e) {
          var imgaeTag = document.getElementById("previewImage");
          imgaeTag.src = e.target.result;
          imgaeTag.className = "show";
          $("#base64").val(e.target.result);
          $("#textAudioQ").val("");
        }); 
        fileReader.readAsDataURL(fileList[0]);
        this.state.documentFileName = fileList[0].name;
      }
    }
    

    render() {
        return (
        <Layout>
        <div class="row">
          <div class="col-lg-12">
            <section class="panel">
              {/* Header title */}
              <header class="panel-heading">
                Create
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
                        <div id="editor" class="btn-toolbar" data-role="editor-toolbar" data-target="#editor">
                          
                        </div>
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
                    {/* Text audio */}
                    <div id="subTitleDiv" class="form-group">
                        <label class="control-label col-lg-1" for="exampleInputFile">Text audio question</label>
                        <div class="col-lg-10">
                          <input type="text" defaultValue={this.state.initAudioDocument} id="textAudioQ" name="textAudioQuestion" class="form-control" onChange={e => {this.handleTextAudioQuestionChange(e); this.handleChange(e)}} placeholder="placeholder" />
                        </div>
                    </div>
                    {/* Upload image  document */}
                    <div id="uploadImageDiv" class="form-group">
                        <label class="control-label col-lg-1" for="exampleInputFile">Image audio question</label>
                        <div class="col-lg-10">
                          <input type="file" id="documentImage" onChange={this.handleUploadImage} accept="image/*"/>
                          <br/>
                          <img id="previewImage" height="150" class="hide"/>
                        </div>
                        <input type="hidden" id="base64"/>
                    </div>
                    {/* Answers */}
                    <div class="form-group">
                      <label class="control-label col-lg-1" for="inputSuccess"><b>Answer</b></label>
                      <div class="col-lg-10">
                        {
                          
                          this.state.initAnswer.map((anwser) => {
                            return (
                                  <div class="radio">
                                    <label>
                                      <input type="radio" defaultChecked={anwser.isCorrect} name="correctvalues"  class="isCorrects"/>
                                      <input type="text"  defaultValue={anwser.content} class=" form-control" id="answers" name="answers" />
                                    </label>
                                  </div>
                              );
                          })
                        }
                      </div>
                    </div>
                    {/* Topic */}
                    <div class="form-group">
                      <label class="control-label col-lg-1" for="inputSuccess"><b>Topic</b></label>
                      <div class="col-lg-4">
                        <select name="topic" class="form-control m-bot15" onChange={this.handleChange}>
                            {this.state.initData.defaultTopic.map((topic) => {
                              if (topic.value == this.state.question.topic) {
                                return <option value={topic.value} selected>{topic.name}</option>
                              } else {
                                return <option value={topic.value}>{topic.name}</option>
                              }
                            })}
                            {this.initData}
                        </select>
                      </div>
                    </div>

                    {/* Level */}
                    <div class="form-group">
                      <label class="control-label col-lg-1" for="inputSuccess"><b>Level</b></label>
                      <div class="col-lg-4">
                        <select name="level" class="form-control m-bot15" onChange={this.handleChange}>
                            {this.state.initData.defaultLevel.map((level) => {
                              if (level.value == this.state.question.level) {
                               return <option value={level.value} selected>{level.name}</option>
                              } else {
                                return <option value={level.value}>{level.name}</option>
                              }
                            })}
                        </select>
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
    {name : "Hiragana to Kanji", value : 0},
    {name : "Kanji to Hiragana", value : 1},
    {name : "Fill into braces 1", value : 2},
    {name : "Synonym", value : 3},
    {name : "Fill into braces 2", value : 4},
    {name : "Replace star", value : 5},
    {name : "Listen and answer", value : 7},
    {name : "Fill into braces 3", value : 8},
    {name : "Wording", value : 9}
  ],
  defaultLevel : [
    {name : "Beginer", value : 0},
    {name : "N1", value : 1},
    {name : "N2", value : 2},
    {name : "N3", value : 3},
    {name : "N4", value : 4},
    {name : "N5", value : 5}
  ],
  UPLOAD_IMAGE_TYPE : 0
}

