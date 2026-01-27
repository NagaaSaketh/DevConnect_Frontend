import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequests } from "../utils/requestSlice";
import { useEffect } from "react";
const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);

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

  const reviewRequest = async (status, id) => {
    try {
      await axios.post(
        `https://dev-connect-backend-opal.vercel.app/request/review/${status}/${id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequests(id));

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return null;

  if (requests.length === 0) {
    return (
      <div className="flex justify-center items-center my-20">
        <h1 className="text-3xl font-stretch-expanded font-bold text-gray-400">
          No Connection Requests found!
        </h1>
      </div>
    );
  }

  return (
    <div className="text-center my-10">
      <h1 className="text-3xl font-stretch-expanded font-bold mb-6">Connection Requests</h1>
      <div className="max-w-4xl mx-auto">
        {requests.map((request) => {
          const { _id, fromUserId } = request;
          const { firstName, lastName, about, photoUrl } = fromUserId;

          return (
            <div
              key={_id}
              className="flex justify-between items-center gap-5 m-4 p-4 rounded-lg bg-base-300"
            >
              <img
                className="w-20 h-20 rounded-full object-cover"
                src={photoUrl}
                alt={`${firstName} ${lastName}`}
              />

              <div className="text-left flex-1">
                <h2 className="font-bold text-xl mb-1">
                  {firstName} {lastName}
                </h2>
                {about && <p className="text-gray-300">{about}</p>}
              </div>

              <div className="flex gap-2">
                <button
                  className="btn btn-primary rounded-4xl transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-105 hover:shadow-lg active:translate-y-0 active:scale-100 shadow-sm"
                  onClick={() => reviewRequest("accepted", _id)}
                >
                  Accept
                </button>
                <button
                  className="btn btn-soft btn-error rounded-4xl transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-105 hover:shadow-lg active:translate-y-0 active:scale-100 shadow-sm"
                  onClick={() => reviewRequest("rejected", _id)}
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
