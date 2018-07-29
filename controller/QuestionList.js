import React from 'react';

export default class QuestionList extends React.Component {
    render() {
        return (
          <div>
            <div class="row">
              <div class="col-lg-12">
                  <h3 class="page-header"> Question list</h3>
              </div>
            </div>
              <div class="row">
              <div class="col-lg-12">
                <div class="profile-widget profile-widget-info">
                    <div class="panel-body">
                      Query condition
                    </div>
                </div>
              </div>
              <div class="col-lg-12">
                <section class="panel">
                  {/* <div class="row query-area question-list-query">
                      sdfsfd
                  </div> */}
                  <div class="panel-body">
                    {/* item */}
                    <div class="tab-content">
                      <div id="recent-activity">
                        <div id="profile" class="tab-pane">
                            <section class="panel"> 
                                <div class="bio-graph-heading question-title">
                                    Hello I’m Jenifer Smith, a leading expert in interactive and creative design specializing in the mobile medium. My graduation from Massey University with a Bachelor of Design majoring in visual communication.
                                </div>
                                <div class="panel-body bio-graph-info">
                                    <p class="question-sub"><span>Sub </span>: Jenifer </p>
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
                                            <span>Level </span>: Jenifer <br/>
                                            <span>Topic </span>: Jenifer 
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
                    <div class="row paging-container">
                      <div class="pagination">
                        <a href="#">&laquo;</a>
                        <a href="#">1</a>
                        <a class="active" href="#">2</a>
                        <a href="#">3</a>
                        <a href="#">4</a>
                        <a href="#">5</a>
                        <a href="#">6</a>
                        <a href="#">&raquo;</a>
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