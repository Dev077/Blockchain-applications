

// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 < 0.9.0;

contract ChatApp {

    struct User {
        string name;
        mapping(address => Friend) friendslist;
        address[] friendAddresses;
    }
    
    struct Message {
        address sender;
        string content;
        uint256 timestamp;
    }

    struct Friend {
        address friendAddress;
        string name;
    }

    struct AllUsers {
        address userAddress;
        string name;
    } 

    AllUsers[] public allusers;
    Message[] public messages;
    mapping(address => User) public users;
    mapping(bytes32 => Message[]) public chatHistory;

    function sendMessage(string memory content) public {
        messages.push(Message(msg.sender, content, block.timestamp));
    }

    function getMessages() public view returns (Message[] memory) {
        return messages;
    }

    function checkIfUserExists(address pkey) public view returns (bool) {
        return bytes(users[pkey].name).length > 0;
    }

    function createAccount(string calldata name) external {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(!checkIfUserExists(msg.sender), "User already exists");
        
        users[msg.sender].name = name;
        allusers.push(AllUsers(msg.sender, name));
    }

    function getUserName(address pkey) public view returns (string memory) {
        require(checkIfUserExists(pkey), "User is not registered");
        return users[pkey].name;
    }

    function addFriend(address friendAddress, string calldata name) external {
        require(checkIfUserExists(msg.sender), "Create an account first");
        require(checkIfUserExists(friendAddress), "User is not registered");
        require(msg.sender != friendAddress, "User cannot add themselves as a friend");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(users[msg.sender].friendAddresses.length < 10, "Maximum number of friends reached");
        require(users[msg.sender].friendslist[friendAddress].friendAddress == address(0), "User is already a friend");

        users[msg.sender].friendslist[friendAddress] = Friend(friendAddress, name);
        users[msg.sender].friendAddresses.push(friendAddress);
    }

    function getFriendsList() external view returns (Friend[] memory) {
        address[] memory friendAddresses = users[msg.sender].friendAddresses;
        Friend[] memory friends = new Friend[](friendAddresses.length);
        for (uint256 i = 0; i < friendAddresses.length; i++) {
            friends[i] = users[msg.sender].friendslist[friendAddresses[i]];
        }
        return friends;
    }

    function sendMessageToFriend(address friendAddress, string calldata content) external {
        require(checkIfUserExists(msg.sender), "Create an account first");
        require(checkIfUserExists(friendAddress), "User is not registered");
        require(users[msg.sender].friendslist[friendAddress].friendAddress != address(0), "User is not a friend");
        
        bytes32 chatCode = getChatCode(msg.sender, friendAddress);
        Message memory newMessage = Message(msg.sender, content, block.timestamp);
        chatHistory[chatCode].push(newMessage);
        messages.push(newMessage);
    }

    function readMessages(address friendAddress) external view returns (Message[] memory) {
        bytes32 chatCode = getChatCode(msg.sender, friendAddress);
        return chatHistory[chatCode];
    }

    function getAllUsers() public view returns (AllUsers[] memory) {
        return allusers;
    }   
    
    function addUser(string memory name) public {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(users[msg.sender].friendAddresses.length == 0, "User already exists");
        
        users[msg.sender].name = name;
    }

    function getChatCode(address fA0, address fA1) internal pure returns (bytes32) {
        if (fA0 < fA1) {
            return keccak256(abi.encodePacked(fA0, fA1));
        } else {
            return keccak256(abi.encodePacked(fA1, fA0));
        }
    }
}
