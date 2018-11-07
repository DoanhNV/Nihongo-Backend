import React from 'react';
import Axios from 'axios';
import Layout from '../Layout';
import * as TokenUtil from '../util/TokenUtil.js';
import * as SecurityUtil from '../util/SecurityUtil.js';

export default class ExamDetail extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        initData : initData,
        examId : props.match.params.examId,
        topic : -1,
        level : -1,
        skip : 0,
        take : initData.TAKE_NUMBER,
        fieldName : "_id",
        order : -1,
        exam : {},
        contents: [],
        total : 0,
        currentPage : 1,
        postPerPage : initData.TAKE_NUMBER,
        isTrial : null,
        isFree : null,
        currentIndex : 0
      }

      TokenUtil.redirectWhenNotExistToken(TokenUtil.getToken());
      this.initPage();
      this.handleChange = this.handleChange.bind(this);
      this.handleAction = this.handleAction.bind(this);
      this.handleUpdate = this.handleUpdate.bind(this);
    }

    handleChange(e) {
      var name = e.target.name;
      var value = e.target.value;
      this.setState({ [name] : value});
    }

    initPage() {
      this.getDetailExam();
    }

    getDetailExam() {
      var examId =  this.state.examId;
      var backendMode = 0;
      var url = "http://nihongojp.com:6868/exam/detail/" + examId  + "/" + backendMode;
      this.getServerQuestion(url);
    }

    getServerQuestion(url) {
        var headerObject = {
            headers: {
              "Content-Type": "application/json",
              "access_token": TokenUtil.getToken()
            }
        }
        Axios.get(url, headerObject).then (
            response => {
            //response.data = SecurityUtil.decryptData(response.data.data);
            var SUCCESS_CODE = 1.1;
            if(response.data.code == SUCCESS_CODE) {
                this.state.exam = response.data.exam;
                this.state.total = response.data.total;
                this.state.contents = response.data.exam.contents;
                this.forceUpdate();
                TokenUtil.resetCookie(TokenUtil.getToken());
            }
        }).catch(error => {
          alert("Server Error!: " + error);
          TokenUtil.deleteCookie();
          TokenUtil.redirectTo("/login");
        });
    }

    handleAction(e) {
      var type = Number(e.target.dataset.type);
      switch(type) {
        default:
        this.detail(e);
      }
    }

    handleUpdate(e) {
        var examId = this.state.examId;
        var field = e.target.dataset.field;
        var value = field === "point" ?  $("#txtPoint").val() 
                        : field === "completedMinutes" ?  $("#txtCompletedMinutes").val() 
                            : e.target.dataset.value == 'true' ? 'false' : 'true';
        var css = Number(e.target.dataset.cssdata);
        var url = "http://nihongojp.com:6868/exam/update/" + examId;
        var headerObject = {
            headers: {
              "Content-Type": "application/json",
              "access_token": TokenUtil.getToken()
            }
        }
        var updateData = this.prepareUpdateData(field, value);
        var isInputField = field === "point" || field === "completedMinutes";
        if(isInputField) {
            var previousData = e.target.dataset.previous;
            if(previousData === value) {
                return;
            }
        }
        Axios.put(url, updateData, headerObject).then((response) => {  
            //response.data = SecurityUtil.decryptData(response.data.data);
            console.log(response.data);
            var code = response.data.code;
            var SUCCESS_CODE = 1.1;
            if (code == SUCCESS_CODE) {
                TokenUtil.resetCookie(TokenUtil.getToken());
                if(field === "point" ) {
                    $("#txtPoint").val(value);
                    $("#txtPoint").attr("data-previous", value);
                    return;
                } else if(field === "completedMinutes") {
                    $("#txtCompletedMinutes").val(value);
                    $("#txtCompletedMinutes").attr("data-previous", value);
                    return;
                }

                var css0 = "color-green background-color-yellow width-80px ";
                var css1 = "color-yellow background-color-green width-80px ";

                var prefix = "isFree";
                if(field === "isTrial") {
                    prefix = "isTrial";
                } else if (field === "isActive") {
                    prefix = "isActive";
                } 

                var style = css1;
                if(css == 1) {
                    var style = css0 + prefix + "-" + examId;
                }
                var cssId = "#" + prefix + "-" + examId;
                $(cssId).attr('class',style);
                css = css == 0 ? 1 : 0;
                $(cssId).attr('data-cssdata',css); 
                $(cssId).attr('data-value',value);
                $(cssId).data('value',value);
                var buttonText = $(cssId).text();
                buttonText = this.getChangeButtonText(field,buttonText);
                $(cssId).text(buttonText);
            } else {
                alert("Update fail!");
            }
        }).catch(error => {
            alert("Server error " + error);
            TokenUtil.deleteCookie();
            TokenUtil.redirectTo("/login");
        });
    }

    prepareUpdateData(field, value) {
        var updateData = {};
        switch(field) {
            case "isFree":
                updateData = {isFree : value};
                break;
            case "isTrial":
                updateData = {isTrial : value};
                break;
            case "isActive":
                updateData = {isActive : value};
                break;
            case "point":
                updateData = {point : value};
                break;
            case "completedMinutes":
                updateData = {completedMinutes : value};
                break;
        }
        return updateData;
    }

    getChangeButtonText(field, buttonText) {
        switch(field) {
            case "isFree":
                buttonText = buttonText === "Free" ? "Money" : "Free";
                break;
            case "isTrial":
                buttonText = buttonText === "Trial" ? "Not trial" : "Trial";
                break;
            case "isActive":
                buttonText = buttonText === "Active" ? "Disable" : "Active";
                break;
        }
        return buttonText;
    }

    detail(e) {
      var documentId = e.target.dataset.id;
      this.redirectTo("/document/" + documentId);
    }

    redirectTo(url) {
      window.location.href = url;
    }

    displayParagraph(examTopic) {
        var content = examTopic.content;
        var empty = "";
        if(content == null) {
            return empty;
        }
        return <div class="bio-graph-heading question-title margin-bottom-10px"> <div dangerouslySetInnerHTML={{__html : content}} /></div>
    }
    
    render() {
        return (
        <Layout>
            <div class="row">
            </div>
              <div class="row">
              {/* Search query */}
              <div class="col-lg-12">
                  {/* item */}
                  <div class="panel-body panel-body-nihongo">
                          <div>
                                <div class="tab-content">
                                    <div id="recent-activity">
                                        <div id="profile" class="tab-pane">
                                            <section class="panel">
                                                <div class="bio-graph-heading question-title">
                                                    <div>
                                                        {this.state.exam.id} 
                                                        <span class="color-red"> - Level: </span> 
                                                        {
                                                            this.state.initData.defaultLevel.map((level) => {
                                                                if(this.state.exam.level == level.value) {
                                                                    return (level.name);
                                                                }
                                                            })
                                                        }
                                                        <span class="color-red"> - </span> 
                                                        <button id={"isFree-" + this.state.exam.id} class={this.state.exam.isFree == true ? 
                                                                        "color-green background-color-yellow width-80px " 
                                                                            : "color-yellow background-color-green width-80px isFree-"}
                                                                data-id={this.state.exam.id} data-value={this.state.exam.isFree} data-field="isFree" data-cssdata={this.state.exam.isFree == true ? 0 : 1}
                                                                onClick={this.handleUpdate}
                                                        >
                                                            {this.state.exam.isFree == true ? "Free" : "Money"}
                                                        </button>
                                                        <button id={"isTrial-" + this.state.exam.id} class={this.state.exam.isTrial == true ? 
                                                                        "color-green background-color-yellow width-80px isTrial-" + this.state.exam.id
                                                                            : "color-yellow background-color-green width-80px isTrial-" + this.state.exam.id}
                                                                data-id={this.state.exam.id} data-value={this.state.exam.isTrial} data-field="isTrial" data-cssdata={this.state.exam.isTrial == true ? 0 : 1}
                                                                onClick={this.handleUpdate}
                                                        >
                                                            {this.state.exam.isTrial == true ? "Trial" : "Not trial"}
                                                        </button>

                                                        <button id={"isActive-" + this.state.exam.id} class={this.state.exam.isActive == true ? 
                                                                    "color-yellow background-color-green width-80px isActive-" + this.state.exam.id:
                                                                         "color-green background-color-yellow width-80px isActive-" + this.state.exam.id}
                                                                data-id={this.state.exam.id} data-value={this.state.exam.isActive} data-field="isActive" data-cssdata={this.state.exam.isActive == true ? 1 : 0}
                                                                onClick={this.handleUpdate}
                                                        >
                                                            {this.state.exam.isActive == true ? "Active" : "Disable"}
                                                        </button>
                                                        <span>                                      </span>
                                                    </div>
                                                </div>
                                                <div class="panel-body bio-graph-info">
                                                    <div class="row">
                                                        <div class="col-lg-12 row">
                                                            <div class="col-lg-6">
                                                                <p class="small-font">
                                                                    <span>Point</span>: <span class="color-blue">
                                                                        <input type="number" min="0" id="txtPoint" data-field="point" data-previous={this.state.exam.point} defaultValue={this.state.exam.point} 
                                                                            onBlur={this.handleUpdate}
                                                                        />
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            <div class="col-lg-6">
                                                                <p class="small-font"><span>like</span>: <span class="color-blue">{this.state.exam.likeNumber}</span></p>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-12 row">
                                                            <div class="col-lg-6">
                                                                <p class="small-font">
                                                                    <span>Time (minutes)</span>: <span class="color-blue">
                                                                        <input type="number" min="0" id="txtCompletedMinutes" data-field="completedMinutes" data-previous={this.state.exam.completedMinutes} defaultValue={this.state.exam.completedMinutes} 
                                                                            onBlur={this.handleUpdate}
                                                                        />
                                                                    </span>
                                                                </p>
                                                            </div>
                                                            <div class="col-lg-6">
                                                                <p class="small-font"><span>Taked number</span>: <span class="color-blue">{this.state.exam.takedNumber}</span></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-lg-12 row">
                                                            <div class="col-lg-6">
                                                                <p><span>Create Time: { new Date(this.state.exam.createTime).toLocaleString()}</span></p>
                                                            </div>
                                                            <div class="col-lg-6">
                                                                <p><span>Update Time: { new Date(this.state.exam.updateTime).toLocaleString()}</span></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {this.state.contents.map((examTopic, cotentIndex) => {
                                return (
                                    <section class="panel">
                                <div class="bio-graph-heading question-title">
                                    <div>
                                    {   
                                        this.state.initData.defaultTopic.map((topic) => {
                                            if(topic.value == examTopic.topic) {
                                                var order = cotentIndex + 1;
                                                return ("(" + order + ") ") + topic.name;
                                            }
                                        })
                                    }
                                    </div>
                                </div>
                                <div class="panel-body bio-graph-info">
                                    <div class="row">
                                        <div>
                                            {this.displayParagraph(examTopic)}
                                            {
                                                    examTopic.questions.map((question, questionIndex) => {

                                                        var isParagraph = examTopic.topic == 10 || examTopic.topic == 11;
                                                        var title = question.title.replace(/<p>/g, "")
                                                            .replace(/<[/]p>/g, "").replace(/div/g, "span");
                                                            var standardTitle = (questionIndex + 1) + "." +  title;
                                                                                            
                                                            return (
                                                                <div class="col-lg-6 height-160px">
                                                                    <div dangerouslySetInnerHTML={{__html: standardTitle}} />
                                                                    {
                                                                        question.answers.map((answer) => {
                                                                        return (
                                                                        <p class="small-font">
                                                                                <input type="radio" checked={answer.isCorrect}/> 
                                                                                <span dangerouslySetInnerHTML={{__html: answer.content}} />
                                                                            </p>
                                                                        );
                                                                })}
                                                                </div>
                                                        );
                                                    })
                                            }
                                        </div> 
                                    </div>
                                </div>
                            </section>
                                );
                        })}
                  </div>
              </div>
            </div>
        </Layout>
        ); 
    }
}

