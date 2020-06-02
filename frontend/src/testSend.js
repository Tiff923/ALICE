import React from 'react'
import axios from 'axios'

class testSend extends React.Component{
    constructor(){
        super();
        this.state = {
            returnJson: '',
            pageCount: 1
        }
    }
    render() {
        if (this.state.pageCount == 1){
            axios.post("http://localhost:5000/testReceive", {request:"TestSend",
                data:"Hello This Is A Test String"}).then(res =>{
                this.setState({returnJson: res.data, pageCount: 2})
            })
        }
        
        return (
        <div>
            <h1>Test Send</h1>
            <h2>{this.state.returnJson}</h2>
        </div>
            )
    }
}

export default testSend