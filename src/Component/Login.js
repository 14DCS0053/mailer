import React from 'react';
import './Css/Login.css';
function Login({ Data: { id, pass, active, errContent }, method: { change, login } }) {
    return (<form>
        <input type="text" placeholder="id" value={id} onChange={(e) => change("id", e.target.value)} />
        <input type="password" placeholder="password" value={pass} onChange={(e) => change("pass", e.target.value)} />
        <button type="button" onClick={login}> submit</button>
        {active && <div className="err-box">
            {errContent}
        </div>}
    </form>)
}
export default Login;
