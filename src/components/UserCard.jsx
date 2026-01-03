import axios from "axios";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
const UserCard = ({ user }) => {
  const { firstName, lastName, age, gender, about, photoUrl, skills } = user;
  const validSkills = Array.isArray(skills)
    ? skills.filter((skill) => skill.trim() !== "")
    : [];

  const dispatch = useDispatch();

  const handleSendRequest = async (status, id) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/request/send/${status}/${id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(id));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <div className="card bg-base-300 w-96">
      <figure>
        <img src={photoUrl} alt="photo" />
      </figure>
      <div className="card-body">
        <h2 className="card-title font-stretch-expanded">{firstName + " " + lastName}</h2>
        {age && gender && <p>{age + " " + gender}</p>}
        <p>{about}</p>

        {validSkills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {validSkills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm font-medium rounded-full bg-emerald-500/20 text-black-300 border border-emerald-500/30"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        <div className="card-actions justify-center my-4">
          <button
            className="btn btn-secondary transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-105 hover:shadow-lg active:translate-y-0 active:scale-100 shadow-sm"
            onClick={() => handleSendRequest("ignored", user._id)}
          >
            Ignore
          </button>
          <button
            className="btn btn-primary transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-105 hover:shadow-lg active:translate-y-0 active:scale-100 shadow-sm"
            onClick={() => handleSendRequest("interested", user._id)}
          >
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
