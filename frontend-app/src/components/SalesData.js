import reactDom from "react-dom";
import React, { Component } from 'react'
import {BrowserRouter} from 'react-router-dom';


class SalesData extends Component {

      constructor(props) {
          super(props)
          this.state = {
              items: [],
              isLoaded: false,
          }
      }

      componentDidMount() {
            fetch ('https://backend.hungrr.io/v1/getSalesLeads')
            .then(res => res.json())
            .then(json => {
                this.setState({
                    isLoaded: true,
                    items: json,
                })
            })
      }

      render () {
        var { isLoaded, items } = this.state;
        if (!isLoaded) {
            return <div>Loading...</div>
        }
        else {
            return (
                <div align="left" className="SalesData">
                    <br></br>
                    Sales Leads<br></br>
                    Number of Sales Leads: {items.numberLeads}<br></br><br></br>

                    <table>
                        <tr>
                        <td><b>First Name</b></td>
                        <td><b>Last Name</b></td>
                        <td><b>Industry</b></td>
                        <td><b>Phone</b></td>
                    </tr>
                         {items.salesLeads.map(item => (
                      <tr >
                            <td>{item.firstName} </td><td>{item.lastName}</td><td>{item.industry}</td><td>{item.phone}</td>
                        </tr>     
                         ))}

                         </table>
                         <br></br><br></br>
                         Timestamp: <b>{items.timeStamp}</b><br></br>
                    Server: <b>{items.server}</b><br></br>
                </div>
            )
        }
      }  
}

export default SalesData;