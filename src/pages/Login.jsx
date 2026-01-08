import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate, useSearchParams } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Invalid credentials");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "oauth_failed") {
      setErrorMessage("OAuth authentication failed. Please try again.");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  }, [searchParams]);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/login",
        { emailID: email, password },
        { withCredentials: true }
      );
      dispatch(addUser(response.data));
      navigate("/");
    } catch (err) {
      setErrorMessage("Invalid credentials");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const handleSignUp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/signup",
        {
          firstName,
          lastName,
          emailID: email,
          password,
        },
        { withCredentials: true }
      );
      dispatch(addUser(response.data.data));
      navigate("/profile");
    } catch (err) {
      setErrorMessage("Sign up failed. Please try again.");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const handleGitHubLogin = () => {
    window.location.href = "http://localhost:4000/auth/github";
  };

  const handleGoogleLogin = () => {
    setErrorMessage("Coming soon!!!");
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
  };

  return (
    <div
      className="hero min-h-screen overflow-hidden"
      style={{
        backgroundImage:
          "url(https://www.apple.com/newsroom/images/product/app-store/apple_wwdc-app-developer-academy_hero_05112021_big.gif.large.gif)",
      }}
    >
      <div className="hero-overlay bg-black/70"></div>

      <div className="hero-content flex items-center justify-center w-full">
        <div className="relative text-center">
          <span className="text-rotate font-stretch-ultra-expanded text-3xl mb-4 text-yellow-300">
            <span className="justify-items-center">
              <span>Connect</span>
              <span>Collaborate</span>
              <span>Code</span>
            </span>
          </span>
          <div className="card bg-base-300 w-96 shadow-xl">
            <div className="card-body">
              <h2 className="card-title font-stretch-ultra-expanded justify-center text-2xl">
                {isLoginForm ? "Login" : "Sign Up"}
              </h2>

              <div className="space-y-3 mt-2">
                {!isLoginForm && (
                  <>
                    <input
                      type="text"
                      placeholder="First Name"
                      className="input input-bordered w-full"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="input input-bordered w-full"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </>
                )}

                <input
                  type="email"
                  placeholder="Email"
                  className="input input-bordered w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <input
                  type="password"
                  placeholder="Password"
                  className="input input-bordered w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="mt-5">
                <button
                  className="btn btn-primary w-full"
                  onClick={isLoginForm ? handleLogin : handleSignUp}
                >
                  {isLoginForm ? "Login" : "Sign Up"}
                </button>
              </div>
              <div className="divider font-mono text-sm">Or</div>
              <div className="space-y-3">
                <button
                  className="btn bg-black text-white border-black w-full"
                  onClick={handleGitHubLogin}
                >
                  <svg
                    aria-label="GitHub logo"
                    width="16"
                    height="16"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="white"
                      d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
                    ></path>
                  </svg>
                  {isLoginForm ? "Login with GitHub" : "Sign Up with GitHub"}
                </button>

                <button
                  className="btn bg-white text-black border-[#e5e5e5] w-full"
                  onClick={handleGoogleLogin}
                >
                  <svg
                    aria-label="Google logo"
                    width="16"
                    height="16"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <g>
                      <path d="m0 0H512V512H0" fill="#fff"></path>
                      <path
                        fill="#34a853"
                        d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                      ></path>
                      <path
                        fill="#4285f4"
                        d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                      ></path>
                      <path
                        fill="#fbbc02"
                        d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                      ></path>
                      <path
                        fill="#ea4335"
                        d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                      ></path>
                    </g>
                  </svg>
                  {isLoginForm ? "Login with Google" : "Sign Up with Google"}
                </button>
              </div>

              <p
                className="text-center text-slate-300 hover:text-indigo-400 cursor-pointer mt-4"
                onClick={() => setIsLoginForm((prev) => !prev)}
              >
                {isLoginForm
                  ? "New to DevConnect? Sign Up"
                  : "Existing user? Login"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {showError && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-error">
            <span>{errorMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
