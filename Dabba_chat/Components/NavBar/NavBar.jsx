import { useState, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChatAppContext } from "../../Context/ChatAppContext";
import Style from "./NavBar.module.css";
import images from "../../assets";

const NavBar = () => {
    const menuItems = [
        {
            menu: "All Users",
            link: "alluser"
        },
        {
            menu: "CHAT",
            link: "/"
        },
        {
            menu: "CONTACT",
            link: "alluser"
        },
        {
            menu: "SETTING",
            link: "/"
        },
        {
            menu: "FAQS",
            link: "/"
        },
        {
            menu: "TERMS OF USE",
            link: "/"
        }
    ];

    // Use State
    const [active, setActive] = useState(2);
    const [open, setOpen] = useState(false);
    const [openModel, setOpenModel] = useState(false);

    const { account, userName, connectWallet, createAccount, error } = useContext(ChatAppContext);

    return (
        <div className={Style.NavBar}>
            <div className={Style.NavBar_box}></div>
            <div className={Style.NavBar_box_left}>
                <Image src={images.logo} alt="logo" width={50} height={50} />
            </div>
            <div className={Style.NavBar_box_right}>
                {/* DESKTOP */}
                <div className={Style.NavBar_box_right_menu}>
                    {menuItems.map((el, i) => (
                        <div
                            onClick={() => setActive(i + 1)}
                            key={i+1}
                            className={`${Style.NavBar_box_right_menu_items}${active == i + 1 ? Style.active_btn : ""}`}
                        >
                            <Link className={Style.mobile_menu_items_link} href={el.link}>
                                {el.menu}
                            </Link>
                        </div>
                    ))}
                    <p className={Style.mobile_menu_btn}>
                        <Image
                            src={images.close}
                            alt="close"
                            width={50}
                            height={50}
                            onClick={() => setOpen(false)}
                        />
                    </p>
                </div>

                {/* MOBILE */}
                {open && (
                    <div className={Style.mobile_menu}>
                        {/* Connect Wallet */}
                        <div className={Style.NavBar_box_right_connect}>
                            {account == "" ? (
                                <button onClick={() => connectWallet()}>
                                    <span>Connect Wallet</span>
                                </button>
                            ) : (
                                <button onClick={() => setOpenModel(true)}>
                                    <Image
                                        src={userName ? images.accountName : images.create2}
                                        alt="Account image"
                                        width={20}
                                        height={20}
                                    />
                                    {''}
                                    <small>{userName || "Create Account"}</small>
                                </button>
                            )}
                        </div>

                        <div
                            className={Style.NavBar_box_right_open}
                            onClick={() => setOpen(true)}
                        >
                            <Image
                                src={images.open}
                                alt="open"
                                width={30}
                                height={30}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/*MODEL COMPONENT */}
            {openModel && (
              <div className={Style.modelBox}>
                <Model openModel = {setOpenModel}
                  title = "Welcome to"
                  head = "Chat Buddy"
                  info = 'XXXXXX'
                  smallInfo = "KIndly select your name..."
                  images = {images.hero}
                  functionName = {createAccount}
                    
                  />
              </div>
            )}
            {error === "" ? "" : <Error error={error.message} />}
        </div>
    );
};

export default NavBar;
