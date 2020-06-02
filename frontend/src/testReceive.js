import React from 'react'
import axios from 'axios'

class testReceive extends React.Component{
    constructor(){
        super();
        this.state = {
            receivedData: '',
            pageCount: 1
        }
    }
    render() {
        if (this.state.pageCount == 1){
            axios.get("http://localhost:5000/testSend").then(res =>{
                this.setState({receivedData: JSON.stringify(res.data), pageCount: 2})
            })
        }
        
        return (
        <div>
            <h1>Test Receive</h1>
            <h2>{this.state.receivedData}</h2>
        </div>
            )
    }
}

export default testReceive