// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address newCampaign = address (new Campaign(minimum, msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public apporversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }


    constructor(uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable{
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        apporversCount++;
    }

    function createRequest(string memory description, uint value, address payable recipient) public restricted{
        uint numRequests = requests.length;
        requests.push();
        Request storage newRequest = requests[numRequests];
        newRequest.description= description;
        newRequest.value= value;
        newRequest.recipient= recipient;
        newRequest.complete= false;
        newRequest.approvalCount= 0; 
        
    }

    
    function approveRequest(uint index) public{
        Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;

    }

    function finalizeRequest(uint index) public payable restricted {
        Request storage request = requests[index];
        
        require(request.approvalCount > (apporversCount / 2));
        require(!request.complete);

        request.recipient.transfer(request.value);
        request.complete = true;

    }

    function getSummary() public view returns (
        uint, uint, uint, uint, address
    ) {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            apporversCount,
            manager
        );
    }

    function getRequestCount() public view returns (uint) {
        return requests.length;
    }

}