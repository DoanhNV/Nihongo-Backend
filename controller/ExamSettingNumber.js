import React from 'react';
import Axios from 'axios';
import * as TokenUtil from '../util/TokenUtil.js';
import * as SecurityUtil from '../util/SecurityUtil.js';

export default class ExamSettingNumber extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        initData : initData,
        topic : -1,
        level : -1,
        skip : 0,
        take : initData.TAKE_NUMBER,
        fieldName : "_id",
        order : -1,
        examSettings : [],
        total : 0,
        currentPage : 1,
        postPerPage : initData.TAKE_NUMBER
      }

      TokenUtil.redirectWhenNotExistToken(TokenUtil.getToken());
      this.initPage();
      this.handleChange = this.handleChange.bind(this);
      this.handleUpdate = this.handleUpdate.bind(this);
      this.handleCancel = this.handleCancel.bind(this);
    }

    handleUpdate(e) {
      var examId = e.target.dataset.id;
      var inputClassDom = "input-" + examId;
      var inputClass = "." + inputClassDom;
      $(inputClass).attr("disabled", false);
      var buttonUpdateId = "btnUpdate" + examId;
      var level = e.target.dataset.level;
      var previousMode = $("#" + buttonUpdateId).text();
      if(previousMode === this.state.initData.UPDATE_MODE) {
        $("#" + buttonUpdateId).text(this.state.initData.SAVE_MODE);
      } else {
        this.updateData(examId, level, inputClassDom);
      }
    }

    handleCancel(e) {
      var inputClass = "input-" + e.target.dataset.id;
      $("." + inputClass).attr("disabled", true);
      var elements = document.getElementsByClassName(inputClass);
      var buttonUpdateId = "btnUpdate" + e.target.dataset.id;
      $("#" + buttonUpdateId).text(this.state.initData.UPDATE_MODE);
      for (var i = 0; i < elements.length; i++) {
        var item = elements[i];
        item.value = item.dataset.previous;
      }
    }

    handleChange(e) {
      var name = e.target.name;
      var value = e.target.value;
      this.setState({ [name] : value});
    }

    initPage() {
      this.getData();
    }

    getData() {
      var url = "http://localhost:6868/setting/exam/list";
      var headerObject = {
        headers: {
          "Content-Type": "application/json",
          "access_token": TokenUtil.getToken()
        }
      }
      Axios.get(url, headerObject).then (
        res => {
        res.data = SecurityUtil.decryptData(res.data.data);
        this.state.examSettings = res.data.examSettings;
        console.log(res);
        var SUCCESS_CODE = 1.1;
        if (res.data.code == SUCCESS_CODE) {
          TokenUtil.resetCookie(TokenUtil.getToken());
        }
        this.forceUpdate();
      }).catch(error => {
          alert("Server Error!: " + error);
          TokenUtil.deleteCookie();
          TokenUtil.redirectTo("/login");
      });  
    }

    updateData(id, level, inputClassDom) {
      var url = "http://localhost:6868/setting/exam/set/number";
      var data = this.prepareUpdateData(id, level, inputClassDom);
      var headerObject = {
        headers: {
          "Content-Type": "application/json",
          "access_token": TokenUtil.getToken()
        }
      }
      Axios.put(url, data, headerObject).then (
        res => {
        var SUCCESS_CODE = 1.1;
        if (res.data.code == SUCCESS_CODE) {
          TokenUtil.resetCookie(TokenUtil.getToken());
        }
        var alertString = res.data.code == 1.1 ? "Save success!" : "Insert Fail!";
        alert(alertString);
        var inputClass = "." + inputClassDom;
        $(inputClass).attr("disabled", true);
        var topicConfigs = data.topicConfigs;
        var elements = document.getElementsByClassName(inputClassDom);
        for(var i = 0; i < topicConfigs.length; i ++) {
          elements[i].dataset.previous = topicConfigs[i].number;
        }
      }).catch(error => {
          alert("Server Error!: " + error);
          TokenUtil.deleteCookie();
          TokenUtil.redirectTo("/login");
      });  
    }

    prepareUpdateData(id, level, inputClassDom) {
      var elements = document.getElementsByClassName(inputClassDom);
      var topicConfigs = [];
      for( var i = 0; i < elements.length; i++) {
        var item = elements[i];
        var topicElement = {
          topic : item.dataset.topic,
          number : item.value
        }
        topicConfigs.push(topicElement);
      }
      return {
        id : id,
        level : level,
        topicConfigs : topicConfigs
      }
    }

    redirectTo(url) {
      window.location.href = url;
    }
    
    render() {
        return (
          <div>
            <div class="row">
              <div class="col-lg-12">
                  <h3> Exam setting </h3>
              </div>
            </div>
              <div class="row">
              <div class="col-lg-12">
              
                <section class="panel">
                  <div class="row">
                      <div class="col-lg-10"></div><div class="col-lg-2"><span><br/></span></div>
                  </div>
                  {/* item */}
                  <div class="panel-body panel-body-nihongo">
                    {
                      this.state.examSettings.map((examSetting) => {
                        return (
                            <div class="col-sm-12">
                            <section class="panel">
                                <header class="panel-heading no-border">
                                N {examSetting.level}
                                </header>
                                <table class="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Topic</th>
                                            <th>Number</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                          examSetting.topicConfigs.map((topicConfig, index) => {
                                            if(index === 0) {
                                              return (
                                                <tr>
                                                  <td>
                                                    {
                                                      this.state.initData.defaultTopic.map((topic) => {
                                                      if(topicConfig.topic == topic.value) {
                                                        return topic.name;
                                                      }})
                                                    }
                                                  </td>
                                                  <td><input type="number" min="0" class={"input-" + examSetting.id} data-topic={topicConfig.topic} data-previous={topicConfig.number} defaultValue={topicConfig.number} disabled="true"/></td>
                                                  <td rowspan={examSetting.topicConfigs.length}>
                                                    <button class="btn btn-success" id={"btnUpdate" + examSetting.id} data-level={examSetting.level} data-id={examSetting.id} onClick={this.handleUpdate} >Update</button> <span> </span>
                                                    <button class="btn btn-danger" data-id={examSetting.id} onClick={this.handleCancel}>Cancel</button> <span> </span>
                                                  </td>
                                                </tr>
                                              );
                                            } else {
                                              return (
                                                <tr>
                                                 <td>
                                                    {
                                                      this.state.initData.defaultTopic.map((topic) => {
                                                      if(topicConfig.topic == topic.value) {
                                                        return topic.name;
                                                      }})
                                                    }
                                                  </td>
                                                  <td><input type="number" min="0" class={"input-" + examSetting.id} data-topic={topicConfig.topic} data-previous={topicConfig.number}  defaultValue={topicConfig.number} disabled="true"/></td>
                                                </tr>
                                              )
                                            }
                                          })
                                        }
                                    </tbody>
                                </table>
                            </section>
                        </div>
                        )
                      })
                    }
                  </div>
                </section>
              </div>
            </div>
          </div>
        ); 
    }
}

const initData = {
  defaultAnswerNumber : 4,
  defaultTopic : [
    {name : "Please select", value : -1},
    {name : "Hiragana to Kanji", value : 0},
    {name : "Kanji to Hiragana", value : 1},
    {name : "Fill into braces 1", value : 2},
    {name : "Synonym", value : 3},
    {name : "Fill into braces 2", value : 4},
    {name : "Replace star", value : 5},
    {name : "Listen and answer", value : 7},
    {name : "Fill into braces 3", value : 8},
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
  sortObject : [
    {field : "create Time", value : "_id"},
    {field : "topic", value : "topic"},
    {field : "level", value : "level"},
  ],
  UPLOAD_IMAGE_TYPE : 0,
  TAKE_NUMBER : 10,
  UPDATE_MODE : "Update",
  SAVE_MODE : "Save"
}
