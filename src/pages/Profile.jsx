import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft,FiCamera,FiCheck,FiMail,FiSave,FiTrash2,FiUser,FiShield,FiAlertTriangle,} from "react-icons/fi";
import { getProfile,updateProfile,uploadProfileImage,removeProfileImage,} from "../services/profileService";
import { getCurrentUser,} from "../services/authService";
import "./Profile.css";
const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profileImage: "",
  });
  useEffect(() => {
    loadProfile();
  }, []);
  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getProfile();
      setProfile({
        name:
          response?.name ||  "",
        email:
          response?.email ||  "",
        profileImage:
          response?.profileImage || "",
      });
    } catch (err) {
      console.error("Unable to load profile:", err);
      const currentUser = getCurrentUser();
      if (currentUser) {
        setProfile({
          name:
            currentUser.name || currentUser.fullName || "",
          email:
            currentUser.email || "",
          profileImage:
            currentUser.profileImage || "",
        });
      } else {
        setError("Unable to load your profile.");
      }
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (event) => {
    const {
      name,value,
    } = event.target;
    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };
  const handleSaveProfile = async () => {
    setError("");
    setSuccess("");
    if (!profile.name.trim()) {
      setError("Please enter your name.");
      return;
    }
    try {
      setSaving(true);
      const response = await updateProfile({
          name:
            profile.name.trim(),

        });
      setProfile((previous) => ({
        ...previous,
        name:
          response?.name ||
          previous.name,
        email:
          response?.email ||
          previous.email,
        profileImage:
          response?.profileImage ||
          previous.profileImage,
      }));
     const currentUser = getCurrentUser();
      if (currentUser) {
        localStorage.setItem("user",JSON.stringify({
            ...currentUser,
            name:
              response?.name || profile.name.trim(),
            email:
              response?.email || profile.email,
            profileImage:
              response?.profileImage || profile.profileImage,
          })
        );
      }
      setSuccess("Profile updated successfully.");
    } catch (err) {
      console.error("Profile update failed:",err);
      const message = err?.response?.data?.message || err?.response?.data || "Unable to update your profile.";
      setError(typeof message === "string" ? message : "Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  };
  const handleSelectImage = () => {
    fileInputRef.current?.click();
  };
  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Profile image must be smaller than 5 MB.");
      return;
    }
    try {
      setUploading(true);
      setError("");
      setSuccess("");
      const response = await uploadProfileImage(file);
      setProfile((previous) => ({
        ...previous,
        profileImage:
          response?.profileImage || "",
      }));
      setSuccess("Profile picture updated successfully.");
    } catch (err) {
      console.error("Profile image upload failed:",err);
      const message = err?.response?.data?.message || err?.response?.data || "Unable to upload profile picture.";
      setError(typeof message === "string"? message : "Unable to upload profile picture.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };
  const handleRemoveImage = async () => {
    try {
      setUploading(true);
      setError("");
      setSuccess("");
      await removeProfileImage();
      setProfile((previous) => ({
        ...previous,profileImage: "",
      }));
      setSuccess("Profile picture removed successfully.");
    } catch (err) {
      console.error("Unable to remove profile image:",err);
      setError("Unable to remove profile picture.");
    } finally {
      setUploading(false);
    }
  };
  const userInitial = profile.name ?.charAt(0) ?.toUpperCase() || "U";
  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="profile-spinner"></div>
          <p>
            Loading profile...
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="profile-page">
      <div className="profile-header">
        <button
          type="button"
          className="profile-back-button"
          onClick={() =>
            navigate("/dashboard")
          }
        >
          <FiArrowLeft />
          <span>
            Back to Dashboard
          </span>
        </button>
        <div className="profile-heading">
          <div className="profile-heading-icon">
            <FiUser />
          </div>
          <div>
            <h1>
              My Profile
            </h1>
            <p>
              Manage your personal information
              and profile picture.
            </p>
          </div>
        </div>
      </div>
      <div className="profile-container">
        {error && (
          <div className="profile-message error">
            <FiAlertTriangle />
            <span>
              {error}
            </span>
          </div>
        )}
        {success && (
          <div className="profile-message success">
            <FiCheck />
            <span>
              {success}
            </span>
          </div>
        )}
        <section className="profile-card">
          <div className="profile-card-header">
            <div>
              <h2>
                Personal Information
              </h2>
              <p>
                Update the information associated
                with your CodeGuard AI account.
              </p>
            </div>
            <FiShield />
          </div>
          <div className="profile-picture-section">
            <div className="profile-picture-wrapper">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt="Profile"
                  className="profile-picture"
                />
              ) : (
                <div className="profile-picture-placeholder">
                  {userInitial}
                </div>
              )}
              <button
                type="button"
                className="profile-camera-button"
                onClick={handleSelectImage}
                disabled={uploading}
                title="Change profile picture"
              >
                <FiCamera />
              </button>
            </div>
            <div className="profile-picture-info">
              <h3>
                Profile Picture
              </h3>
              <p>
                Upload a JPG, PNG or WEBP image.
              </p>
              <p>
                Maximum size: 5 MB.
              </p>
              <div className="profile-picture-actions">
                <button
                  type="button"
                  className="upload-picture-button"
                  onClick={handleSelectImage}
                  disabled={uploading}
                >
                  <FiCamera />
                  {uploading ? "Uploading...": "Change Picture"}
                </button>
                {profile.profileImage && (
                  <button
                    type="button"
                    className="remove-picture-button"
                    onClick={handleRemoveImage}
                    disabled={uploading}
                  >
                    <FiTrash2 />
                    Remove
                  </button>
                )}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageChange}
              hidden
            />
          </div>
          <div className="profile-form">
            <div className="profile-form-group">
              <label htmlFor="profileName">
                <FiUser />
                Full Name
              </label>
              <input
                id="profileName"
                name="name"
                type="text"
                value={profile.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>
            <div className="profile-form-group">
              <label htmlFor="profileEmail">
                <FiMail />
                Email Address
              </label>
              <input
                id="profileEmail"
                name="email"
                type="email"
                value={profile.email}
                disabled
              />
              <small>
                Email address cannot be changed here.
              </small>
            </div>
          </div>
          <div className="profile-save-area">
            <button
              type="button"
              className="profile-save-button"
              onClick={handleSaveProfile}
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="profile-button-spinner"></span>
                  Saving...
                </>
              ) : (
                <>
                  <FiSave />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </section>
        <section className="profile-card account-card">
          <div className="account-icon">
            <FiShield />
          </div>
          <div>
            <h3>
              Account Security
            </h3>
            <p>
              Your account is protected by the
              authentication system of CodeGuard AI.
            </p>
          </div>
        </section>
      </div>
    </div>
 );

};
export default Profile;