const initData = {
  defaultAnswerNumber : 4,
  defaultTopic : [
    {name : "Please select", value : -1},
    {name : "Hiragana to Kanji", value : 0},
    {name : "Kanji to Hiragana", value : 1},
    {name : "Fill into braces 1 (Vocabulary)", value : 2},
    {name : "Synonym", value : 3},
    {name : "Fill into braces 2 (Paragraph)", value : 4},
    {name : "Replace star", value : 5},
    {name : "Listen and answer", value : 7},
    {name : "Fill into braces 3 (Grammar)", value : 8},
    {name : "Wording", value : 9},
    {name : "Reading - Understanding Paragraph", value : 10},
    {name : "Fill according to stream Paragraph", value : 11}
  ],
  defaultLevel : [
    {name : "Please select", value : -1},
    {name : "Beginer", value : 0},
    {name : "N1", value : 1},
    {name : "N2", value : 2},
    {name : "N3", value : 3},
    {name : "N4", value : 4},
    {name : "N5", value : 5}
  ],
  defaultTrial : [
    {name : "All", value : "null"},
    {name : "is Trial", value : true},
    {name : "not Trial", value : false}
  ],
  defaultFree : [
    {name : "All", value : "null"},
    {name : "is Free", value : true},
    {name : "not Free", value : false}
  ],
  sortObject : [
    {field : "Create Time", value : "_id"},
    {field : "Free", value : "is_free"},
    {field : "Trial", value : "is_trial"},
    {field : "Point", value : "point"},
    {field : "Like Number", value : "like_number"},
    {field : "Taked Number", value : "taked_number"},
    {field : "Update Time", value : "update_time"},
  ],
  VIRTUAL_ARRAY : [],
  UPLOAD_IMAGE_TYPE : 0,
  TAKE_NUMBER : 10
}
