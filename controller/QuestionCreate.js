import React from 'react';
import Axios from 'axios';
import ReactDOM from 'react-dom';

export default class QuestionCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          defaultAnswerNumber : 4,
          defaultTopic : [
            {name : "Hiragana to Kanji", value : 0},
            {name : "Kanji to Hiragana", value : 1},
            {name : "Vocabulary", value : 2},
            {name : "Synonym", value : 3},
            {name : "Fill into braces", value : 4},
            {name : "Replace star", value : 5},
            {name : "Reading - Understanding", value : 6}
          ],
          defaultLevel : [
            {name : "Beginer", value : 0},
            {name : "N1", value : 1},
            {name : "N2", value : 2},
            {name : "N3", value : 3},
            {name : "N4", value : 4},
            {name : "N5", value : 5}
          ],
          title : "",
          answers : [],
          topic : 0,
          level : 0
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    handleSubmit(e) {
      var htmlTitle = ReactDOM.findDOMNode(document.getElementById("editor")).innerHTML;
      var checkBoxes = document.querySelectorAll("#isCorrects");
      var contents = document.querySelectorAll("#answers");
      var answers = [];
      
      for(var i = 0; i < checkBoxes.length; i++) {
        if(contents[i].value === "") {
          alert(i);
          answers = [];
          break;
        }
        var answer = {isCorrect : checkBoxes[i].checked, content : contents[i].value};
        answers.push(answer);
      }

      if(htmlTitle === "" || answers.length == 0) {
        alert("please input correct data!" + this.state.title + " - " + answers.length);
      } else {
        var data  = {
          title : htmlTitle,
          topic : this.state.topic,
          level : this.state.level,
          answers: answers,
          headers: {autorizacion: localStorage.token}
        }
        console.log(data)
        Axios.post("http://localhost:8282/mvcquestion/create", data).then (
          res => {
          alert("Insert success!");
        }).catch(error => {
          alert("Insert Fail!");
        });
      }
      e.preventDefault();
    }

    handleChange(e) {
      var name = e.target.name;
      var value = e.target.value;
      this.setState({ [name] : value});
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
                        Question
                      </header>
                      <div class="panel-body">
                        <div id="editor" class="btn-toolbar" data-role="editor-toolbar" data-target="#editor"></div>
                      </div>
                    </section>
                    </div>
                    <div class="form-group">
                      <label class="control-label col-lg-1" for="inputSuccess"><b>Answer</b></label>
                      <div class="col-lg-10">
                        {
                          Array(this.state.defaultAnswerNumber).fill(2).map((i) => {
                            return (
                                  <div class="checkbox">
                                    <label>
                                        <input id="isCorrects" type="checkbox" value=""/>  <input class=" form-control" id="answers" name="answers" type="text"/>
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
                      <div class="col-lg-10">
                        <select name="topic" class="form-control m-bot15" onChange={this.handleChange}>
                            {this.state.defaultTopic.map((topic) => {
                              return <option value={topic.value}>{topic.name}</option>
                            })}
                        </select>
                      </div>
                    </div>

                    {/* Level */}
                    <div class="form-group">
                      <label class="control-label col-lg-1" for="inputSuccess"><b>Level</b></label>
                      <div class="col-lg-10">
                        <select name="level" class="form-control m-bot15" onChange={this.handleChange}>
                            {this.state.defaultLevel.map((level) => {
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

