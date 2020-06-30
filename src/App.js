import React, { Component, Fragment } from 'react';
import logo from './logo.svg';
import './App.css';
import worker from './mock';
import Tabs from './Component/Tabs';
import Sidebar from './Component/Sidebar';
import Login from './Component/Login';
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
    console.log("lewjvl")
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
    const { changeTab, change, logout, selectMail, getDataByFilter, login } = this;
    return (<div>
      {!loggedIn && <Login Data={{ errContent, active, id, pass }} method={{ login, change }} /> || <div>

        <Tabs Data={{ current_tab, search, data }} method={{ changeTab, change, logout }} />
        <Sidebar Data={{ selectedMail }} method={{ selectMail, getDataByFilter }} />

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
