import { memo, SyntheticEvent, useCallback, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { authRegister } from "../../api/apiUtils";
import { useLenisScrollTo } from "../../utils";
import { useNavbarColorContext } from "../../context/NavbarColorContext";
import AuthFormInput from "../../components/auth-form-input/AuthFormInput";
import Loader from "../../components/loaders/Loader";
import Button from "../../components/button/Button";
import Form from "../../components/form/Form";
import FormErrorText from "../../components/form-error-text/FormErrorText";
import ArticleTitle from "../../components/article-title/ArticleTitle";

import "./register.css";

const RegisterConfirmation = () => {
  return (
    <>
      <div className="register-confirmation-text">
        Please check your email in order to continue registering process.
      </div>
    </>
  );
};

function Register() {
  const scrollToTop = useLenisScrollTo();
  const navbarColorContext = useNavbarColorContext();
  const [pwdLengthError, setPwdLengthError] = useState<boolean>(false);
  const [pwdRegexError, setPwdRegexError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [usernameError, setUsernameError] = useState<boolean>(false);
  const [registerIsPending, setRegisterIsPending] = useState<boolean>(false);
  const [registerFailed, setRegisterFailed] = useState<boolean>(false);
  const [registerSubmitted, setRegisterSubmitted] = useState<boolean>(false);
  const [isRegisterValid, setIsRegisterValid] = useState<boolean>(false);
  const [allInputs, setAllInputs] = useState({
    fName: "",
    lName: "",
    email: "",
    username: "",
    pwd: "",
  });

  const updateInput = useCallback((id: string, value: string) => {
    setAllInputs((inputs) => ({
      ...inputs,
      [id]: value,
    }));
  }, []);

  const handleRegister = useCallback(async () => {
    setUsernameError(false);
    setRegisterIsPending(true);
    setRegisterFailed(false);
    const data = {
      fName: allInputs.fName,
      lName: allInputs.lName,
      email: allInputs.email,
      username: allInputs.username,
      pwd: allInputs.pwd,
    };
    try {
      await authRegister(data);
      setRegisterSubmitted(true);
      scrollToTop();
    } catch (err) {
      console.error("Error registering user:", err);
      const error = err as AxiosError;
      if ((error.status && error.status > 499) || !error.status) {
        setRegisterFailed(true);
        return;
      }
      if (error.response?.data == "Username already exists.") {
        setUsernameError(true);
      }
    } finally {
      setRegisterIsPending(false);
    }
  }, [allInputs, scrollToTop]);

  const emailValidation = useCallback(
    (e: SyntheticEvent<HTMLInputElement>) => {
      const input = e.currentTarget;
      const value = input.value;
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const isValid = regex.test(value);
      if (value == "") {
        setEmailError(false);
        updateInput("email", "");
        return;
      }
      if (!isValid) {
        setEmailError(true);
        updateInput("email", "");
      } else {
        setEmailError(false);
        updateInput("email", value);
      }
    },
    [updateInput]
  );

  const usernameValidation = useCallback(
    async (e: SyntheticEvent<HTMLInputElement>) => {
      const input = e.currentTarget;
      const value = input.value;
      updateInput("username", value);
    },
    [updateInput]
  );

  const pwdValidation = useCallback(
    (e: SyntheticEvent<HTMLInputElement>) => {
      const regex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
      const input = e.target as HTMLInputElement;
      const value = input.value;
      if (value == "") {
        setPwdLengthError(false);
        setPwdRegexError(false);
        updateInput("pwd", "");
        return;
      }
      if (value.length < 8) {
        setPwdLengthError(true);
      } else {
        setPwdLengthError(false);
      }
      if (!regex.test(value)) {
        setPwdRegexError(true);
      } else {
        setPwdRegexError(false);
      }
      if (regex.test(value) && value.length >= 8) {
        updateInput("pwd", value);
      } else {
        updateInput("pwd", "");
      }
    },
    [updateInput]
  );

  const addInputValue = useCallback(
    async (e: SyntheticEvent<HTMLInputElement>) => {
      const input = e.currentTarget;
      const value = input.value;
      const id = input.id;
      updateInput(id, value);
    },
    [updateInput]
  );

  useEffect(() => {
    navbarColorContext.dispatch?.("white", "black");
    scrollToTop();
  }, [scrollToTop, navbarColorContext]);

  useEffect(() => {
    if (Object.values(allInputs).some((v) => v == "")) {
      setIsRegisterValid(false);
    } else {
      setIsRegisterValid(true);
    }
  }, [allInputs]);

  return (
    <>
      <section id="register-section">
        {registerSubmitted ? (
          <RegisterConfirmation />
        ) : (
          <>
            <Form id="register-form">
              <ArticleTitle className="register-title">REGISTER</ArticleTitle>
              <AuthFormInput
                id="fName"
                label="First Name"
                type="text"
                required
                onChange={addInputValue}
              />
              <AuthFormInput
                id="lName"
                label="Last Name"
                type="text"
                required
                onChange={addInputValue}
              />
              <div className="register-form-input-wrapper">
                <AuthFormInput
                  id="email"
                  label="Email"
                  type="email"
                  required
                  onChange={emailValidation}
                />
                <div className="register-error-text-wrapper">
                  {emailError && <FormErrorText value="* Invalid email." />}
                </div>
              </div>

              <div className="register-form-input-wrapper">
                <AuthFormInput
                  id="username"
                  label="Username"
                  type="text"
                  required
                  onChange={usernameValidation}
                />
                <div className="register-error-text-wrapper">
                  {usernameError && <FormErrorText value="* Username already exists." />}
                </div>
              </div>

              <div className="register-form-input-wrapper">
                <AuthFormInput
                  id="pwd"
                  label="Password"
                  type="password"
                  required
                  onChange={pwdValidation}
                />
                <div className="register-error-text-wrapper">
                  {pwdLengthError && <FormErrorText value="* At least 8 characters." />}
                  {pwdRegexError && <FormErrorText value="* At least one letter and one digit." />}
                </div>
              </div>

              {registerIsPending ? (
                <Loader />
              ) : (
                <>
                  <Button
                    type="button"
                    onClick={handleRegister}
                    disabled={!isRegisterValid}
                    color="var(--bg)"
                    backgroundColor="var(--primary)"
                  >
                    REGISTER
                  </Button>
                  {registerFailed && (
                    <FormErrorText value="There was an error registering. Please try again later." />
                  )}
                </>
              )}
            </Form>
          </>
        )}
      </section>
    </>
  );
}

export default memo(Register);
