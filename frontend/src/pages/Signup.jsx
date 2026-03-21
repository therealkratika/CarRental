import {useForm} from 'react-hook-form';
import {Link, useNavigate} from 'react-router-dom';
import { AuthSDK } from '../Api/sdk';
import './Auth.css';
export default function Signup() {
  const{register,handleSubmit, setError, formState:{errors, isSubmitting}} = useForm();
  const navigate = useNavigate();
 const onSubmit = async(data)=>{
  if(data.password !== data.confirmPassword){
    setError('confirmPassword', {type:'manual', message:'Passwords do not match'});
    return;
  }
  try{
    await AuthSDK.signup({
  username: data.username,
  email: data.email,
  password: data.password
});
    navigate("/login");
  }catch(err){
    setError("root", {
        message: err.message || "Signup failed"
      });
  }
 };
  return (
    <div className='auth-wrapper'>
      <div>
        <div className='header'>
          <h2>Create your account to start</h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='auth-form'>
          <div className='details'>
            <label>Username</label>
            <input type = "text"
            {...register('username',{required: 'Username is required',})}
            />
            {errors.username && <p className='error'>{errors.username.message}</p>}
          </div>
          <div className='details'>
            <label>Email</label>
            <input type ="email"
             {...register("email",{
              required: "Email is required",
              pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Enter a valid email"
                }
             })}
            />
            {errors.email && <p className='error'>{errors.email.message}</p>}
          </div>
          <div className='details'>
            <label>Password</label>
             <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
            />
            {errors.password&&(
               <p className="auth-error">{errors.password.message}</p>
            )}
          </div>
          <div className="field">
            <label>Confirm Password</label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Please confirm your password"
              })}
            />
            {errors.confirmPassword && (
              <p className="auth-error">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          {errors.root && (
            <p className="auth-error">{errors.root.message}</p>
          )}
          <button
            type="submit"
            className="primary-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>
         <p className="switch-text">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}