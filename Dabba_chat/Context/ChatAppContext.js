import React, {useState, useEffect} from "react";
import {useRouter} from "next/router";

// INTERNAL IMPORT
import { checkIfWalletIsConnected, connectWallet, connectingWithContract } from "../Utils/apiFeature";
import { Contract } from "hardhat/internal/hardhat-network/stack-traces/model";

export const ChatAppContext = React.createContext();

export const ChatAppProvider = ({children}) => {
    //USESTATE
    const [account, setAccount] = useState("");
    const [userName, setUserName] = useState("");
    const [friendLists, setFriendLists] = useState([]);
    const [friendMsg, setFriendMsg] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userLists, setUserLists] = useState([]);
    const [error, setError] = useState("");

    //Chat User Data
    const [currentUserNames, setCurrentUserNames] = useState("");
    const [currentUserAddress, setCurrentUserAddress] = useState("");

    const router = useRouter();

    //fetch data time of page load
    const fetchData = async () => {
        try {
            //get contract
            const vcontract = await connectingWithContract();
            // get account
            const account = await connectWallet();
            setAccount(account);
            //get user name
            const userName = await vcontract.getUserName(account);
            setUserName(userName);
            //get friend list
            const friendLists = await vcontract.getFriendList();
            setFriendLists(friendLists);
            //get user list
            const userLists = await vcontract.getAllUsers();
            setUserLists(userLists);

        }
        catch (error) {
            setError("Please Install And Connect Your Digital Wallet")
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    //Read messages
    const readMsg = async (faddress) => {
        try {
            const vcontract = await connectingWithContract();
            const friendMsg = await vcontract.readMessages(faddress);
            setFriendMsg(friendMsg);
        }
        catch (error) {
            setError("Currently You Have no Messages")
        }
    };

    //account creation
    const createAccount = async (name, accountAddress) => {
        try {
            if(name || accountAddress)
                return setError("Name and Account Address is required");

            const vcontract = await connectingWithContract();
            const getCreatedUser = await vcontract.createAccount(name);
            setLoading(true);
            await getCreatedUser.wait();
            setLoading(false);
            window.location.reload();
        }
        catch (error) {
            setError("Error ehile creating the account. Please try again")
        }
    };

    // add your friends
    const addFriend = async (name, faddress) => {
        try {
            if(name || faddress)
                return setError("Name and Account Address is required");

            const vcontract = await connectingWithContract();
            const addFriend = await vcontract.addFriend(faddress,name);

            setLoading(true);
            await addFriend.wait();
            setLoading(false);
            router.push("/");
            window.location.reload();
        }
        catch (error) {
            setError("Error while adding friend. Please try again")
        }
    };

    //send messages
    const sendMsg = async ({faddress, message}) => {
        try {
            if(faddress || message)
                return setError("Please Type Your Message");

            const vcontract = await connectingWithContract();
            const sendMsg = await vcontract.sendMessageToFriend(faddress, message);

            setLoading(true);
            await sendMsg.wait();
            setLoading(false);
            window.location.reload();
        }
        catch (error) {
            setError("Error while sending message. Please try again")
        }
    };

    // read info
    const readUser = async (address) => {
        try {
            const vcontract = await connectingWithContract();
            const nameUser = await vcontract.getUserName(address);
            setCurrentUserNames(nameUser);
            setCurrentUserAddress(address);
        }

        catch (error) {
            setError("Error while reading user. Please try again")
        }
    };





    
    return (
        
        <ChatAppContext.Provider value ={{ readMsg, createAccount, addFriend, sendMsg, readUser, connectWallet, checkIfWalletIsConnected, account, userName, friendLists, friendMsg, loading, userLists, error, currentUserNames, currentUserAddress}}>
            {children}
        </ChatAppContext.Provider>
    );
};
