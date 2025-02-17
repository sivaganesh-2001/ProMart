import React, { useState } from 'react';
import styles from '../styles/Login.module.css';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from '@firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userLogin } from '../Redux/UserAuth/userAuth.actions';
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const provider = new GoogleAuthProvider();
    
    const validateForm = () => {
        if (!email || !password) {
            setError("Please fill all the credentials!");
            return false;
        } 
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Invalid Email address!!");
            return false;
        } 
        if (password.length < 7) {
            setError("Password must be at least 7 characters!");
            return false;
        }
        return true;
    };

    const getUserRoleAndNavigate = async (user) => {
        try {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                dispatch(userLogin(userData));
                localStorage.setItem("userInfoF", JSON.stringify(userData));
                console.log(userData);

                // Save the email of the seller
            if (userData.role === "seller") {
                localStorage.setItem("sellerEmail", userData.email); // Save email to localStorage
            }

            // Save the email of the seller
            if (userData.role === "customer") {
                localStorage.setItem("customerEmail", userData.email); // Save email to localStorage
            }

            if(userData.role==="admin"){
                localStorage.setItem("adminEmail",userData.email);
            }


                // Redirect based on role
                if (userData.role === "customer") {
                    navigate("/");
                } else if (userData.role === "seller") {
                    navigate("/dashboard");
                }
                else if(userData.role==="admin"){
                    navigate("/admin-dashboard");
                } 
                else {
                    navigate("/"); // Default route
                }

                toast.success("Login Successful!");
            } else {
                setError("User not found in database!");
            }
        } catch (error) {
            console.error("Error fetching user role:", error);
            setError("Failed to get user role!");
        }
    };

    const signin = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!validateForm()) return;
        
        setLoading(true);
        try {
            const res = await signInWithEmailAndPassword(auth, email, password);
            await getUserRoleAndNavigate(res.user);
        } catch (error) {
            toast.warn("SignIn Failed! " + error.message);
            setError(error.message);
        }
        setLoading(false);
    };

    const handleGoogle = async () => {
        try {
            let res = await signInWithPopup(auth, provider);
            await getUserRoleAndNavigate(res.user);
        } catch (error) {
            toast.error("Google Sign-In Failed!");
        }
    };

    return (
        <div className={styles.container}>
            {isLoading ? <div>Loading!!</div> :
                <form onSubmit={signin}>
                    <h1>Login</h1>
                    
                    <input className={styles.Input}
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required />

                    <input className={styles.Input} 
                        type="password" 
                        placeholder="Enter your password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        required />

                    {error && (
                        <div className={styles.error}>* {error}</div>
                    )}

                    <div className={styles.signupBox}>
                        <p>New User? <Link to='/signup'>Sign Up</Link></p>
                    </div>

                    <button type="submit" className={styles.signupbtn}>Sign In</button>

                    <div>
                        <h1 className='text-[18px] font-semibold mt-2'>Or</h1>
                    </div>

                    <button onClick={handleGoogle} type="button" className={styles.signGoogle}>
                        Login with Google <FcGoogle className='text-[21px]' />
                    </button>
                </form>
            }
        </div>
    );
}

export default Login;
