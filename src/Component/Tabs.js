import React from 'react';
import './Css/Tabs.css';
function Tabs({ Data: { current_tab, search, data }, method: { changeTab, change, logout } }) {
    // console.log(props)
    return (<div className="Tabs">
        <div className={current_tab == "new" ? "active" : ""} onClick={() => changeTab("new")}> New : {data.filter(d => (d.new && (d.title + d.body).indexOf(search) !== -1)).length}</div>
        <div className={current_tab == "archived" ? "active" : ""} onClick={() => changeTab("archived")} > Archived :  {data.filter(d => (d.archived && (d.title + d.body).indexOf(search) !== -1)).length}</div>
        <div className={current_tab == "total" ? "active" : ""} onClick={() => changeTab("total")}> Total :  {data.filter(d => ((d.title + d.body).indexOf(search) !== -1)).length}</div>
        <div style={{ padding: "0", position: "relative" }}><input style={{ height: "100%" }} type="text" placeholder="search..." value={search} onChange={(e) => change("search", e.target.value)} />
            {search && <i class="fa fa-times" aria-hidden="true" onClick={() => change("search", "")}></i>}
        </div>
        <div><i class="fa fa-user" aria-hidden="true"></i></div>
        <div style={{ backgroundColor: "red", color: "#fff" }} onClick={logout}>Exit</div>
    </div>)
}
export default Tabs;