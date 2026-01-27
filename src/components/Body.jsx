import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "./Footer";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { addRequests } from "../utils/requestSlice";
import { useState,useEffect } from "react";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    if (user) {
      setIsLoading(false);
      return
    }

    try {
      const response = await axios.get(
        "https://dev-connect-backend-opal.vercel.app/profile/view",
        { withCredentials: true }
      );
      dispatch(addUser(response.data));
    } catch (err) {
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }finally {
      setIsLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        "https://dev-connect-backend-opal.vercel.app/user/requests/received",
        { withCredentials: true }
      );
      dispatch(addRequests(response.data.connectionRequests));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 pb-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Body;
