import { useEffect } from "react"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axiosClient from "../axios-client"
import { useStateContext } from "../contexts/ContextProvider"

export default function userForm() {

    const {id} = useParams()
    const navigate = useNavigate()
    const {setNotification} =  useStateContext()
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState(null);
    const [user, setUser] = useState({
        id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    })

    if (id) {
        useEffect(() => {
            setLoading(true)
            axiosClient.get(`/users/${id}`)
            .then(({data}) => {
                setLoading(false)
                setUser(data)
            })
            .catch(() => {
                setLoading(false)
            })
        }, [])
    }

    const onSubmit = (ev) => {
        ev.preventDefault()

        if (id) {
            axiosClient.put(`/users/${user.id}`, user)
            .then(() => {
                setNotification("User successfully updated");
                navigate('/users')
            })
            .catch(err => {
                const response = err.response
                if (response && response.status == 422) {
                    setErrors(response.data.errors);
                }
            })
        }else{
            axiosClient.post(`/users`, user)
            .then(() => {
                setNotification("User successfully created");
                navigate('/users')
            })
            .catch(err => {
                const response = err.response
                if (response && response.status == 422) {
                    setErrors(response.data.errors);
                }
            })
        }
    }

    return(
        <div>
           {user.id &&
            <h1>Update {user.name} Profile</h1>
           }

           {!user.id &&
            <h1>New User</h1>
           }
           <div className="card animated fadeInDown">
            {loading && (
                <div className="text-center">Loading...</div>
            )}
            {errors &&
                <div className="alert">
                    {Object.keys(errors).map(key =>(
                        <p key={key}>{errors[key][0]}</p>
                    ))}

                </div>
            }
            {!loading &&
                <form onSubmit={onSubmit}>
                    <input value={user.name} onChange={ev => setUser( {...user, name: ev.target.value})} placeholder="Name" />
                    <input value={user.email} onChange={ev => setUser( {...user, email: ev.target.value})} placeholder="Email" />
                    <input type="password" onChange={ev => setUser( {...user, password: ev.target.value})} placeholder="Password" />
                    <input type="password" onChange={ev => setUser( {...user, password_confirmation: ev.target.value})} placeholder="Confirm the above Password" />
                    <button className="btn btn-block">Save</button>
                </form>
            }

           </div>
        </div>
    )
}
