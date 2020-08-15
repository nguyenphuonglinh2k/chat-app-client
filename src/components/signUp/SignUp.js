import React, { useState } from 'react';
import axios from 'axios';
import classNames from 'classnames';
import { useHistory } from "react-router-dom";
import { Container, Form, Label, Input, FormGroup, FormText } from 'reactstrap';

import Toast from '../Toast';

import 'bootstrap/dist/css/bootstrap.min.css';
import './SignUp.css';

function SignUp() {
    const [invalidValue, setInvalidValue] = useState({});
    const [ username, setUsername ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

    let history = useHistory();

    function onClickPostSignUp() {
        axios.post('http://localhost:5000/account/signup', {
            username,
            email,
            password
        }).then((res) => {
            setInvalidValue(() => res.data);

            if (res.data.message) {
                Toast.fire({
                    icon: 'success',
                    title: res.data.message
                });

                return history.push("/signin");
            }
        }).catch((err) => {
            console.log(err);
        });
    }

  return (
    <Container>
        <div className="SignUp card">
            <div className="bg-soft-primary">
                <div className="row">
                    <div className="col-7 col">
                        <div className=" p-4">
                            <h5>Free Register</h5>
                            <p>Get your free KiTo account now.</p>
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
                <Form>
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
                                This field is invalid
                            </FormText>
                        }
                    </FormGroup>
                    <FormGroup>
                        <Label for="inputName">Username</Label>
                        <Input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            id="inputName" 
                            placeholder="Enter your name" 
                            required
                            className={classNames({ 'invalid-border': invalidValue.username })}
                        />
                        { invalidValue.username && 
                            <FormText>
                                This field is invalid
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
                            placeholder="Enter your password at least 4 characters" 
                            required
                            className={classNames({ 'invalid-border': invalidValue.password })}
                        />
                        { invalidValue.password && 
                            <FormText>
                                This field is invalid
                            </FormText>
                        }
                    </FormGroup>
                    <div className="mt-4">
                        <button onClick={onClickPostSignUp} className="btn btn-primary btn-block waves-effect waves-light" type="button">Register</button>
                    </div>
                    <div className="mt-4 text-center">
                        <p>Already have an account? <a className="font-weight-medium" href="/signin"> Login</a> </p>
                    </div>
                </Form>
            </div>
        </div>
    </Container>
  );
}

export default SignUp;
