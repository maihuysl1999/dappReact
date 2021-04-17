import React, { Component } from "react";
import {} from '../indexRouleteTable';
import jQuery from 'jquery'; 

class RouleteTable extends Component {

    componentDidMount () {
        (function($) {
	
            // table
            (function() {
                "use strict"
                
                function getButtonCells(btn) {
                    var cells = btn.data('cells');
                    if (!cells || !cells.length) {
                        cells = [];
                        switch (btn.data('type')) {
                            case 'sector':
                                var nums = sectors[btn.data('sector')];
                                for (var i = 0, len = nums.length; i < len; i++) {
                                    cells.push(table_nums[nums[i]]);
                                }
                                return cells;
                                break;
                            case 'num':
                            default:
                                var nums = String(btn.data('num')).split(',');
                                for (var i = 0, len = nums.length; i < len; i++) {
                                    cells.push(table_nums[nums[i]]);
                                }
                                btn.data('cells', cells)
                                return btn.data('cells');
                                break;
                        }
                    }
                    return cells;
                };
        
                // props
                var active = true,
                    selectors = {
                        roulette : '.roulette',
                        num : '.num',
                        sector : '.sector',
                        table_btns : '.controlls .btn'
                    },
                    classes = {
                        red : 'red',
                        black : 'black',
                        green : 'green',
                        hover : 'hover'
                    },
                    numbers = {
                        red : [],
                        black : [],
                        green : []
                    },
                    sectors = {
                        '1' : [], // 1st row
                        '2' : [], // 2nd row
                        '3' : [], // 3rd row
                        '4' : [], // 1st 12
                        '5' : [], // 2nd 12
                        '6' : [], // 3rd 12
                        '7' : [], // 1 to 18
                        '8' : [], // EVEN
                        '9' : [], // RED
                        '10' : [], // BLACK
                        '11' : [], // ODD
                        '12' : [], // 19 to 36
                    },
                    table_nums = {},
                    table_sectors = {};
        
                // init
                $(selectors.num).each(function() {
                    var $this = $(this),
                        color,
                        num = Number($this.text());
                    // add to instances array
                    table_nums[num] = $this;
                    // add to colors array
                    for (var color in numbers) {
                        if ($this.hasClass(classes[color])) {
                            numbers[color].push(num);
                            $this.data('color', color);
                        }
                    }
                })
        
                $(selectors.sector).each(function() { 
                    var $this = $(this),
                        color;
                    if ($this.hasClass(classes.red)) {
                        color = 'red';
                    } else if ($this.hasClass(classes.black)) {
                        color = 'black';
                    } else {
                        color = 'sector';
                    }
                    $this.data('color', color);
                    table_sectors[$this.data('sector')] = $this;
                });
        
                // sort numbers
                for (var color in numbers) {
                    numbers[color].sort(function(a, b) { return a - b; });
                }
        
                // populate sectors
                for (var i = 1; i <= 36; i++) {
                    // 1st row, 2nd row, 3rd row
                    switch (i%3) {
                        case 0:
                            sectors['1'].push(i);
                            break;
                        case 1:
                            sectors['3'].push(i);
                            break;
                        case 2:
                            sectors['2'].push(i);
                            break;
                    }
        
                    // 1st 12, 2nd 12, 3rd 12
                    if (i <= 12) {
                        sectors['4'].push(i);
                    } else if (i <= 24) {
                        sectors['5'].push(i);
                    } else {
                        sectors['6'].push(i);
                    }
        
                    // 1 to 18, 19 to 36
                    if (i <= 18) {
                        sectors['7'].push(i);
                    } else {
                        sectors['12'].push(i);
                    }
        
                    // ODD, EVEN
                    if (i%2) {
                        sectors['11'].push(i);
                    } else {
                        sectors['8'].push(i);
                    }
        
                    if (numbers.red.indexOf(i) != -1) {
                        sectors['9'].push(i);
                    } else if (numbers.black.indexOf(i) != -1) {
                        sectors['10'].push(i);
                    }
                }
        
                // buttons
                var table_btns = $(selectors.table_btns).hover(
                    function() {
                        hovering=1;
                        if (active) {
                            var $this = $(this),
                                cells = getButtonCells($this);
                            for (var i = 0, len = cells.length; i < len; i++) {
                                cells[i].addClass(classes.hover);
                            }
                            var sector = $this.data('sector');
                            if (sector) {
                                table_sectors[sector].addClass(classes.hover);
                            }
                        }
                    },
                    function() {
                        hovering=0;
                        var $this = $(this),
                            cells = getButtonCells($this);
                        for (var i = 0, len = cells.length; i < len; i++) {
                            cells[i].removeClass(classes.hover);
                        }
                        var sector = $this.data('sector');
                        if (sector) {
                            table_sectors[sector].removeClass(classes.hover);
                        }
                    }
                ).mousedown(function(e) {
                    var numbers=[];
                    if(typeof $(this).data('sector') != 'undefined'){
                        console.log("SECTOR "+$(this).data('sector'));
                        
                        if(e.button==2)ChangeBet(36+$(this).data('sector'),-1);
                        else ChangeBet(36+$(this).data('sector'),+1);
                    }
                    else{
                        numbers=$(this).data('num');
                        
                        if(typeof numbers.length ==='undefined')numbers=[numbers];
                        else numbers=numbers.split(',');
                        
                        if(e.button==2)for(var i=0;i<numbers.length;i++)ChangeBet(numbers[i],-1);
                        else for(var i=0;i<numbers.length;i++)ChangeBet(numbers[i],+1);
                    }
                });
            })();
            
        document.oncontextmenu = function() {if(hovering)return false;};
        
        })(jQuery);
        
        
        var squares=new Array(48);
        var divs=document.getElementsByTagName("div");
        for(var i=0;i<divs.length;i++){
            var attr=divs[i].getAttribute("data-num");
            if(attr==null){
                attr=divs[i].getAttribute("data-sector");
                if(attr==null)continue;
                var index=36+parseInt(attr);
                
                var rekt=divs[i].getBoundingClientRect();
                squares[index]=new Array(2);
                squares[index][1]=rekt.top+10;
                squares[index][0]=rekt.left+16;
            }else{
                if(attr.indexOf(',')!=-1)continue;
                var rekt=divs[i].getBoundingClientRect();
                squares[attr]=new Array(2);
                squares[attr][1]=rekt.top+10;
                squares[attr][0]=rekt.left+16;
            }
        }
        
        function UpdateBets(){
            var betdiv=document.getElementById("bets");
            betdiv.innerHTML='';
            for(var i=37;i<bets.length;i++)if(bets[i]>0)betdiv.innerHTML+=sectors[i-37]+": "+(bets[i]*CurrentTier).toFixed(2)+"<br>";
            for(var i=0;i<37;i++)if(bets[i]>0)betdiv.innerHTML+="Number "+i+": "+(bets[i]*CurrentTier).toFixed(2)+"<br>";
        }
        
        function Reset(){
            for(var i=0;i<bets.length;i++){
                bets[i]=0;
                if(chips[i]!=null)for(var j=0;chips[i].length>0;j++)document.body.removeChild(chips[i].pop());
            }
            balance=1;
            
            UpdateBets();
            UpdateBalance();
        }
        
        function TotalBets(){
            var r=0;
            for(var i=0;i<bets.length;i++)r+=bets[i];
            return r;
        }
        
        function rInt(min,max){
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        
        var chips=new Array(48);
        
        function ChangeBet(id,amount){
            if(amount>0&&TotalBets()==50){
                //maybe some beep
                return;
            }
            
            if(amount>0){
                var img = document.createElement('img');
                img.src="https://image.flaticon.com/icons/png/128/138/138528.png";
                img.style.zIndex="0";
                img.style.position="absolute";
                
                var rX=rInt(-16,16);
                var rY=rInt(-16,16);
                
                img.style.left=(squares[id][0]+rX)+"px";
                img.style.top=(squares[id][1]+rY)+"px";
                
                img.style.width="20px";
                img.style.pointerEvents="none";
                
                document.body.appendChild(img);
                
                if(chips[id]==null)chips[id]=new Array(0);
                chips[id].push(img);
            }if(amount<0&&chips[id]!=null&&chips[id].length>0)document.body.removeChild(chips[id].pop());
            
            bets[id]+=amount;
            if(bets[id]<0)bets[id]=0;
            UpdateBets();
            UpdateBalance();
        }
        
        function UpdateBalance(){
            var e=document.getElementById("balance");
            e.innerHTML="Balance: "+balance.toFixed(2)+" ETH";
            var tb=TotalBets();
            if(tb>0)e.innerHTML+=" ("+(tb*CurrentTier).toFixed(2)+")";
        }
        
        function Place(){
            var bet=0;
            for(var i=0;i<bets.length;i++)if(bets[i]!=0)bet+=bets[i];
            bet*=CurrentTier;
            
            if(bet>balance){
                var betdiv=document.getElementById("result");
                betdiv.innerHTML="Insufficient balance!";
                return;
            }
            
            var result=Math.floor(Math.random()*37);
            
            var win=0;
            if(bets[result]!=0)win+=bets[result]*36;
            for(var i=37;i<bets.length;i++)if(bets[i]!=0)win+=bets[i]*sectormultipliers[i-37][result];
            
            win*=CurrentTier;
            win-=bet;
            
            console.log("BET: "+bet+" WIN: "+win);
            
            var betdiv=document.getElementById("result");
            if(win>=bet)betdiv.innerHTML="Lucky number: "+result+" you won "+win.toFixed(2)+" ETH!";
            else betdiv.innerHTML="Lucky number: "+result+" you lost "+win.toFixed(2)+" ETH!";
            
            balance+=win;
            UpdateBalance();
        }
        
        var balance=1;
        
        var CurrentTier=0.01;
        
        var tiers=[
            0.0001,
            0.0002,
            0.001,
            0.002,
            0.01,
            0.02
        ];
        
        var sectors=[
            "3rd column",
            "2nd column",
            "1st column",
            "1st 12",
            "2nd 12",
            "3rd 12",
            "1 to 18",
            "Even",
            "Red",
            "Black",
            "Odd",
            "19 to 36"
        ];
        
        var hovering=0;
        var bets=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        
        var sectormultipliers=[
            [0,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3],//3rd column
            [0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0],//2nd column
            [0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0,3,0,0],//1st column
            [0,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//1st 12
            [0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0],//2nd 12
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,3,3,3,3,3,3,3,3,3],//3rd 12
            [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//1 to 18
            [0,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2],//even
            [0,2,0,2,0,2,0,2,0,2,0,0,2,0,2,0,2,0,2,2,0,2,0,2,0,2,0,2,0,0,2,0,2,0,2,0,2],//Red
            [0,0,2,0,2,0,2,0,2,0,2,2,0,2,0,2,0,2,0,0,2,0,2,0,2,0,2,0,2,2,0,2,0,2,0,2,0],//Black
            [0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0,2,0],//odd
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2] //19 to 36
        ];
    }
    render () {
        return (
          <div>
            <meta charSet="UTF-8" />
            <title>roulette</title>
            <link rel="stylesheet" href="style.css" />
            <div className="roulette">
              <table>
                <tbody><tr className="nums">
                    <td className="num green zero" rowSpan={3}><span>0</span></td>
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
                    <td colSpan={4} className="sector" data-sector={4}>1st 12</td>
                    <td colSpan={4} className="sector" data-sector={5}>2nd 12</td>
                    <td colSpan={4} className="sector" data-sector={6}>3rd 12</td>
                    <td className="empty" />
                  </tr><tr>
                    <td className="empty" />
                    <td colSpan={2} className="sector" data-sector={7}>1 to 18</td>
                    <td colSpan={2} className="sector" data-sector={8}>EVEN</td>
                    <td colSpan={2} className="sector red" data-sector={9}>RED</td>
                    <td colSpan={2} className="sector black" data-sector={10}>BLACK</td>
                    <td colSpan={2} className="sector" data-sector={11}>ODD</td>
                    <td colSpan={2} className="sector" data-sector={12}>19 to 36</td>
                    <td className="empty" />
                  </tr>
                </tbody></table>
              <div className="controlls">
                <div className="btn btn-zero" data-num={0} />
                {/* col6 */}
                <div className="col1">
                  <div className="row1">
                    <div className="btn v rm cv" data-num="0,3" />
                    <div className="btn m rm cm" data-num={3} />
                  </div>
                  <div className="row2">
                    <div className="btn c rh cv" data-num="0,2,3" />
                    <div className="btn v rm cv" data-num="0,2" />
                    <div className="btn h rh cm" data-num="2,3" />
                    <div className="btn m rm cm" data-num={2} />
                  </div>
                  <div className="row3">
                    <div className="btn c rh cv" data-num="0,1,2" />
                    <div className="btn v rm cv" data-num="0,1" />
                    <div className="btn c rb cv" data-num="0,1,2,3" />
                    <div className="btn h rh cm" data-num="1,2" />
                    <div className="btn m rm cm" data-num={1} />
                    <div className="btn h rb cm" data-num="1,2,3" />
                  </div>
                  <div className="row4">
                    <div className="btn ms4 rm cm" data-type="sector" data-sector={4} />
                  </div>
                  <div className="row5">
                    <div className="btn ms2 rm cm" data-type="sector" data-sector={7} />
                  </div>
                </div>
                {/* col2 */}
                <div className="col2">
                  <div className="row1">
                    <div className="btn v rm cv" data-num="3,6" />
                    <div className="btn m rm cm" data-num={6} />
                  </div>
                  <div className="row2">
                    <div className="btn c rh cv" data-num="2,3,5,6" />
                    <div className="btn v rm cv" data-num="2,5" />
                    <div className="btn h rh cm" data-num="5,6" />
                    <div className="btn m rm cm" data-num={5} />
                  </div>
                  <div className="row3">
                    <div className="btn c rh cv" data-num="1,2,4,5" />
                    <div className="btn v rm cv" data-num="1,4" />
                    <div className="btn c rb cv" data-num="1,2,3,4,5,6" />
                    <div className="btn h rh cm" data-num="4,5" />
                    <div className="btn m rm cm" data-num={4} />
                    <div className="btn h rb cm" data-num="4,5,6" />
                  </div>
                </div>
                {/* col3 */}
                <div className="col3">
                  <div className="row1">
                    <div className="btn v rm cv" data-num="6,9" />
                    <div className="btn m rm cm" data-num={9} />
                  </div>
                  <div className="row2">
                    <div className="btn c rh cv" data-num="5,6,8,9" />
                    <div className="btn v rm cv" data-num="5,8" />
                    <div className="btn h rh cm" data-num="8,9" />
                    <div className="btn m rm cm" data-num={8} />
                  </div>
                  <div className="row3">
                    <div className="btn c rh cv" data-num="4,5,7,8" />
                    <div className="btn v rm cv" data-num="4,7" />
                    <div className="btn c rb cv" data-num="4,5,6,7,8,9" />
                    <div className="btn h rh cm" data-num="7,8" />
                    <div className="btn m rm cm" data-num={7} />
                    <div className="btn h rb cm" data-num="7,8,9" />
                  </div>
                  <div className="row5">
                    <div className="btn ms2 rm cm" data-type="sector" data-sector={8} />
                  </div>
                </div>
                {/* col4 */}
                <div className="col4">
                  <div className="row1">
                    <div className="btn v rm cv" data-num="9,12" />
                    <div className="btn m rm cm" data-num={12} />
                  </div>
                  <div className="row2">
                    <div className="btn c rh cv" data-num="8,9,11,12" />
                    <div className="btn v rm cv" data-num="8,11" />
                    <div className="btn h rh cm" data-num="11,12" />
                    <div className="btn m rm cm" data-num={11} />
                  </div>
                  <div className="row3">
                    <div className="btn c rh cv" data-num="7,8,10,11" />
                    <div className="btn v rm cv" data-num="7,10" />
                    <div className="btn c rb cv" data-num="7,8,9,10,11,12" />
                    <div className="btn h rh cm" data-num="10,11" />
                    <div className="btn m rm cm" data-num={10} />
                    <div className="btn h rb cm" data-num="10,11,12" />
                  </div>
                </div>
                {/* col5 */}
                <div className="col5">
                  <div className="row1">
                    <div className="btn v rm cv" data-num="12,15" />
                    <div className="btn m rm cm" data-num={15} />
                  </div>
                  <div className="row2">
                    <div className="btn c rh cv" data-num="11,12,14,15" />
                    <div className="btn v rm cv" data-num="11,14" />
                    <div className="btn h rh cm" data-num="14,15" />
                    <div className="btn m rm cm" data-num={14} />
                  </div>
                  <div className="row3">
                    <div className="btn c rh cv" data-num="10,11,13,14" />
                    <div className="btn v rm cv" data-num="10,13" />
                    <div className="btn c rb cv" data-num="10,11,12,13,14,15" />
                    <div className="btn h rh cm" data-num="13,14" />
                    <div className="btn m rm cm" data-num={13} />
                    <div className="btn h rb cm" data-num="13,14,15" />
                  </div>
                  <div className="row4">
                    <div className="btn ms4 rm cm" data-type="sector" data-sector={5} />
                  </div>
                  <div className="row5">
                    <div className="btn ms2 rm cm" data-type="sector" data-sector={9} />
                  </div>
                </div>
                {/* col6 */}
                <div className="col6">
                  <div className="row1">
                    <div className="btn v rm cv" data-num="15,18" />
                    <div className="btn m rm cm" data-num={18} />
                  </div>
                  <div className="row2">
                    <div className="btn c rh cv" data-num="14,15,17,18" />
                    <div className="btn v rm cv" data-num="14,17" />
                    <div className="btn h rh cm" data-num="17,18" />
                    <div className="btn m rm cm" data-num={17} />
                  </div>
                  <div className="row3">
                    <div className="btn c rh cv" data-num="13,14,16,17" />
                    <div className="btn v rm cv" data-num="13,16" />
                    <div className="btn c rb cv" data-num="13,14,15,16,17,18" />
                    <div className="btn h rh cm" data-num="16,17" />
                    <div className="btn m rm cm" data-num={16} />
                    <div className="btn h rb cm" data-num="16,17,18" />
                  </div>
                </div>
                {/* col7 */}
                <div className="col7">
                  <div className="row1">
                    <div className="btn v rm cv" data-num="18,21" />
                    <div className="btn m rm cm" data-num={21} />
                  </div>
                  <div className="row2">
                    <div className="btn c rh cv" data-num="17,18,20,21" />
                    <div className="btn v rm cv" data-num="17,20" />
                    <div className="btn h rh cm" data-num="20,21" />
                    <div className="btn m rm cm" data-num={20} />
                  </div>
                  <div className="row3">
                    <div className="btn c rh cv" data-num="16,17,19,20" />
                    <div className="btn v rm cv" data-num="16,19" />
                    <div className="btn c rb cv" data-num="16,17,18,19,20,21" />
                    <div className="btn h rh cm" data-num="19,20" />
                    <div className="btn m rm cm" data-num={19} />
                    <div className="btn h rb cm" data-num="19,20,21" />
                  </div>
                  <div className="row5">
                    <div className="btn ms2 rm cm" data-type="sector" data-sector={10} />
                  </div>
                </div>
                {/* col8 */}
                <div className="col8">
                  <div className="row1">
                    <div className="btn v rm cv" data-num="21,24" />
                    <div className="btn m rm cm" data-num={24} />
                  </div>
                  <div className="row2">
                    <div className="btn c rh cv" data-num="20,21,23,24" />
                    <div className="btn v rm cv" data-num="20,23" />
                    <div className="btn h rh cm" data-num="23,24" />
                    <div className="btn m rm cm" data-num={23} />
                  </div>
                  <div className="row3">
                    <div className="btn c rh cv" data-num="19,20,22,23" />
                    <div className="btn v rm cv" data-num="19,22" />
                    <div className="btn c rb cv" data-num="19,20,21,22,23,24" />
                    <div className="btn h rh cm" data-num="22,23" />
                    <div className="btn m rm cm" data-num={22} />
                    <div className="btn h rb cm" data-num="22,23,24" />
                  </div>
                </div>
                {/* col9 */}
                <div className="col9">
                  <div className="row1">
                    <div className="btn v rm cv" data-num="24,27" />
                    <div className="btn m rm cm" data-num={27} />
                  </div>
                  <div className="row2">
                    <div className="btn c rh cv" data-num="23,24,26,27" />
                    <div className="btn v rm cv" data-num="23,26" />
                    <div className="btn h rh cm" data-num="26,27" />
                    <div className="btn m rm cm" data-num={26} />
                  </div>
                  <div className="row3">
                    <div className="btn c rh cv" data-num="22,23,25,26" />
                    <div className="btn v rm cv" data-num="22,25" />
                    <div className="btn c rb cv" data-num="22,23,24,25,26,27" />
                    <div className="btn h rh cm" data-num="25,26" />
                    <div className="btn m rm cm" data-num={25} />
                    <div className="btn h rb cm" data-num="25,26,27" />
                  </div>
                  <div className="row4">
                    <div className="btn ms4 rm cm" data-type="sector" data-sector={6} />
                  </div>
                  <div className="row5">
                    <div className="btn ms2 rm cm" data-type="sector" data-sector={11} />
                  </div>
                </div>
                {/* col10 */}
                <div className="col10">
                  <div className="row1">
                    <div className="btn v rm cv" data-num="27,30" />
                    <div className="btn m rm cm" data-num={30} />
                  </div>
                  <div className="row2">
                    <div className="btn c rh cv" data-num="26,27,29,30" />
                    <div className="btn v rm cv" data-num="26,29" />
                    <div className="btn h rh cm" data-num="29,30" />
                    <div className="btn m rm cm" data-num={29} />
                  </div>
                  <div className="row3">
                    <div className="btn c rh cv" data-num="25,26,28,29" />
                    <div className="btn v rm cv" data-num="25,28" />
                    <div className="btn c rb cv" data-num="25,26,27,28,29,30" />
                    <div className="btn h rh cm" data-num="28,29" />
                    <div className="btn m rm cm" data-num={28} />
                    <div className="btn h rb cm" data-num="28,29,30" />
                  </div>
                </div>
                {/* col11 */}
                <div className="col11">
                  <div className="row1">
                    <div className="btn v rm cv" data-num="30,33" />
                    <div className="btn m rm cm" data-num={33} />
                  </div>
                  <div className="row2">
                    <div className="btn c rh cv" data-num="29,30,32,33" />
                    <div className="btn v rm cv" data-num="29,32" />
                    <div className="btn h rh cm" data-num="32,33" />
                    <div className="btn m rm cm" data-num={32} />
                  </div>
                  <div className="row3">
                    <div className="btn c rh cv" data-num="28,29,31,32" />
                    <div className="btn v rm cv" data-num="28,31" />
                    <div className="btn c rb cv" data-num="28,29,30,31,32,33" />
                    <div className="btn h rh cm" data-num="31,32" />
                    <div className="btn m rm cm" data-num={31} />
                    <div className="btn h rb cm" data-num="31,32,33" />
                  </div>
                  <div className="row5">
                    <div className="btn ms2 rm cm" data-type="sector" data-sector={12} />
                  </div>
                </div>
                {/* col12 */}
                <div className="col12">
                  <div className="row1">
                    <div className="btn v rm cv" data-num="33,36" />
                    <div className="btn m rm cm" data-num={36} />
                  </div>
                  <div className="row2">
                    <div className="btn c rh cv" data-num="32,33,35,36" />
                    <div className="btn v rm cv" data-num="32,35" />
                    <div className="btn h rh cm" data-num="35,36" />
                    <div className="btn m rm cm" data-num={35} />
                  </div>
                  <div className="row3">
                    <div className="btn c rh cv" data-num="31,32,34,35" />
                    <div className="btn v rm cv" data-num="31,34" />
                    <div className="btn c rb cv" data-num="31,32,33,34,35,36" />
                    <div className="btn h rh cm" data-num="34,35" />
                    <div className="btn m rm cm" data-num={34} />
                    <div className="btn h rb cm" data-num="34,35,36" />
                  </div>
                </div>
                {/* col13 */}
                <div className="col13">
                  <div className="row1">
                    <div className="btn m rm cm" data-type="sector" data-sector={1} />
                  </div>
                  <div className="row2">
                    <div className="btn m rm cm" data-type="sector" data-sector={2} />
                  </div>
                  <div className="row3">
                    <div className="btn m rm cm" data-type="sector" data-sector={3} />
                  </div>
                </div>
              </div>
            </div>
            Your bets:
            <div style={{width: '400px'}}>
              <button onclick="Place()">Place bet</button>
              <button onclick="Reset()">Reset</button>
              <div id="bets" style={{float: 'left', width: '200px', height: '150px', overflowY: 'scroll'}} />
              <div id="balance" style={{float: 'left', width: '200px'}}>Balance: 1.00 ETH</div><br />
              <div id="result" style={{float: 'left', width: '200px'}} /><br />
            </div>
          </div>
        );
      }
    

} export default RouleteTable;