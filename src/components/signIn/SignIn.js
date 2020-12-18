import React, {useState} from 'react';
import axios from 'axios';
import classNames from 'classnames';
import { useHistory } from "react-router-dom";
import { Container, Form, Label, Input, FormGroup, FormText } from 'reactstrap';

import Toast from '../Toast';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../signUp/SignUp.css';

function SignIn() {
    const [invalidValue, setInvalidValue] = useState({});
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

    let history = useHistory();

    function onKeyUp(e) {
        if (e.charCode === 13) 
            onClickPostSignIn()
    }

    function onClickPostSignIn() {
        axios.post('http://localhost:5000/account/signin', {
            email,
            password
        }).then((res) => {
            setInvalidValue(() => res.data);

            if (res.data.message) {
                Toast.fire({
                    icon: 'success',
                    title: res.data.message
                });

                localStorage.setItem('jwt', `Bear ${res.data.token}`);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                
                return history.push("/chat");
            }
        }).catch((err) => {
            console.log(err);
        });
    }

  return (
    <Container>
        <div className="Signin card">
            <div className="bg-soft-primary">
                <div className="row">
                    <div className="col-7 col">
                        <div className=" p-4">
                            <h5>Welcome Back !</h5>
                            <p>Sign in to continue to TiKo</p>
                        </div>
                    </div>
                    <div className="col-5 align-self-end col">
                        <img 
                            src="http://skote-v-light.react.themesbrand.com/static/media/profile-img.ba4e037e.png" 
                            alt="" 
                            className="img-fluid" 
                        />
                    </div>
                </div>
            </div>
            <div className="card-body">
                <div className="avatar-md rounded-circle bg-light mb-4">
                    <img 
                        src="http://skote-v-light.react.themesbrand.com/static/media/logo.4dbbacd2.svg" 
                        alt="" 
                        className="rounded-circle" 
                        height="34" 
                    />
                </div>
                <Form onKeyPress={onKeyUp}>
                    <FormGroup>
                        <Label for="exampleEmail">Email</Label>
                        <Input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="exampleEmail" 
                            placeholder="Enter your email" 
                            required
                            className={classNames({ 'invalid-border': invalidValue.email })}
                        />
                        { invalidValue.email && 
                            <FormText>
                                { invalidValue.emailMessage }
                            </FormText>
                        }
                    </FormGroup>
                    <FormGroup>
                        <Label for="examplePassword">Password</Label>
                        <Input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            id="examplePassword" 
                            placeholder="Enter your password" 
                            required
                            className={classNames({ 'invalid-border': invalidValue.password })}
                        />
                        { invalidValue.password && 
                            <FormText>
                                Password is wrong
                            </FormText>
                        }
                    </FormGroup>
                    <div className="mt-4">
                        <button
                            onClick={onClickPostSignIn}
                            className="btn btn-primary btn-block waves-effect waves-light" 
                            type="button"
                        >
                            Login
                        </button>
                    </div>
                    <div className="mt-4 text-center reset-password">
                        <p>
                            <a className="font-weight-medium" href="/forgot-password">
                                <img 
                                    src="https://cdn.glitch.com/af45ea57-cc17-431c-a29e-191393077cfe%2Ficons8-lock-26.png?v=1596445347871" 
                                    alt="" 
                                />   
                                Forgot your password?
                            </a>
                        </p>
                    </div>
                    <div className="mt-2 text-center">
                        <p>Don't have an account ? <a className="font-weight-medium text-primary" href="/signup"> Signup now </a> </p>     
                    </div>
                </Form>
            </div>
        </div>
    </Container>
  );
}

export default SignIn;
