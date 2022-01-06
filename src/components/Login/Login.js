import React, { useState, useEffect, useReducer, useContext } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../context/auth-context";
import Input from "../UI/Input/Input";

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
  const ctx = useContext(AuthContext);

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
    ctx.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          label="E-Mail"
          inputId="email"
          inputType="email"
          value={emailState.value}
          isValid={emailIsValid}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          label="Password"
          inputId="password"
          inputType="password"
          value={passwordState.value}
          isValid={passwordIsValid}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
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
