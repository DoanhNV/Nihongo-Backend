import React from 'react';
import Axios from 'axios';
import ReactDOM from 'react-dom';
import { Redirect, withRouter} from 'react-router-dom';

class DocumentCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          initData : initData,
          content : "",
          topic : 10,
          level : 0,
          documentType: 0,
          questionIds : []
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
      var name = e.target.name;
      var value = e.target.value;
      if(e.target.type === "select-one") {
        this.state.topicMode = e.target.value;
      }
      this.setState({ [name] : value});
    }

    handleSubmit(e) {
        e.preventDefault();
        
        this.processContent();
        var requestData = this.prepareRequestData();
        var url = "http://localhost:6868/document/create";
        if(this.isValidParagraph(this.state.content)) {
          Axios.post(url, requestData).then(response => {
            var alertStr = response.data.code == 1.1 ? "Insert success!" : "Insert fail!";
            alert(alertStr);
            this.redirectTo("/document/" + response.data.id + "/insertquestion");
            }).catch (error => {
                alert("Server Error!: " + error);
            })
        }
    }

    prepareRequestData() {
        return {
            content : this.state.content,
            type : this.state.documentType,
            questionIds : this.state.questionIds,
            topic : this.state.topic,
            level : this.state.level
        }
    }

    processContent() {
        var htmlContent = "";
        htmlContent += ReactDOM.findDOMNode(document.getElementById("editor")).innerHTML;
        var domContent = $.parseHTML(htmlContent);
        var innerText = domContent != null ? domContent[0].innerText : "";
        htmlContent = this.isHTML(innerText) ? innerText : htmlContent;
        htmlContent = this.state.topicMode == 7 ? htmlContent.replace(/<p>/g, "").replace(/<[/]p>/g, ""): htmlContent;
        htmlContent = htmlContent.replace(/"/g, "'");
        alert(htmlContent);
        this.state.content = htmlContent;
    }
    

    isHTML(str) {
        var a = document.createElement('div');
        a.innerHTML = str;
      
        for (var c = a.childNodes, i = c.length; i--; ) {
          if (c[i].nodeType == 1) return true; 
        }
      
        return false;
    }

    isValidParagraph(content) {
        if(content === "" || content === "<p><br></p>") {
            alert("Empty paragraph!");
            return false;
        }
        return true;
    }

    redirectTo(url) {
      window.location.href = url;
    }

    render() {
        return (
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
                        Paragraph
                      </header>
                      <div class="panel-body">
                        <div id="editor" class="btn-toolbar" data-role="editor-toolbar" data-target="#editor"></div>
                      </div>
                    </section>
                    </div>
                    {/* Topic */}
                    <div class="form-group">
                      <label class="control-label col-lg-1" for="inputSuccess"><b>Topic</b></label>
                      <div class="col-lg-4">
                        <select name="topic" class="form-control m-bot15" onChange={this.handleChange}>
                            {this.state.initData.defaultTopic.map((topic) => {
                              return <option value={topic.value}>{topic.name}</option>
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
                              return <option value={level.value}>{level.name}</option>
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
        );
    }
}

const initData = {
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

export default withRouter(DocumentCreate);

