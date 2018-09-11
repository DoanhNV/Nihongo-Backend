import React from 'react';
import Axios from 'axios';
import ReactDOM from 'react-dom';
import { Redirect, withRouter} from 'react-router-dom';

class ExamCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          initData : initData,
          level : 0,
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
      var name = e.target.name;
      var value = e.target.value;
      this.setState({ [name] : value});
    }

    handleSubmit(e) {
        e.preventDefault();
        var createData = this.prepareRequestData();
        var url = "http://35.240.130.216:6868/exam/create/random";
        Axios.post(url, createData).then(response => {
            var alertStr = "";
            var responceCode = response.data.code; 
            if(responceCode == 1.1) {
              alertStr = "Create success!" ;
            } else if (responceCode == 4.1)  {
              alertStr = "Level is not been update a setting" ;
            }  else if (responceCode == 4.2)  {
              alertStr = "Not enough question for this Level per Topic!" ;
            } else {
              alertStr = "System error!" ;
            }
            alert(alertStr);
        }).catch (error => {
                alert("Server Error!: " + error);
        })
    }

    prepareRequestData() {
        return {
            level : this.state.level
        }
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
                        <button class="btn btn-primary" type="submit">Create</button>
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

export default withRouter(ExamCreate);

