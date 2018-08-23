import React from 'react';
import Axios from 'axios';

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
      this.initPage();
      this.handleChange = this.handleChange.bind(this);
      this.handleSearch = this.handleSearch.bind(this);
      this.handlePageSearch = this.handlePageSearch.bind(this);
      this.handleAction = this.handleAction.bind(this);
    }

    handleSearch() {
      this.state.skip = 0;
      this.state.currentPage = 1;
      this.search();
    }

    handlePageSearch(e, page) {
      this.changeSkipTake(e);
      this.search();
      e.preventDefault();
    }

    changeSkipTake(e) {
      var changeNumber = e.currentTarget.dataset.tag;
      var currentPage = this.state.currentPage;
      var skip = this.state.skip;
      var pageNumber = Math.floor(this.state.total /  this.state.postPerPage);
      pageNumber = this.state.total % this.state.postPerPage == 0 ? pageNumber : pageNumber + 1;

      if(changeNumber === "encrease") {
        currentPage++;
      } else if(changeNumber === "decrease") {
        currentPage--;
      } else {
        currentPage = changeNumber;
      }
      if(0 < currentPage  && currentPage <= pageNumber) {
        skip = (currentPage - 1) * this.state.take;
      }
      this.state.currentPage = currentPage;
      this.state.skip = skip;
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
      this.getServerQuestion(url);
    }

    getServerQuestion(url) {
      Axios.get(url).then (
        res => {
        this.state.examSettings = res.data.examSettings;
        console.log(res);
        this.forceUpdate();
      }).catch(error => {
          alert("Server Error!: " + error);
      });
    }

    prepareUpdateData() {
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

    handleAction(e) {
      var type = Number(e.target.dataset.type);
      switch(type) {
        case 0: 
            this.handleAddQuestion(e);
            break;
        case 1: 
            this.detail(e);
            break;
        default:
      }
    }

    handleAddQuestion(e) {
     var documentId = e.target.dataset.id;
     this.redirectTo("/document/" + documentId + "/insertquestion");
    }

    detail(e) {
      var documentId = e.target.dataset.id;
      this.redirectTo("/document/" + documentId);
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
                                                  <td><input type="text" value={topicConfig.number} disabled/></td>
                                                  <td rowspan={examSetting.topicConfigs.length}>Mark {examSetting.topicConfigs.length}</td>
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
                                                  <td><input type="text" value={topicConfig.number} disabled/></td>
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
  TAKE_NUMBER : 10
}
