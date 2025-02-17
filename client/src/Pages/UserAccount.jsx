import React from 'react';
import styles from '../styles/UserAccount.module.css';
import { BsFillBagCheckFill , BsFillChatTextFill , BsFillGeoAltFill , BsFillPersonFill} from "react-icons/bs";
import CustomerOrders from '../components/CustomerOrders';
import CustomerOrderHistory from '../components/CustomerOrderHistory';
import CustomerSupport from '../components/CustomerSupport';
import Addresses from '../components/Addresses';
import RegisterSeller from '../components/seller/registerSeller';
import { useDispatch, useSelector } from 'react-redux';
import { userLogout } from '../Redux/UserAuth/userAuth.actions';
import { addToCart } from '../Redux/Cart/cart.actions';
const arr = JSON.parse(localStorage.getItem("orderItem")) || [];

function UserAccount() {

console.log(
    arr
)

    const dispatch = useDispatch();

    // const handleLogout = () => {
    //     localStorage.setItem("userInfoF",null);
    //     dispatch(userLogout());
    //     dispatch(addToCart([]));
    //     localStorage.removeItem("address");
    //     localStorage.removeItem("orderItem");
    //     window.location.reload()
    //   }


      const handleLogout = () => {
        // Clear all stored user data
        localStorage.clear();
    
        // Dispatch logout actions
        dispatch(userLogout());
        dispatch(addToCart([]));
    
        // Redirect to login page
        window.location.href = "/";  
    };

    const userData = useSelector((store) => {
        return store.userAuthReducer.user
    })

    console.log(userData,"uer")

    function openList(listName) {
        // console.log(listName)
        var i;
        var x = document.getElementsByClassName("city");
        for (i = 0; i < x.length; i++) {
          x[i].style.display = "none";  
        }
        document.getElementById(listName).style.display = "block";  
    }
  return (
    <div className={styles.userMain} >
        <div>
            <div className={styles.accountDiv} >
                <div className={styles.accountLeft} >
                    <div>
                        <div className={styles.first} >
                            <div className={styles.myAccount}><p>My Account</p></div>
                            <div className={styles.emailText}><p>{userData.email}</p></div>
                        </div>
                        <div className={styles.second} >
                            <ul>
                                <li onClick={() => openList("Order")}><BsFillBagCheckFill/>Orders</li>
                                <li onClick={() => openList("CustomerSupport")}><BsFillChatTextFill/>Customer Support</li>
                                <li onClick={() => openList("Address")}><BsFillGeoAltFill/>Addresses</li>
                                <li onClick={() => openList("order-history")}><BsFillPersonFill/>Order History</li>
                                <li onClick={() => openList("RegisterSeller")}><BsFillPersonFill/>Become A Seller</li>
                            </ul>
                        </div>
                        <div className={styles.third} >
                            <button onClick={handleLogout} >Log Out</button>
                        </div>
                    </div>
                </div>
                <div className={styles.accountRight} >
                    <div id="Order" class="w3-container city">
                        <CustomerOrders/>
                    </div>
                
                    <div id="CustomerSupport" class="w3-container city" style={{display:"none"}}>
                        <CustomerSupport/>
                    </div>
                
                    <div id="Address" class="w3-container city" style={{display:"none"}}>
                        <Addresses/>
                    </div>

                    <div id="order-history" class="w3-container city" style={{display:"none"}}>
                        <CustomerOrderHistory/>
                    </div>

                    <div id="RegisterSeller" class="w3-container city" style={{display:"none"}}>
                        <RegisterSeller/>
                    </div>

                </div>
            </div>
        </div>
    </div>
  )
}

export default UserAccount