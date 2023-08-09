import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import './Login.scss';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3001/login', { username, password })
      .then(result => {
        const { token } = result.data;
        if (token) {
          axios.post('http://localhost:3001/verify-token', { token })
            .then(response => {
              const { isValid, username } = response.data;
              if (isValid) {
                localStorage.setItem('token', token);
                localStorage.setItem('username', username);
                onLogin();
                navigate('/home', {state:{id:username}});
              } else {
                setMessage('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
              }
            })
            .catch(err => {
              setMessage('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
            });
        } else {
          setMessage('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
        }
      })
      .catch(err => {
        if (err.response && err.response.data && err.response.data.message) {
          setMessage(err.response.data.message);
        } else {
          setMessage('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
        }
      });
  };

     return(
        <div className="login">
            <div>
                <div className="title-login">LOGIN</div>
                <form onSubmit={handleSubmit}>
                    <div className="username">
                        <label>Username</label>
                        <input
                            type="text"
                            autoComplete="off"
                            name="username"
                            className="form-control"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="password">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="button-login">
                        LOGIN
                    </button>
                </form>
                <p>{message}</p>
            </div>
        </div>
    )
};

export default Login;





// import React, { useState } from "react";
// import './Login.scss';
// import { Link, useNavigate } from "react-router-dom";
// import axios from 'axios'

// const Login = ({onLogin}) => {
//     const [username, setUsername] = useState('')
//     const [password, setPassword] = useState('')
//     const [message, setMessage] = useState('')

//     const navigate = useNavigate()

//     const handleSubmit = (e) => {
//         e.preventDefault()
//         axios.post('http://localhost:3001/login', {username, password})
//         .then(result => {
//             const { token } = result.data;
//             if (token) {
//                 localStorage.setItem('token', token);
//                 onLogin();
//                 navigate('/home')
                
//             }
//         })
//         .catch(err => {
//             if(err.response && err.response.data && err.response.data.message) {
//                 setMessage(err.response.data.message);
//             }
//             else {
//                 setMessage('เกิดข้อผิดพลาดในการเข้าสู่ระบบ')
//             }
//         })
//     }

//     return(
//         <div className="login">
//             <div>
//                 <div className="title-login">LOGIN</div>
//                 <form onSubmit={handleSubmit}>
//                     <div className="username">
//                         <label>Username</label>
//                         <input
//                             type="text"
//                             autoComplete="off"
//                             name="username"
//                             className="form-control"
//                             onChange={(e) => setUsername(e.target.value)}
//                         />
//                     </div>
//                     <div className="password">
//                         <label>Password</label>
//                         <input
//                             type="password"
//                             name="password"
//                             className="form-control"
//                             onChange={(e) => setPassword(e.target.value)}
//                         />
//                     </div>
//                     <button type="submit" className="button-login">
//                         LOGIN
//                     </button>
//                 </form>
//                 <p>{message}</p>
//                 {/* <p>Already Have an Account</p>
//                 <Link to="/register" type="submit" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
//                     Register
//                 </Link> */}
//             </div>
//         </div>
//     )
// }

// export default Login;



// Login.jsx