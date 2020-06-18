import React from 'react'
import Header from '../Header/Header.js'
import Button from '@material-ui/core/Button';
import "./Login.css"


const Login = () => {
    return (
        <div class="body">
            <Header></Header>
            <div class="backgroundImage">
                <div class="card bg-light loginCard">
                    <div class="contentInfo">
                        <div style={{display: "inline-block", textAlign:"left", width:"400px", marginTop:"195px"}}>
                            <h1>Welcome</h1>
                            <p>Please sign in to access the full features of A.L.I.C.E. You can request for an account from your supervisor</p>
                        </div>
                    </div>
                    <div class="contentAuth">
                        <div className="logo-container-login">
                            <img src="./logo.png" width="200" height="200" alt="A.L.I.C.E. logo" />
                        </div>
                        <input type="text" placeholder="username" style={{width: '350px', marginBottom:'10px'}}/>
                        <input type="text" placeholder="password" style={{width: '350px', marginBottom:'30px'}}/>
                        <Button variant="contained" size='large' color="primary">Log In</Button>
                    </div>

                </div>                
            </div>

        </div>
    )
}

export default Login