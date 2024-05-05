const contractAddress = 'YOUR_CONTRACT_ADDRESS';
const abi = [ /* YOUR CONTRACT ABI HERE */ ];
const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
const contract = new web3.eth.Contract(abi, contractAddress);

async function createAccount() {
    const userName = document.getElementById('newUserName').value;
    await contract.methods.createAccount(userName).send({ from: 'YOUR_WALLET_ADDRESS' });
    alert('Account created successfully!');
}

async function addFriend() {
    const friendAddress = document.getElementById('friendAddress').value;
    const friendName = document.getElementById('friendName').value;
    await contract.methods.addFriend(friendAddress, friendName).send({ from: 'YOUR_WALLET_ADDRESS' });
    alert('Friend added successfully!');
}

async function sendMessage() {
    const messageContent = document.getElementById('messageContent').value;
    await contract.methods.sendMessage(messageContent).send({ from: 'YOUR_WALLET_ADDRESS' });
    alert('Message sent successfully!');
}

async function displayMessages() {
    const messages = await contract.methods.getMessages().call();
    const messageList = document.getElementById('messageList');
    messageList.innerHTML = '';
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.textContent = `${message.sender}: ${message.content}`;
        messageList.appendChild(messageElement);
    });
}

// Call displayMessages function when the page loads
window.addEventListener('load', displayMessages);
