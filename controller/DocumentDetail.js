import React from 'react';
import Axios from 'axios';
import Layout from '../Layout';

export default class DocumentDetail extends React.Component {
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
        questions : [],
        total : 0,
        currentPage : 1,
        postPerPage : initData.TAKE_NUMBER,
        documentId : props.match.params.documentId,
        document : {}
      }
      this.initPage();
      this.handleChange = this.handleChange.bind(this);
      this.handleSearch = this.handleSearch.bind(this);
      this.handlePageSearch = this.handlePageSearch.bind(this);
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
      this.getParagraph();
    }

    getParagraph() {
      var url = "http://localhost:6868/document/get/" + this.state.documentId;
      Axios.get(url).then( response => {
        console.log(response.data);
        this.state.document = response.data.document;
        this.state.total = response.data.document.questionIds.length;
        this.search();
        this.forceUpdate();
      }).catch (error => {
        alert("Server Error :" + error);
      });
    }

    search() {
      var url = "http://localhost:6868/mvcquestion/list";
      var queryData = this.prepareQueryData();
      this.getServerQuestion(url, queryData);
    }

    getServerQuestion(url, query) {
      Axios.post(url, query).then (
        res => {
        this.state.questions = res.data.questions;
        this.forceUpdate();
      }).catch(error => {
          alert("Server Error!: " + error);
      });
    }

    prepareQueryData() {
      var questionIds = this.state.document.questionIds;
      var skip = this.state.skip;
      var take = skip + this.state.take;
      alert(skip + " - " + take);
      return {
        questionIds : questionIds.slice(skip, take)
      }
    }
    

    paging() {
      var postPerPage = this.state.postPerPage;
      var currentPage = Number(this.state.currentPage);
      var total = this.state.total;
      var pageNumber = Math.floor(total /  postPerPage);
      pageNumber = total % postPerPage == 0 ? pageNumber : pageNumber + 1;
      let tagElements = [];
      if(pageNumber > 1) {
        if(pageNumber != 0) {
          tagElements.push(<a href="#" data-tag="1" onClick={(e) => {this.handlePageSearch(e, 1)}}>First</a>);
        }
        if(currentPage > 1) {
          tagElements.push(<a href="#" data-tag="decrease" onClick={(e) => {this.handlePageSearch(e)}}>&laquo;</a>)
        }
        for(var i = currentPage - 3; i <= currentPage + 3; i++) {
          if(i == currentPage - 3 && i >= 1) {
            tagElements.push(<a>...</a>)
          } else if(currentPage - 2 <= i && i <= currentPage + 2 && 1 <= i && i <= pageNumber) {
            var cssClass = i == currentPage ? "active" : "";
            tagElements.push(<a href="#" data-tag={i} onClick={(e) => {this.handlePageSearch(e)}} class={cssClass}>{i}</a>)
          } else if(i == currentPage + 3 && i <= pageNumber) {
            tagElements.push(<a>...</a>)
          }
        }
        if(currentPage < pageNumber) {
          tagElements.push(<a href="#" data-tag="encrease" onClick={(e) => {this.handlePageSearch(e)}}>&raquo;</a>)
        }
        if(pageNumber != 0) {
          tagElements.push(<a href="#" data-tag={pageNumber} onClick={(e) => {this.handlePageSearch(e, pageNumber)}}>Last</a>)
        }
      }
      //<div dangerouslySetInnerHTML={{__html: pageTags}} />
      return  <div>{tagElements}</div>
    }
    
    render() {
        return (
          <Layout>
          <div>
            <div class="row">
              <div class="col-lg-12">
                  <h3> Detail <span class="color-blue"> {this.state.document.id} </span></h3>
              </div>
            </div>
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
                                    <div dangerouslySetInnerHTML={{__html: question.title}} />
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
                                                      <p class="small-font"><span dangerouslySetInnerHTML={{__html: answer.content}} ></span>: <span class={answer.isCorrect ? "color-blue" : ""} >{answer.isCorrect ? "Correct" : "Incorrect"} </span></p>
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
                                                <span>Topic: </span> 
                                                {
                                                  this.state.initData.defaultTopic.map((topic) => {
                                                    if(question.topic == topic.value) {
                                                      return (topic.name);
                                                    }
                                                  })
                                                } 
                                                <br/>
                                                <span>Level: </span>
                                                {
                                                  this.state.initData.defaultLevel.map((level) => {
                                                    if(question.level == level.value) {
                                                      return (level.name);
                                                    }
                                                  })
                                                } 
                                              </p>
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
          </Layout>
        ); 
    }
}

const initData = {
  defaultAnswerNumber : 4,
  defaultTopic : [
    {name : "Please select", value : -1},
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
  TAKE_NUMBER : 2
}
