import reactDom from "react-dom";
import React, { Component } from 'react'
import {BrowserRouter} from 'react-router-dom';


class ProjectData extends Component {

      constructor(props) {
          super(props)
          this.state = {
              items: [],
              isLoaded: false,
          }
      }

      componentDidMount() {
            fetch ('https://backend.hungrr.io/v1/getDeliveryProjects')
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
                Number of Projects: {items.numberProjects}<br></br><br></br>

                <table>
                    <tr>
                    <td><b>Client</b></td>
                    <td><b>Start Date</b></td>
                    <td><b>End Date</b></td>
                    <td><b>Industry</b></td>
                </tr>
                     {items.projects.map(item => (
                  <tr>
                        <td>{item.Client} </td><td>{item.StartDate}</td><td>{item.EndDate}</td><td>{item.Industry}</td>
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

export default ProjectData;