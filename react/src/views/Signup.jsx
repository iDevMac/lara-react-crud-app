import { useRef, useState } from "react";
import { Link } from "react-router-dom"
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function Signup(){
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmationRef = useRef();

    const [errors, setErrors] = useState(null);

    const {setUser, setToken} = useStateContext()

    const onSubmit = (e) => {
        e.preventDefault()

        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: passwordConfirmationRef.current.value,
        }

        console.log(payload)

        axiosClient.post('/signup', payload ).then(({data})=> {
            setUser(data.user)
            setToken(data.token)
        }).catch(err => {
            const response = err.response
            if (response && response.status == 422) {
                setErrors(response.data.errors);
            }
        })

    }

    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">Signup for Free</h1>
                    {errors && <div className="alert">
                        {Object.keys(errors).map(key =>(
                            <p key={key}>{errors[key][0]}</p>
                        ))}

                    </div>

                    }
                    <input ref={nameRef} placeholder="Fullname"/>
                    <input ref={emailRef} type="email" placeholder="Email"/>
                    <input ref={passwordRef} type="password" placeholder="Password"/>
                    <input ref={passwordConfirmationRef} type="password" placeholder="Confirm your Password"/>
                    <button className="btn btn-block">Sign Up</button>

                    <p className="message">
                        Already Registered? <Link to="/login">Login Here</Link>
                    </p>
                </form>
            </div>
        </div>
    )

}
