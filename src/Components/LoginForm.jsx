import { useState, useRef, useEffect } from "react"
import formStyles from './LoginForm.module.css'
import users from '../utils/db.js'

function LoginForm() {

  const nameInputRef = useRef(null);

  useEffect(() => {
    nameInputRef.current.focus()
  }, [])

  const formInitialState = {
    user: "",
    email: "",
    password: ""
  };

  const errorsInitialState = {
    user: "",
    email: "",
    password: "",
    isValid: false
  };

  const [form, setForm] = useState(formInitialState);
  const [errors, setErrors] = useState(errorsInitialState);


  //* Validation of inputs
  const validateName = (form) => {

    const userNameRegex = /^[a-zA-Z0-9]{3,14}$/;

    if (userNameRegex.test(form.user)) {
      setErrors({
        ...errors,
        user: '',
        isValid: true
      })
    }

    if (!userNameRegex.test(form.user)) {
      setErrors({
        ...errors,
        user: '* only alphanumeric - 3:14 length ',
        isValid: false
      })
    }

    if (!form.user) {
      setErrors({
        ...errors,
        user: '* user name is required',
        isValid: false
      })
    }
  }

  const validateEmail = (form) => {

    const emailRegex = /^[a-zA-Z0-9._-]{3,20}@(mail|gmail|hotmail|yahoo)\.com$/;

    if (emailRegex.test(form.email)) {
      setErrors({
        ...errors,
        email: '',
        isValid: true
      })
    }

    if (!emailRegex.test(form.email)) {
      setErrors({
        ...errors,
        email: '* gmail | email | yahoo | hotmail .com',
        isValid: false
      })
    }

    if (!form.email) {
      setErrors({
        ...errors,
        email: '* email is required',
        isvlid: false
      })
    }
  }

  const validatePassword = (form) => {

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;

    if (passwordRegex.test(form.password)) {
      setErrors({
        ...errors,
        password: '',
        isValid: true
      })
    }

    if (!passwordRegex.test(form.password)) {
      setErrors({
        ...errors,
        password: '* [8:15] alphanumeric - at least 1 [@$!%*?&] and 1 uppercase letter',
        isValid: false
      })
    }

    if (!form.password) {
      setErrors({
        ...errors,
        password: '* password is required',
        isValid: false
      })
    }
  }

  //* Tracking form input changes and running validations
  const handleFormChange = (e) => {

    let { name, value } = e.target;
    name === 'user' && validateName({
      ...form,
      [name]: value
    })
    name === 'email' && validateEmail({
      ...form,
      [name]: value
    })
    name === 'password' && validatePassword({
      ...form,
      [name]: value
    })

    setForm({
      ...form,
      [name]: value
    })
  }

  // Matching user inputs with the mocked db data
  const checkLoginSuccess = () => {

    let msg = 'Logged In Successfully';
    let isLogged = false;

    const foundUser = users.find(u => u.user === form.user)
    if (!foundUser) {
      msg = `${form.user} is not a registered user`
    }
    else {
      const isValidData = foundUser.password === form.password && foundUser.email === form.email
      if (!isValidData) {
        msg = "Wrong email or password"
      }
      else {
        isLogged = true;
      }
    }

    return { msg, isLogged };
  }


  // Submitting form based on checkLoginSuccess output
  const handleSumbit = (e) => {

    e.preventDefault();

    if (checkLoginSuccess().isLogged) {
      setForm(formInitialState);
      return alert(checkLoginSuccess().msg)
    }

    else {
      return alert(checkLoginSuccess().msg)
    }
  }



  return (
    <>
      <div className={formStyles.formContainer}>
        <p className={formStyles.mainTitle}>SIGN IN</p>
        <form onSubmit={handleSumbit}>
          <div className="userName">
            <label htmlFor="user">User Name</label>
            <br />
            <input
              name="user"
              ref={nameInputRef}
              autoComplete="off"
              type="text"
              onChange={handleFormChange}
              value={form.user}
            />
            <div className={formStyles.err}>{errors.user && <span>{errors.user}</span>}</div>
          </div>

          <div className="email">
            <label htmlFor="email">Email</label>
            <br />
            <input
              name="email"
              autoComplete="off"
              type="email"
              onChange={handleFormChange}
              value={form.email}
            />
            <div className={formStyles.err}>{errors.email && <span>{errors.email}</span>}</div>
          </div>

          <div className="password">
            <label htmlFor="password">Password</label>
            <br />
            <input
              name="password"
              autoComplete="off"
              type="password"
              onChange={handleFormChange}
              value={form.password}
            />
            <div className={formStyles.err}>{errors.password && <span>{errors.password}</span>}</div>
          </div>

          <button className={formStyles.submitBtn} type="submit" disabled={!errors.isValid || !Object.values(form).every(Boolean)}>Log In</button>

        </form>

      </div>
    </>
  )
}
export default LoginForm