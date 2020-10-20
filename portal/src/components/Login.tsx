import React, { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useStoreState, useStoreActions } from "../store";

const LogInPage = () => {
  const history = useHistory();

  // Pull out actions from our store
  const setUserMail = useStoreActions((actions) => actions.auth.setUserMail);
  const setUserPassword = useStoreActions(
    (actions) => actions.auth.setUserPassword
  );
  const logIn = useStoreActions((actions) => actions.auth.logIn);
  const setRemember = useStoreActions((actions) => actions.auth.setRemeber);
  const authenticate = useStoreActions((actions) => actions.auth.authenticate);
  console.log("login auth", authenticate());

  // Pull out states from our store
  const userName = useStoreState((state) => state.auth.userName);
  const email = useStoreState((state) => state.auth.userMail);
  const userRole = useStoreState((state) => state.auth.userRole);
  const password = useStoreState((state) => state.auth.userPassword);
  const token = useStoreState((state) => state.auth.token);
  const rememberMe = useStoreState((state) => state.auth.rememberMe);
  const isInvalid = useStoreState((state) => state.auth.isInvalid);

  function toDashboard() {
    console.log("toDashboard", token);
    const request = new Request("http://localhost:3001/api/testText", {
      method: "POST",
      headers: new Headers({
        Accept: "application/json",
        "Content-Type": "application/json",
      }),
    });

    return fetch(request)
      .then((response) => {
        return response.json();
      })
      .catch((err) => console.log(err))
      .then(() => {
        history.push({
          pathname: "/dashboard",
          state: { userName: userName, userMail: email, userRole: userRole },
        });
      });
  }

  const handleEmailChange = useCallback(
    (event) => {
      setUserMail(event.target.value);
    },
    [setUserMail]
  );

  const handlePasswordChange = useCallback(
    (event) => {
      setUserPassword(event.target.value);
    },
    [setUserPassword]
  );

  const handleRememberStatus = useCallback(
    (event) => {
      setRemember(event.target.value);
    },
    [setRemember]
  );

  const submit = useCallback(
    async (event) => {
      event.preventDefault();
      logIn({ email, password, rememberMe });
    },
    [email, password, rememberMe, logIn]
  );

  useEffect(() => {
    console.log("useEffect ", token);
    if (token) history.push("/dashboard");
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/workflow-mark-on-white.svg"
            alt="Workflow"
          />
          <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8" onSubmit={submit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm">
            <div>
              <input
                aria-label="Email address"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
                placeholder="Email address"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div className="-mt-px">
              <input
                aria-label="Password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
          </div>

          {isInvalid === true && (
            <p className="text-red-500 text-xs italic">Invalid Credential.</p>
          )}

          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                onChange={(e) => handleRememberStatus}
              />
              <label
                htmlFor="remember_me"
                className="ml-2 block text-sm leading-5 text-gray-900"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm leading-5">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition ease-in-out duration-150"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 transition ease-in-out duration-150"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LogInPage;
