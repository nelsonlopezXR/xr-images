import reactDom from "react-dom";
import React, { Component } from 'react'
import {BrowserRouter} from 'react-router-dom';


class MarketingData extends Component {

      constructor(props) {
          super(props)
          this.state = {
              items: [],
              isLoaded: false,
          }
      }

      componentDidMount() {
            fetch ('https://backend.hungrr.io/v1/getMarketingEvents')
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
                    Marketing Events<br></br>
                    Number of Marketing Events: {items.numberEvents}<br></br><br></br>
                    <table>
                    <tr>
                    <td><b>Date</b></td>
                    <td><b>Industry</b></td>
                    <td><b>Location</b></td>
                    <td><b>Name</b></td>
                </tr>
                     {items.marketingEvents.map(item => (
                  <tr>
                        <td>{item.Date} </td><td>{item.Industry}</td><td>{item.Location}</td><td>{item.Name}</td>
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

export default MarketingData;