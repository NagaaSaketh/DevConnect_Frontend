import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);

  const fetchConnections = async () => {
    try {
      const response = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(response.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return null;

  if (connections.length === 0) {
    return (
      <div className="flex justify-center items-center my-20">
        <h1 className="text-3xl font-stretch-expanded font-bold text-gray-400">
          No Connections found!
        </h1>
      </div>
    );
  }

  return (
    <div className="text-center my-10">
      <h1 className="text-3xl font-stretch-expanded mb-6">Connections</h1>
      <div className="max-w-3xl mx-auto">
        {connections.map((connection) => {
          const { _id, photoUrl, firstName, lastName, about, age, gender } =
            connection;

          return (
            <div
              key={_id}
              className="flex items-center gap-5 m-4 p-4 rounded-lg bg-base-300"
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
                {age && gender && (
                  <p className="text-sm text-gray-400">
                    {age}, {gender}
                  </p>
                )}
                <p className="py-2">{about}</p>
              </div>
              <Link
                to={`/chat/${_id}`}
                state={{
                  firstName,
                  lastName,
                  photoUrl,
                }}
                className="btn btn-outline btn-primary rounded-4xl shadow-sm"
              >
                Chat
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
