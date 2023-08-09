import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'

function Signup() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('employee')
    const [message, setMessage] = useState('')

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post('http://localhost:3001/register', {username, password, role})
        .then(result => {
            setMessage('ลงทะเบียนผู้ใช้งานสำเร็จ')
        })
        .catch(err => {
            if(err.response && err.response.data && err.response.data.message) {
                setMessage(err.response.data.message);
            }
            else {
                setMessage('เกิดข้อผิดพลาดในการลงทะเบียน')
            }
        })
    }

    return (
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username">
                            <strong>Username</strong>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Username"
                            autoComplete="off"
                            name="username"
                            className="form-control rounded-0"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password">
                            <strong>Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            className="form-control rounded-0"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="role">
                            <strong>Role</strong>
                        </label>
                        <select
                            name="role"
                            className="form-control rounded-0"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="employee">Employee</option>
                            <option value="boss">Boss</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-0">
                        Register
                    </button>
                </form>
                <p>{message}</p>
            </div>
        </div>
    );
}

export default Signup;






// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from 'axios';

// const Signup = ({ onLogin }) => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [role, setRole] = useState('employee')
//     const [message, setMessage] = useState('');

//     const navigate = useNavigate();

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         axios.post('http://localhost:3001/register', { username, password, role })
//                     .then(result => {
//             setMessage('ลงทะเบียนผู้ใช้งานสำเร็จ')
//             navigate('/login') 
//         })
//             .catch(err => {
//                 if (err.response && err.response.data && err.response.data.message) {
//                     setMessage(err.response.data.message);
//                 } else {
//                     setMessage('เกิดข้อผิดพลาดในการลงทะเบียน');
//                 }
//             });
//     };

//     return (
//         <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
//             <div className="bg-white p-3 rounded w-25">
//                 <h2>Signup</h2>
//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-3">
//                         <label htmlFor="username">
//                             <strong>Username</strong>
//                         </label>
//                         <input
//                             type="text"
//                             placeholder="Enter Username"
//                             autoComplete="off"
//                             name="username"
//                             className="form-control rounded-0"
//                             onChange={(e) => setUsername(e.target.value)}
//                         />
//                     </div>
//                     <div className="mb-3">
//                         <label htmlFor="password">
//                             <strong>Password</strong>
//                         </label>
//                         <input
//                             type="password"
//                             placeholder="Enter Password"
//                             name="password"
//                             className="form-control rounded-0"
//                             onChange={(e) => setPassword(e.target.value)}
//                         />
//                     </div>
//                     <div className="mb-3">
//                         <label htmlFor="role">
//                             <strong>Role</strong>
//                         </label>
//                         <select
//                             name="role"
//                             className="form-control rounded-0"
//                             value={role}
//                             onChange={(e) => setRole(e.target.value)}
//                         >
//                             <option value="employee">Employee</option>
//                             <option value="boss">Boss</option>
//                         </select>
//                     </div>
//                     <button type="submit" className="btn btn-success w-100 rounded-0">
//                         Register
//                     </button>
//                 </form>
//                 <p>{message}</p>
//             </div>
//         </div>
//     );
// };

// export default Signup;

