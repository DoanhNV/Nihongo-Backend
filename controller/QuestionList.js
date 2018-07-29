import React from 'react';
import Axios from 'axios';

export default class QuestionList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        initData : initData,
        topic : 7,
        level : 0,
        skip : 0,
        take : 10,
        fieldName : "_id",
        order : -1,
        questions : [],
        total : 0 
      }
      this.initPage();
    }

    initPage() {
      var url = "http://localhost:6868/mvcquestion/search";
      var queryData = this.prepareQueryData();
      this.getServerQuestion(url, queryData);
    }

    getServerQuestion(url, query) {
      Axios.post(url, query).then (
        res => {
        this.state.questions = res.data.questions;
        this.state.total = res.data.total;
        console.log(this.state.questions);
        console.log(this.state.total);
        this.forceUpdate();
      }).catch(error => {
          alert("Server Error!: " + error);
      });
    }

    prepareQueryData() {
      return {
        topic : this.state.topic,
        level : this.state.level,
        skip : this.state.skip,
        take : this.state.take,
        sort : {
          fieldName : this.state.fieldName,
          order : this.state.order
        }
      }
    }
    
    render() {
        return (
          <div>
            <div class="row">
              <div class="col-lg-12">
                  <h3> Question list </h3>
              </div>
            </div>
              <div class="row">
              {/* Search query */}
              <div class="col-lg-12">
                <div class="profile-widget profile-widget-info">
                    <div class="panel-body">
                    <table class="table-display">
                      <tr>
                        <td></td>
                        <td>
                          {/* Topic */}
                          <div class="form-group">
                              <label class="control-label col-lg-3" for="inputSuccess"><b>Topic</b></label>
                              <div class="col-lg-5">
                                <select name="topic" class="form-control m-bot15" onChange={this.handleChange}>
                                    {this.state.initData.defaultTopic.map((topic) => {
                                      return <option value={topic.value}>{topic.name}</option>
                                    })}
                                    {this.initData}
                                </select>
                              </div>
                            </div>
                        </td>
                      </tr>
                      <tr>
                        <td> 
                           {/* Level */}
                           <div class="form-group">
                              <label class="control-label col-lg-2" for="inputSuccess"><b>Sort by</b></label>
                              <div class="col-lg-3">
                                <select name="level" class="form-control m-bot15" onChange={this.handleChange}>
                                    {this.state.initData.sortObject.map((level) => {
                                      return <option value={level.value}>{level.field}</option>
                                    })}
                                </select>
                              </div>
                              <div class="col-lg-3">
                                <input type="radio" name="order" value="1"/> ASC &nbsp; &nbsp;
                                <input type="radio" name="order" value="-1" checked={true}/> DESC
                              </div>
                            </div>
                        </td>
                        <td> 
                            {/* Level */}
                            <div class="form-group">
                              <label class="control-label col-lg-3" for="inputSuccess"><b>Level</b></label>
                              <div class="col-lg-5">
                                <select name="level" class="form-control m-bot15" onChange={this.handleChange}>
                                    {this.state.initData.defaultLevel.map((level) => {
                                      return <option value={level.value}>{level.name}</option>
                                    })}
                                </select>
                              </div>
                            </div>
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                        <td>
                          <div class="form-group">
                            <div class="col-lg-offset-2 col-lg-1">
                              <button class="btn btn-primary" type="submit">Search</button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </table>
                    </div>
                </div>
              </div>
              <div class="col-lg-12">
                <section class="panel">
                  {/* <div class="row query-area question-list-query">
                      sdfsfd
                  </div> */}
                  {/* item */}
                  <div class="panel-body">
                    {
                      this.state.questions.map((question) => {
                        return (
                          <div class="tab-content">
                          <div id="recent-activity">
                            <div id="profile" class="tab-pane">
                                <section class="panel"> 
                                    <div class="bio-graph-heading question-title">
                                    {question.title}
                                    </div>
                                    <div class="panel-body bio-graph-info">
                                        <p class="question-sub"><span>Sub </span>: {question.titleSub} </p>
                                        {/* Answer */}
                                        <h1 class="group-title">Answers</h1>
                                        <div class="row">
                                            <div class="col-lg-6">
                                                <p><span>First Name </span>: Jenifer </p>
                                            </div>
                                        </div>
                                        {/* Infomation */}
                                        <h1 class="group-title">Infomations</h1>
                                        <div class="row">
                                            <div class="col-lg-6">
                                              <p>
                                                <span>Level </span>: {question.topic} <br/>
                                                <span>Topic </span>: {question.level}
                                              </p>
                                            </div>
                                            <div class="col-lg-6">
                                                <p><img id="previewImage" height="70" class="show"/></p>
                                            </div>
                                        </div>
                                    </div>
                                  </section>
                              </div>
                          </div>
                        </div>
                        )
                      })
                    }
                    
                    <div class="row paging-container">
                      <div class="pagination">
                        <a href="#">First</a>
                        <a href="#">&laquo;</a>
                        <a href="#">...</a>
                        <a href="#">2</a>
                        <a href="#">3</a>
                        <a href="#" class="active">4</a>
                        <a href="#">5</a>
                        <a href="#">6</a>
                        <a href="#">...</a>
                        <a href="#">&raquo;</a>
                        <a href="#">Last</a>
                      </div>
                    </div>
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
    {name : "Vocabulary", value : 2},
    {name : "Synonym", value : 3},
    {name : "Fill into braces", value : 4},
    {name : "Replace star", value : 5},
    {name : "Listen and answer", value : 7}
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
  UPLOAD_IMAGE_TYPE : 0
}
