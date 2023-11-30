import React, { useState } from "react";
import './Signup.scss';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'

function Signup() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    // const [role, setRole] = useState('employee')
    const [message, setMessage] = useState('')

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:3001/register',
            {
                username, 
                password, 
                // role
            })
            .then(result => {
                setMessage('ลงทะเบียนผู้ใช้งานสำเร็จ')
            })
            .catch(err => {
                if (err.response && err.response.data && err.response.data.message) {
                    setMessage(err.response.data.message);
                }
                else {
                    setMessage('เกิดข้อผิดพลาดในการลงทะเบียน')
                }
            })
    }

    return (
        <div className="register">
            <div>
                <div className="title-register">Register</div>
                <form onSubmit={handleSubmit} className="register-form">
                    <label>Username</label>
                    <input
                        type="text"
                        placeholder="Enter Username"
                        name="username"
                        className="form-control"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Enter Password"
                        name="password"
                        className="form-control"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {/* <label htmlFor="role">
                        <strong>Role</strong>
                    </label>
                    <select
                        name="role"
                        className="form-control"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="employee">Employee</option>
                        <option value="boss">Boss</option>
                    </select> */}
                    <div className="error-form">{message}</div>
                    <button type="submit" className="button-register">
                        Register
                    </button>
                </form>
            </div>

        </div>
    );
}

export default Signup;