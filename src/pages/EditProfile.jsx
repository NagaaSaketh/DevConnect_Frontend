import { useState } from "react";
import axios from "axios";
import UserCard from "../Components/UserCard";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about);
  const [skills, setSkills] = useState(
    Array.isArray(user.skills) ? user.skills.join(", ") : ""
  );

  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const previewSkills =
    skills.trim().length > 0
      ? skills.split(",").map((skill) => skill.trim())
      : [];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoUrl(file);
    }
  };

  const saveProfile = async () => {
    const formattedSkills =
      typeof skills === "string" && skills.trim().length > 0
        ? skills.split(",").map((skill) => skill.trim())
        : [];

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("age", age);
      formData.append("gender", gender);
      formData.append("about", about);
      formData.append("skills", formattedSkills);

      if (photoUrl instanceof File) {
        formData.append("photo", photoUrl);
      }

      const response = await axios.put(
        "http://localhost:4000/profile/edit",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch(addUser(response?.data?.data));
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center my-10">
      <div className="flex justify-center mx-10">
        <div className="card bg-base-300 w-96 shadow-sm">
          <div className="card-body">
            <h2 className="card-title font-stretch-expanded justify-center">
              Edit Profile
            </h2>
            <div className="p-4">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">First Name:</legend>
                <input
                  type="text"
                  value={firstName}
                  className="input"
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Last Name:</legend>
                <input
                  type="text"
                  value={lastName}
                  className="input"
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Upload Photo:</legend>
                <input
                  onChange={handleImageUpload}
                  type="file"
                  className="file-input file-input-sm"
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Age:</legend>
                <input
                  type="number"
                  value={age}
                  className="input"
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Gender</legend>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="select"
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">About</legend>
                <textarea
                  onChange={(e) => setAbout(e.target.value)}
                  value={about}
                  className="textarea h-24"
                  placeholder="Bio"
                ></textarea>
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Skills</legend>
                <textarea
                  onChange={(e) => setSkills(e.target.value)}
                  value={skills}
                  className="textarea h-24"
                  placeholder="Enter your technical skills"
                ></textarea>
              </fieldset>
            </div>
            <div className="card-actions justify-center">
              <button
                className="btn btn-primary"
                onClick={saveProfile}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <UserCard
        user={{
          firstName,
          lastName,
          age,
          gender,
          about,
          photoUrl:
            photoUrl instanceof File ? URL.createObjectURL(photoUrl) : photoUrl,
          skills: previewSkills,
        }}
      />
      {showToast && (
        <div className="toast toast-top toast-center pt-20 ">
          <div className="alert alert-success">
            <span>Profile saved successfully</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
