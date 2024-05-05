const contractAddress = '0xf8e81D47203A594245E36C48e151709F0C19fBe8';
const abi = [ /Users/devchaudhari/Desktop/xyz/ABI.json ];
const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
const contract = new web3.eth.Contract(abi, contractAddress);

async function createAccount() {
    const userName = document.getElementById('newUserName').value;
    await contract.methods.createAccount(userName).send({ from: 0x8E3308Aadddc44dFd1A9aA2A493186f5FeF2400b });
    alert('Account created successfully!');
}

async function addFriend() {
    const friendAddress = document.getElementById('friendAddress').value;
    const friendName = document.getElementById('friendName').value;
    await contract.methods.addFriend(friendAddress, friendName).send({ from: 0x8E3308Aadddc44dFd1A9aA2A493186f5FeF2400b });
    alert('Friend added successfully!');
}

async function sendMessage() {
    const messageContent = document.getElementById('messageContent').value;
    await contract.methods.sendMessage(messageContent).send({ from: 0x8E3308Aadddc44dFd1A9aA2A493186f5FeF2400b });
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
