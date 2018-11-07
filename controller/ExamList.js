import React from 'react';
import Axios from 'axios';
import * as TokenUtil from '../util/TokenUtil.js';
import * as SecurityUtil from '../util/SecurityUtil.js';

export default class ExamList extends React.Component {
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
        exams : [],
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
      this.handleSearch = this.handleSearch.bind(this);
      this.handlePageSearch = this.handlePageSearch.bind(this);
      this.handleAction = this.handleAction.bind(this);
      this.handleUpdate = this.handleUpdate.bind(this);
      this.handleDetail = this.handleDetail.bind(this);
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
      this.search();
    }

    search() {
      var url = "http://nihongojp.com:6868/exam/search";
      var queryData = this.prepareQueryData();
      this.getServerQuestion(url, queryData);
    }

    getServerQuestion(url, query) {
      var headerObject = {
        headers: {
          "Content-Type": "application/json",
          "access_token": TokenUtil.getToken()
        }
      }
      Axios.post(url, query, headerObject).then (
        res => {
        //res.data = SecurityUtil.decryptData(res.data.data);
        this.state.exams = res.data.exams;
        this.state.total = res.data.total;
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

    prepareQueryData() {
      return {
        level : this.state.level,
        isTrial : this.state.isTrial !== "null" ? this.state.isTrial : null,
        isFree : this.state.isFree !== "null" ? this.state.isFree : null,
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
        default:
        this.detail(e);
      }
    }

    handleUpdate(e) {
        var examId = e.target.dataset.id;
        var field = e.target.dataset.field;
        var value = e.target.dataset.value == 'true' ? 'false' : 'true';
        var css = Number(e.target.dataset.cssdata);
        var url = "http://nihongojp.com:6868/exam/update/" + examId;
        var headerObject = {
          headers: {
            "Content-Type": "application/json",
            "access_token": TokenUtil.getToken()
          }
        }
        var updateData = this.prepareUpdateData(field, value);
        Axios.put(url, updateData, headerObject).then((response) => {  
            //response.data = SecurityUtil.decryptData(response.data.data);
            var code = response.data.code;
            var SUCCESS_CODE = 1.1;
            if(code == SUCCESS_CODE) {
                TokenUtil.resetCookie(TokenUtil.getToken());
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

    handleDetail(e) {
      var examId = e.target.dataset.id;
      this.redirectTo("/exam/" + examId);
    }

    detail(e) {
      var documentId = e.target.dataset.id;
      this.redirectTo("/document/" + documentId);
    }

    redirectTo(url) {
      window.open(url,"_blank") ;
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
          <div>
            <div class="row">
              <div class="col-lg-12">
              </div>
            </div>
              <div class="row">
              {/* Search query */}
              <div class="col-lg-12">
                <div class="profile-widget profile-widget-info">
                    <div class="panel-body">
                    <table class="table-display">
                      <tr>
                        <td>
                            {/* Level */}
                            <div class="form-group">
                              <label class="control-label col-lg-2" for="inputSuccess"><b>Level</b></label>
                              <div class="col-lg-3">
                                <select name="level" class="form-control m-bot15" onChange={this.handleChange}>
                                    {this.state.initData.defaultLevel.map((level) => {
                                      return <option value={level.value}>{level.name}</option>
                                    })}
                                </select>
                              </div>
                            </div>
                        </td>
                        <td>
                          {/* Topic */}
                          <div class="form-group">
                              <label class="control-label col-lg-3" for="inputSuccess"><b>Trial</b></label>
                              <div class="col-lg-5">
                                <select name="isTrial" class="form-control m-bot15" onChange={this.handleChange}>
                                    {this.state.initData.defaultTrial.map((trial) => {
                                      return <option value={trial.value}>{trial.name}</option>
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
                            {/* Trial */}
                            <div class="form-group">
                              <label class="control-label col-lg-3" for="inputSuccess"><b>Free</b></label>
                              <div class="col-lg-5">
                                <select name="isFree" class="form-control m-bot15" onChange={this.handleChange}>
                                    {this.state.initData.defaultFree.map((free) => {
                                      return <option value={free.value}>{free.name}</option>
                                    })}
                                    {this.initData}
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
                      this.state.exams.map((exam, index) => {
                        return (
                          <div>
                                <div class="tab-content">
                                    <div id="recent-activity">
                                        <div id="profile" class="tab-pane">
                                            <section class="panel">
                                                <div class="bio-graph-heading question-title">
                                                    <div>
                                                       {this.state.skip + index + 1} <span> -  </span> {exam.id} 
                                                        <span class="color-red"> - Level: </span> 
                                                        {
                                                            this.state.initData.defaultLevel.map((level) => {
                                                                if(exam.level == level.value) {
                                                                    return (level.name);
                                                                }
                                                            })
                                                        }
                                                        <span class="color-red"> - </span> 
                                                        <button id={"isFree-" + exam.id} class={exam.isFree == true ? 
                                                                        "color-green background-color-yellow width-80px " 
                                                                            : "color-yellow background-color-green width-80px isFree-"}
                                                                data-id={exam.id} data-value={exam.isFree} data-field="isFree" data-cssdata={exam.isFree == true ? 0 : 1}
                                                                onClick={this.handleUpdate}
                                                        >
                                                            {exam.isFree == true ? "Free" : "Money"}
                                                        </button>
                                                        <button id={"isTrial-" + exam.id} class={exam.isTrial == true ? 
                                                                        "color-green background-color-yellow width-80px isTrial-" + exam.id
                                                                            : "color-yellow background-color-green width-80px isTrial-" + exam.id}
                                                                data-id={exam.id} data-value={exam.isTrial} data-field="isTrial" data-cssdata={exam.isTrial == true ? 0 : 1}
                                                                onClick={this.handleUpdate}
                                                        >
                                                            {exam.isTrial == true ? "Trial" : "Not trial"}
                                                        </button>

                                                        <button id={"isActive-" + exam.id} class={exam.isActive == true ? 
                                                                    "color-yellow background-color-green width-80px isActive-" + exam.id:
                                                                         "color-green background-color-yellow width-80px isActive-" + exam.id}
                                                                data-id={exam.id} data-value={exam.isActive} data-field="isActive" data-cssdata={exam.isActive == true ? 1 : 0}
                                                                onClick={this.handleUpdate}
                                                        >
                                                            {exam.isActive == true ? "Active" : "Disable"}
                                                        </button>
                                                        <span>                                      </span>
                                                         <button class="btn-primary" onClick={this.handleDetail} data-id={exam.id}>
                                                            Detail
                                                        </button>
                                                    </div>
                                                </div>
                                                <div class="panel-body bio-graph-info">
                                                    <div class="row">
                                                        <div class="col-lg-6">
                                                            <p class="small-font"><span>Point</span>: <span class="color-blue">{exam.point}</span></p>
                                                        </div>
                                                        <div class="col-lg-6">
                                                            <p class="small-font"><span>like</span>: <span class="color-blue">{exam.likeNumber}</span></p>
                                                        </div>
                                                        <div class="col-lg-6">
                                                            <p class="small-font"><span>Time (minutes)</span>: <span class="color-blue">{exam.completedMinutes}</span></p>
                                                        </div>
                                                        <div class="col-lg-6">
                                                            <p class="small-font"><span>Taked number</span>: <span class="color-blue">{exam.takedNumber}</span></p>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-lg-6">
                                                            <p><span>Create Time: { new Date(exam.createTime).toLocaleString()}</span></p>
                                                        </div>
                                                        <div class="col-lg-6">
                                                            <p><span>Update Time: { new Date(exam.updateTime).toLocaleString()}</span></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        </div>
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
  UPLOAD_IMAGE_TYPE : 0,
  TAKE_NUMBER : 10
}
