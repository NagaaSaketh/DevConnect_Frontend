// pages/EditProfile.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import UserCard from "../components/UserCard";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [about, setAbout] = useState("");
  const [skills, setSkills] = useState("");

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [displayPass, setDisplayPass] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhotoUrl(user.photoUrl || "");
      setAge(user.age || "");
      setGender(user.gender || "");
      setAbout(user.about || "");
      setSkills(Array.isArray(user.skills) ? user.skills.join(", ") : "");
    }
  }, [user]);

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
        "https://dev-connect-backend-opal.vercel.app/profile/edit",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch(addUser(response?.data?.data));
      setToastMessage("Profile saved successfully!");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate("/profile");
      }, 2000);
    } catch (err) {
      console.log(err);
      setToastMessage("Failed to save profile");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = () => {
    setDisplayPass(true);
  };

  const updatePassword = async () => {
    try {
      if (!newPassword) return;
      const response = await axios.put(
        "https://dev-connect-backend-opal.vercel.app/profile/password",
        { password: newPassword },
        { withCredentials: true }
      );
      setToastMessage("Password updated successfully!");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
      setNewPassword("");
      setDisplayPass(false);
    } catch (err) {
      console.log(err);
      setToastMessage("Failed to update password");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

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
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Saving...
                  </>
                ) : (
                  "Save Profile"
                )}
              </button>
              <button
                onClick={handleChangePassword}
                className="btn hover:bg-blue-500"
              >
                Change Password
              </button>
            </div>
            {displayPass && (
              <div className="p-4 mt-4 border-t border-base-200">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">New Password:</legend>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      className="input w-full pr-10"
                      placeholder="Enter new password"
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <img
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                      src={
                        showPassword
                          ? "https://www.svgrepo.com/show/380007/eye-password-hide.svg"
                          : "https://www.svgrepo.com/show/380010/eye-password-show.svg"
                      }
                      alt="toggle password"
                    />
                  </div>
                </fieldset>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={updatePassword}
                    className="btn btn-outline rounded-4xl btn-success"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      setDisplayPass(false);
                      setNewPassword("");
                      setShowPassword(false);
                    }}
                    className="btn btn-error rounded-4xl btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
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
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
