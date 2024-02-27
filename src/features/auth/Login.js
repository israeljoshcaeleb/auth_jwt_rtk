
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLoginMutation } from './authApiSlice'
import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'

const Login = () => {
    const userRef = useRef()
    const errRef = useRef()
    const [user, setUser] = useState('')
    const [pwd, setPwd] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const navigate = useNavigate()

    const [login, {isLoading}] = useLoginMutation()
    const dispatch = useDispatch()

    useEffect(() => {
        userRef.current.focus()
    },[])

    useEffect(()=>{
        setErrMsg('')
    },[user, pwd])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const userData = await login({user, pwd}).unwrap()
            dispatch(setCredentials({...userData, user}))
            setUser('')
            setPwd('')
            navigate('/welcome')
        }catch (err){
            console.log(err)
            if(!err.originalStatus){
                setErrMsg('No Server Response')
            }else if(err.originalStatus === 400){
                setErrMsg('Missing username or password')
            }else if(err.originalStatus === 401){
                setErrMsg('Unauthorized')
            }else{
                setErrMsg('Login Failed')
            }
            
            errRef.current.focus()
        }
    }
    const handleUserInput = (e) => setUser(e.target.value)
    const handlePwdInput = (e) => setPwd(e.target.value)

    const content = isLoading ? <h1>Loading...</h1> :(
        <section className='login'>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live='assertive'>{errMsg}</p>
            <h1>Employee Login</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor='username'>Username:</label>
                <input 
                type='text'
                id='username'
                value={user}
                ref={userRef}
                autoComplete='off'
                required
                onChange={handleUserInput}
                />
                <label htmlFor='password'>Password:</label>
                <input 
                type='password'
                id='password'
                onChange={handlePwdInput}
                value={pwd}
                required
                />
                <button>Sign In</button>
            </form>
        </section>
    )
  return content
}

export default Login