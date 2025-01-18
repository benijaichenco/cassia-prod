import { memo, SyntheticEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { authLogin } from "../../api/apiUtils";
import { parseJwt, useLenisScrollTo } from "../../utils";
import { useUserContext } from "../../context/UserContext";
import { useNavbarColorContext } from "../../context/NavbarColorContext";
import AuthFormInput from "../../components/auth-form-input/AuthFormInput";
import Button from "../../components/button/Button";
import Form from "../../components/form/Form";
import Loader from "../../components/loaders/Loader";
import FormErrorText from "../../components/form-error-text/FormErrorText";
import ArticleTitle from "../../components/article-title/ArticleTitle";

import "./login.css";

function LogIn() {
  const navigate = useNavigate();
  const scrollToTop = useLenisScrollTo();
  const userContext = useUserContext();
  const navbarColorContext = useNavbarColorContext();
  const [loginPending, setLoginPending] = useState<boolean>(false);
  const [loginStatus, setLoginStatus] = useState<string | null>(null);
  const [allInputs, setAllInputs] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const isLoginValid = useMemo(() => {
    return allInputs.usernameOrEmail !== "" && allInputs.password !== "";
  }, [allInputs]);

  const handleInputChange = useCallback((e: SyntheticEvent<HTMLInputElement>) => {
    const id = e.currentTarget.id;
    const value = e.currentTarget.value;
    setAllInputs((inputs) => ({
      ...inputs,
      [id]: value,
    }));
  }, []);

  const handleLogin = useCallback(async () => {
    setLoginStatus("");
    const { usernameOrEmail, password } = allInputs;
    const payload = {
      usernameOrEmail,
      password,
    };
    setLoginPending(true);
    try {
      const res = await authLogin(payload);
      const { accessToken, refreshToken } = res?.data || null;
      if (accessToken && refreshToken) {
        window.localStorage.setItem("at", accessToken);
        window.localStorage.setItem("rt", refreshToken);
        window.localStorage.setItem("isLoggedIn", "true");
      }
      const userData = parseJwt(accessToken);
      userContext.dispatch({
        ...userData,
        isLoggedIn: true,
      });
      navigate("/");
    } catch (err) {
      if ((err as AxiosError).status == 401) {
        setLoginStatus("Wrong combination of username / email and password.");
      } else {
        setLoginStatus("Something went wrong. Please try again later.");
      }
    } finally {
      setLoginPending(false);
    }
  }, [allInputs, userContext, navigate]);

  useEffect(() => {
    scrollToTop();
    navbarColorContext.dispatch?.("white", "black");
  }, [scrollToTop, navbarColorContext]);
  return (
    <>
      <section id="login-section">
        <Form id="login-form">
          <ArticleTitle className="login-title">LOG IN</ArticleTitle>
          <AuthFormInput
            id="usernameOrEmail"
            label="Username or Email"
            type="text"
            onChange={handleInputChange}
          />
          <AuthFormInput
            id="password"
            label="Password"
            type="password"
            onChange={handleInputChange}
          />
          {loginPending ? (
            <Loader />
          ) : (
            <>
              <Button
                type="button"
                onClick={handleLogin}
                color="var(--bg)"
                backgroundColor="var(--primary)"
                disabled={!isLoginValid}
              >
                LOG IN
              </Button>
              {loginStatus && <FormErrorText value={loginStatus} />}
            </>
          )}
        </Form>
      </section>
    </>
  );
}

export default memo(LogIn);
