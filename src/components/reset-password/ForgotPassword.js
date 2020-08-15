import React, {useState} from 'react';
import axios from 'axios';
import classNames from 'classnames';
import { Container, Form, Label, Input, FormGroup, FormText } from 'reactstrap';

import Toast from '../Toast';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../signUp/SignUp.css';

function ForgotPassword() {
    const [ email, setEmail ] = useState('');
    const [invalidValue, setInvalidValue] = useState({});

    function onClickPostResetPassword() {
        axios.post('http://localhost:5000/account/forgot-password', {
            email
        }).then((res) => {
            setInvalidValue(() => res.data);

            if (res.data.message) {
                Toast.fire({
                    icon: 'success',
                    title: res.data.message
                });
            }

            console.log(res.data);
        }).catch((err) => {
            console.log(err);
        });
    }

  return (
    <Container>
        <div className="ResetPassword card">
            <div className="bg-soft-primary">
                <div className="row">
                    <div className="col-7 col">
                        <div className=" p-4">
                            <h5>Welcome Back !</h5>
                            <p>Reset password to continue to TiKo.</p>
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
                                { invalidValue.emailMessage }
                            </FormText>
                        }       
                    </FormGroup>
                    <div className="mt-4">
                        <button 
                            onClick={onClickPostResetPassword}
                            className="btn btn-primary btn-block waves-effect waves-light" 
                            type="button"
                        >
                            Reset
                        </button>
                    </div>
                    <div className="mt-4 text-center">
                        <p>Go back to<a className="font-weight-medium" href="/signin"> Login</a> </p>
                    </div>
                </Form>
            </div>
        </div>
    </Container>
  );
}

export default ForgotPassword;