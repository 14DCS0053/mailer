import React from 'react';
import './Css/Sidebar.css';
function Sidebar({ Data: { selectedMail }, method: { getDataByFilter, selectMail } }) {
    return (<div className="sidebar">
        {getDataByFilter().map(d => <div onClick={() => selectMail(d.id)} className={d.id == selectedMail.id ? "active" : ""}>
            <b>{d.title.length > 30 ? d.title.slice(0, 30) + "..." : d.title}</b>
            <div className="email-text">{d.body.length > 20 ? d.body.slice(0, 20) + "..." : d.body}</div>
            {d.new && <span>new</span>}
        </div>)}
    </div>)
}
export default Sidebar;