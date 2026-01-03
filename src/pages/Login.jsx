import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [showError, setShowError] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
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
          <span className="text-rotate font-stretch-ultra-expanded  text-4xl mb-4 text-yellow-300">
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

              <p
                className="text-center text-slate-300 hover:text-indigo-400 cursor-pointer mt-4"
                onClick={() => setIsLoginForm((prev) => !prev)}
              >
                {isLoginForm
                  ? "Don't have an account? Create one"
                  : "Existing user? Login"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ERROR TOAST */}
      {showError && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-error">
            <span>Invalid credentials</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
