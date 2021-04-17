pragma solidity ^0.8.0;

import "../ethereum-api/provableAPI.sol";

contract getApi is usingProvable{
    
    function getData() payable {
       if (provable_getPrice("URL") > this.balance) {
           LogNewProvableQuery("Provable query was NOT sent, please add some ETH to cover for the query fee");
       } else {
           LogNewProvableQuery("Provable query was sent, standing by for the answer..");
           provable_query("URL", "json(https://fly.sportsdata.io/v3/nba/stats/json/AllStars/2021)");
       }
   }
}