import React, { useState, useEffect, useReducer } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";

const inputReducer = (state, action) => {
  if (action.type === "INPUT") {
    const inputValue = action.value;
    return {
      value: inputValue,
      isValid:
        action.inputType === "password"
          ? inputValue.trim().length > 6
          : inputValue.includes("@"),
    };
  }

  if (action.type === "INPUT_BLUR") {
    const inputValue = state.value;
    return {
      value: inputValue,
      isValid:
        action.inputType === "password"
          ? inputValue.trim().length > 6
          : inputValue.includes("@"),
    };
  }

  return {
    value: "",
    isValid: false,
  };
};

const Login = (props) => {
  const [formIsValid, setFormIsValid] = useState(false);
  const [emailState, dispatchEmail] = useReducer(inputReducer, {
    value: "",
    isValid: null,
  });
  const [passwordState, dispatchPassword] = useReducer(inputReducer, {
    value: "",
    isValid: null,
  });
  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      console.log("Checking form validity!");
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 500);

    return () => {
      console.log("CLEANUP");
      clearTimeout(identifier);
    };
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    dispatchEmail({
      type: "INPUT",
      value: event.target.value,
      inputType: event.target.type,
    });
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({
      type: "INPUT",
      value: event.target.value,
      inputType: event.target.type,
    });
  };

  const validateEmailHandler = (event) => {
    dispatchEmail({
      type: "INPUT_BLUR",
      inputType: event.target.type,
    });
  };

  const validatePasswordHandler = (event) => {
    dispatchPassword({
      type: "INPUT_BLUR",
      inputType: event.target.type,
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
