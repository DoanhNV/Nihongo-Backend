import React from 'react';
import Axios from 'axios';

export default class QuestionList extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        initData : initData,
        topic : -1,
        level : -1,
        skip : 0,
        take : 1,
        fieldName : "_id",
        order : -1,
        questions : [],
        total : 0,
        currentPage : 11
      }
      this.initPage();
      this.handleChange = this.handleChange.bind(this);
      this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch() {
      this.search();
    }

    handleChange(e) {
      var name = e.target.name;
      var value = e.target.value;
      this.setState({ [name] : value});
    }

    initPage() {
      this.search();
    }

    search() {
      var url = "http://localhost:6868/mvcquestion/search";
      var queryData = this.prepareQueryData();
      this.getServerQuestion(url, queryData);
    }

    getServerQuestion(url, query) {
      Axios.post(url, query).then (
        res => {
        this.state.questions = res.data.questions;
        this.state.total = res.data.total;
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

    displayDocument(question) {
      var isImage = question.document.endsWith(".png");
      if(isImage) {
        return (<p><img id="previewImage" height="70" class="show"/></p>)
      } else {
        return (<p class="small-font"><span>Text audio question: </span>{question.document}</p>)
      }
    }

    paging() {
      var pageTags = "<div>";
      var postPerPage = 1;
      var currentPage = this.state.currentPage;
      var total = this.state.total;
      var pageNumber = total /  postPerPage;
      pageNumber = total % postPerPage == 0 ? pageNumber : pageNumber + 1;
      
      if(pageNumber != 0) {
        pageTags += '<a href="#">First</a>';
      }
      if(currentPage > 1) {
        pageTags += '<a href="#">&laquo;</a>';
      }
      for(var i = currentPage - 3; i <= currentPage + 3; i++) {
        if(i == currentPage - 3 && i >= 1) {
          pageTags += '<a href="#">...</a>';
        }
        if(i > 0 && currentPage - 2 <= i && i <= currentPage + 2 && 1 <= i && i <= total) {
          if(i == currentPage) {
            pageTags += '<a href="#" class="active">' + i + '</a>';
          } else {
            pageTags += '<a href="#">' + i + '</a>';
          }
        }
        if(i == currentPage + 3 && i <= total) {
          pageTags += '<a href="#">...</a>';
        }
      }
      if(currentPage < total) {
        pageTags += '<a href="#">&raquo;</a>';
      }
      if(pageNumber != 0) {
        pageTags += '<a href="#">Last</a>';
      }
      pageTags += "</div>";
      return  <div dangerouslySetInnerHTML={{__html: pageTags}} />
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
                           {/* Sort */}
                           <div class="form-group">
                              <label class="control-label col-lg-2" for="inputSuccess"><b>Sort by</b></label>
                              <div class="col-lg-3">
                                <select name="fieldName" class="form-control m-bot15" onChange={this.handleChange}>
                                    {this.state.initData.sortObject.map((level) => {
                                      return <option value={level.value}>{level.field}</option>
                                    })}
                                </select>
                              </div>
                              <div class="col-lg-3">
                                <input type="radio" name="order" value="1" onChange={this.handleChange}/> ASC &nbsp; &nbsp;
                                <input type="radio" name="order" value="-1" onChange={this.handleChange} defaultChecked  /> DESC
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
                              <button class="btn btn-primary" type="submit" onClick={this.handleSearch}>Search</button>
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
                  <div class="row">
                      <div class="col-lg-10"></div><div class="col-lg-2"><span>Total: {this.state.total}</span></div>
                  </div>
                  {/* item */}
                  <div class="panel-body panel-body-nihongo">
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
                                            { 
                                              question.answers.map((answer) => {
                                                return (
                                                  <div class="col-lg-6">
                                                      <p class="small-font"><span>{answer.content}</span>: {answer.isCorrect ? "Correct" : "Incorrect"} </p>
                                                  </div>
                                                );
                                              })
                                            }
                                        </div>
                                        {/* Infomation */}
                                        <h1 class="group-title">Infomations</h1>
                                        <div class="row">
                                            <div class="col-lg-6">
                                              <p>
                                                <span>Level: </span> 
                                                {
                                                  this.state.initData.defaultTopic.map((topic) => {
                                                    if(question.topic == topic.value) {
                                                      return (topic.name);
                                                    }
                                                  })
                                                } 
                                                <br/>
                                                <span>Topic: </span>
                                                {
                                                  this.state.initData.defaultLevel.map((level) => {
                                                    if(question.level == level.value) {
                                                      return (level.name);
                                                    }
                                                  })
                                                } 
                                              </p>
                                            </div>
                                            <div class="col-lg-6">
                                              {this.displayDocument(question)}
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
                        {this.paging()}
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
