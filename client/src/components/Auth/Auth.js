import React, {useState} from 'react'
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import LockOutLinedIcon from '@material-ui/icons/LockOpenOutlined';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom';
import Input from './Input';
import useStyles from "./styles"
import {signin, signup} from '../../actions/auth'

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }

const Auth = ()=> {
    const classes = useStyles();
    const [showPassword, SetShowPassword] =useState(false);
    const [isSignup,setIsSignup]= useState(false);
    const dispatch = useDispatch();
    const [formData, setFormData] =useState(initialState);
    const history = useHistory();
    const handleShowPassword =() => SetShowPassword((prevShowPassword) => !prevShowPassword);

    const handleSubmit = (e) => {
      e.preventDefault();

      if(isSignup){
        dispatch(signup(formData, history));
      }
      else{
        dispatch(signin(formData, history));
      }
    };

    const handleChange = (e)=> {
      setFormData({ ...formData, [e.target.name] : e.target.value});
    };

    const switchMode = () => {
     setIsSignup((previsSignup) => !previsSignup);
     SetShowPassword(false);
    };
 
    const googleSuccess = async(res) => {
      const token = res?.credential;
      const result= JSON.parse(atob(token.split('.')[1]));
      

      try {
        dispatch({ type:'AUTH', data: { token,result } });

        history.push('/')
      } catch (error) {
        console.log(error);
      }
    };

    const googleFailure = (error) => {
   console.log(error);
    }

    return(
    <Container compound="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
           <LockOutLinedIcon />
        </Avatar>
        <Typography variant='h5'>{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
             {
                isSignup && (
                    <>
                     <Input name='firstName' label="First Name"  handleChange={handleChange} half autoFocus  />    
                     <Input name='lastName' label="Last Name"  handleChange={handleChange} half />
                    </>
                )}
            <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
            <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
            { isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password"  /> }
          </Grid>
          <Button type='submit' fullWidth variant="contained" color="primary" className={classes.submit} >
            {isSignup ? 'Sign Up' : 'Sign In'}
          </Button>
          <GoogleOAuthProvider clientId='132182658038-b9832ojl3nadm4m4dlltb9lqghi59not.apps.googleusercontent.com'>
            <GoogleLogin 
            onSuccess={googleSuccess}
            onError={googleFailure}            
            />
          </GoogleOAuthProvider>
          <Grid container justifyContent="flex-end">
               <Grid item>
                  <Button onClick={switchMode} >
                    {isSignup ? 'Already have an account ? SignIn' : "Don't have an account? SignUp "}
                  </Button>
               </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
    )
}

export default Auth