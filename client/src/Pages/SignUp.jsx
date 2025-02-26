import { 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup,
    fetchSignInMethodsForEmail
} from '@firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import styles from '../styles/SignUp.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userLogin } from '../Redux/UserAuth/userAuth.actions';
import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const provider = new GoogleAuthProvider();

    // Function to save user details in Firestore
    const saveUserToFirestore = async (user) => {
        try {
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email || null,
                phone: user.phoneNumber || null,
                role: "customer", // Default role
                createdAt: new Date()
            });
        } catch (err) {
            console.error("Error saving user to Firestore:", err);
        }
    };

    // Signup function (Email + Password)
    const signUp = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("All fields are required!");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Invalid email address!");
            return;
        }

        if (password.length < 7) {
            setError("Password must be at least 7 characters long!");
            return;
        }

        setLoading(true);
        try {
            // Check if the user already exists
            const signInMethods = await fetchSignInMethodsForEmail(auth, email);
            if (signInMethods.length > 0) {
                // User already exists
                toast.error("User  already exists. Please log in instead.");
                setLoading(false);
                return;
            }

            // Create new user
            const res = await createUserWithEmailAndPassword(auth, email, password);

            // Save user role to Firestore
            await saveUserToFirestore(res.user);

            dispatch(userLogin(res.user));
            localStorage.setItem("userInfoF", JSON.stringify(res.user));
            localStorage.setItem("customerEmail", email);
            toast.success("Signup Successful!");

            navigate('/');
        } catch (error) {
            toast.warn("Signup Failed!", error.message);
            setError(error.message);
        }
        setLoading(false);
    };

    const saveUserToBackend = async (user) => {
        try {
            const response = await fetch("http://localhost:8081/api/customers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    customerName: user.displayName || user.email.split("@")[0], // Extract name from Google or email
                    customerEmail: user.email
                })
            });
    
            if (!response.ok) {
                throw new Error("Failed to save user to backend");
            }
        } catch (err) {
            console.error("Error saving user to backend:", err);
        }
    };

    // Google Signup
    const handleGoogle = async () => {
        try {
            let res = await signInWithPopup(auth, provider);
            
            // Save user details to Firestore and Backend
            await saveUserToFirestore(res.user);
            await saveUserToBackend(res.user);

            dispatch(userLogin(res.user));
            localStorage.setItem("userInfoF", JSON.stringify(res.user));
            localStorage.setItem("customerEmail", res.user.email);
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={styles.container}>
            {isLoading ? <div>Loading...</div> :
                <form onSubmit={signUp}>
                    <h1>Sign Up</h1> 

                    <input 
                        className={styles.Input} 
                        type="email" 
                        placeholder="Enter your email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />

                    <input 
                        className={styles.Input} 
                        type="password" 
                        placeholder="Enter your password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />

                    {error && <div className={styles.error}>{"* "}{error}</div>}

                    <div className={styles.signupBox}>
                        <p>Already a User? <Link to='/login'>Login</Link></p>
                    </div>

                    <button type="submit" className={styles.signupbtn}>Sign Up</button>

                    <div>
                        <h1 className='text-[18px] font-semibold mt-2'>Or</h1>
                    </div>

                    <button onClick={handleGoogle} type="button" className={styles.signGoogle}>
                        Sign Up with Google <FcGoogle className='text-[21px]'/>
                    </button>
                </form>
            }
        </div>
    );
}

export default SignUp;