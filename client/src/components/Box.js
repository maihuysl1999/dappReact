import React, { Component } from "react";
import jQuery from 'jquery'; 

class Box extends Component {s
    render () {
        return (
            <div>
                <td className="num green zero" rowSpan={this.props.span}><span>0</span></td>
            </div>
        );
      }
    

} export default Box;