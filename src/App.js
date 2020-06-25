import React, { Component, Fragment } from 'react';
import logo from './logo.svg';
import './App.css';
import worker from './mock';
var Total = 0;
var Archived = 0;
var New = 0;
worker.start();
class App extends Component {
  state = {
    loggedIn: false,
    id: "",
    pass: "",
    data: [],
    current_tab: "total",
    search: "",
    selectedMail: "",
    replyOpen: false,
    replyValue: "",
    err: { active: false, errContent: "" }
  }
  login = () => {
    const { id, pass } = this.state;
    fetch('/login', {
      method: "post",
      body: JSON.stringify({ id, pass })
    }).then(res => res.json()).then(data => {
      if (data.err) {
        this.setState({
          err: { active: true, errContent: data.err }
        })
      }
      else {
        this.setState({
          loggedIn: true,
          data,
          err: { active: false, errContent: "" }

        })
      }
    }).catch(err => console.log(err))
  }
  selectMail = id => {
    const { data } = this.state
    const selectedMail = data.find(d => d.id == id);
    selectedMail.new = false;
    this.setState({
      selectedMail,
      replyOpen: false,
      replyValue: ""
    })
  }
  getDataByFilter = () => {
    const { current_tab, search } = this.state;
    var map = {
      total: "title",
      new: "new",
      archived: "archived"
    }
    return this.state.data.filter(d => {
      return ((d.title + d.body).indexOf(search) !== -1 && (current_tab == "total" ? d.archived == false : d[map[current_tab]]));
    });
  }
  changeTab = tab => {
    const { current_tab } = this.state;
    if (current_tab !== tab) {
      this.setState({
        current_tab: tab
      })
    }
  }
  openReply = () => {
    this.setState({ replyOpen: true })
  }
  closeReply = () => {
    this.setState({ replyOpen: false, replyValue: "" })
  }
  change = (field, value) => {
    this.setState({
      [field]: value
    })
  }
  sendReply = mail => {
    const { replyValue } = this.state;
    mail.replies = [replyValue, ...mail.replies];
    var data = [...this.state.data];
    this.setState({
      data,
      replyOpen: false,
      replyValue: ""
    })
  }
  archive = mail => {
    const data = [...this.state.data];
    mail.archived = !mail.archived;
    this.setState({
      selectedMail: "",
      data
    })
  }
  delete = mail => {
    const index = this.state.data.findIndex(d => d.id == mail.id);
    var data = [...this.state.data];
    data.splice(index, 1);
    this.setState({
      data,
      selectedMail: ""
    })

  }
  logout = () => {
    this.setState({ loggedIn: false, current_tab: "total", search: "", id: "", pass: "" })
  }
  render() {
    const { loggedIn, selectedMail, current_tab, replyOpen, replyValue, search, data, id, pass, err: { active, errContent } } = this.state;
    return (<div>
      {!loggedIn && <form>
        <input type="text" placeholder="id" value={id} onChange={(e) => this.change("id", e.target.value)} />
        <input type="password" placeholder="password" value={pass} onChange={(e) => this.change("pass", e.target.value)} />
        <button type="button" onClick={this.login}> submit</button>
        {active && <div className="err-box">
          {errContent}
        </div>}
      </form> || <div>
          <div className="Tabs">
            <div className={current_tab == "new" ? "active" : ""} onClick={this.changeTab.bind(this, "new")}> New : {data.filter(d => (d.new && (d.title + d.body).indexOf(search) !== -1)).length}</div>
            <div className={current_tab == "archived" ? "active" : ""} onClick={this.changeTab.bind(this, "archived")} > Archived :  {data.filter(d => (d.archived && (d.title + d.body).indexOf(search) !== -1)).length}</div>
            <div className={current_tab == "total" ? "active" : ""} onClick={this.changeTab.bind(this, "total")}> Total :  {data.filter(d => ((d.title + d.body).indexOf(search) !== -1)).length}</div>
            <input type="text" placeholder="search..." value={search} onChange={(e) => this.change("search", e.target.value)} />
            <div><i class="fa fa-user" aria-hidden="true" ></i></div>
            <div style={{ backgroundColor: "red", color: "#fff" }} onClick={this.logout}>Exit</div>
          </div>

          <div className="sidebar">
            {this.getDataByFilter().map(d => <div onClick={this.selectMail.bind(this, d.id)} className={d.id == selectedMail.id ? "active" : ""}>
              <b>{d.title.length > 30 ? d.title.slice(0, 30) + "..." : d.title}</b>
              <div className="email-text">{d.body.length > 20 ? d.body.slice(0, 20) + "..." : d.body}</div>
              {d.new && <span>new</span>}
            </div>)}
          </div>
          <div className="email-body">{selectedMail && <div className="selected-body">
            <div className="mail-buttons">
              {replyOpen && <Fragment>
                <button className="reply" onClick={this.sendReply.bind(this, selectedMail)}>Send</button>
                <button className="cancel" onClick={this.closeReply}>Cancel</button>
                <textarea value={replyValue} onChange={(e) => this.change('replyValue', e.target.value)} placeholder="Type something..." />
              </Fragment>
                || <Fragment><button className="reply" onClick={this.openReply}>Reply</button>
                  <button className="delete" onClick={this.delete.bind(this, selectedMail)}>Delete</button>
                  <button className="archive" onClick={this.archive.bind(this, selectedMail)}>{selectedMail.archived ? "Unarchive" : "Archive"}</button></Fragment>}
            </div>
            {selectedMail.replies.length > 0 && <div className="reply-container">
              {selectedMail.replies.map(r => <div>{r}</div>)}
            </div>}
            <div className="text-body">
              <b>{selectedMail.title}</b>
              <div className="all-text">
                {selectedMail.body}
                <img src={selectedMail.img} alt="image not found" />
              </div>
            </div>
          </div> || <div>No Selected Mail</div>}</div>
        </div>}
    </div>)
  }
}

export default App;
