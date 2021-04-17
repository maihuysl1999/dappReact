import React, { Component } from "react";
import jQuery from 'jquery'; 
import Box from './Box';

class RouleteTable extends Component {
    state = {
        rows1: [1,4,7,10,13,16,19,22,25,28,31,34]
    };
    render () {
        return (
          <div>
            <meta charSet="UTF-8" />
            <title>roulette</title>
            <link rel="stylesheet" href="style.css" />
            <div className="roulette">
              <table>
                <tbody><tr className="nums">
                    <Box span={3}></Box>
                    {

                    }
                    <td className="num red"><span>3</span></td>
                    <td className="num black"><span>6</span></td>
                    <td className="num red"><span>9</span></td>
                    <td className="num red"><span>12</span></td>
                    <td className="num black"><span>15</span></td>
                    <td className="num red"><span>18</span></td>
                    <td className="num red"><span>21</span></td>
                    <td className="num black"><span>24</span></td>
                    <td className="num red"><span>27</span></td>
                    <td className="num red"><span>30</span></td>
                    <td className="num black"><span>33</span></td>
                    <td className="num red"><span>36</span></td>
                    <td className="sector" data-sector={1}><span className="vt">2 to 1</span></td>
                  </tr>
                  <tr className="nums">
                    <td className="hidden" />
                    <td className="num black"><span>2</span></td>
                    <td className="num red"><span>5</span></td>
                    <td className="num black"><span>8</span></td>
                    <td className="num black"><span>11</span></td>
                    <td className="num red"><span>14</span></td>
                    <td className="num black"><span>17</span></td>
                    <td className="num black"><span>20</span></td>
                    <td className="num red"><span>23</span></td>
                    <td className="num black"><span>26</span></td>
                    <td className="num black"><span>29</span></td>
                    <td className="num red"><span>32</span></td>
                    <td className="num black"><span>35</span></td>
                    <td className="sector" data-sector={2}><span className="vt">2 to 1</span></td>
                  </tr>
                  <tr className="nums">
                    <td className="hidden" />
                    <td className="num red"><span>1</span></td>
                    <td className="num black"><span>4</span></td>
                    <td className="num red"><span>7</span></td>
                    <td className="num black"><span>10</span></td>
                    <td className="num black"><span>13</span></td>
                    <td className="num red"><span>16</span></td>
                    <td className="num red"><span>19</span></td>
                    <td className="num black"><span>22</span></td>
                    <td className="num red"><span>25</span></td>
                    <td className="num black"><span>28</span></td>
                    <td className="num black"><span>31</span></td>
                    <td className="num red"><span>34</span></td>
                    <td className="sector" data-sector={3}><span className="vt">2 to 1</span></td>
                  </tr>
                  <tr>
                    <td className="empty" />
                    <td colSpan={4}>1st 12</td>
                    <td colSpan={4}>2nd 12</td>
                    <td colSpan={4}>3rd 12</td>
                    <td className="empty" />
                  </tr><tr>
                    <td className="empty" />
                    <td colSpan={2}>1 to 18</td>
                    <td colSpan={2}>EVEN</td>
                    <td colSpan={2}>RED</td>
                    <td colSpan={2}>BLACK</td>
                    <td colSpan={2}>ODD</td>
                    <td colSpan={2} className="sector" data-sector={12}>19 to 36</td>
                    <td className="empty" />
                  </tr>
                </tbody></table>
            </div>
          </div>
        );
      }
    

} export default RouleteTable;