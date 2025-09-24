import React, { useState } from "react";
import { useAuth } from "../../../shared/hooks/useAuth";
import { useAlert } from "../../../shared/hooks/useAlert";
import Layout from "../../../shared/components/Layout";
import ProfileHeader from "../components/ProfileHeader";
import ProfileCard from "../components/ProfileCard";
import ProfileHero from "../components/ProfileHero";
import ProfilePicture from "../components/ProfilePicture";
import ProfileForm from "../components/ProfileForm";
import AccountStats from "../components/AccountStats";
import ProfileActions from "../components/ProfileActions";

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const { showAlert } = useAlert();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    bio: user?.bio || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const result = await updateUser(formData);
      if (result.success) {
        showAlert("Profile updated successfully!", "success");
        setIsEditing(false);
      } else {
        showAlert(result.error || "Failed to update profile", "error");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      showAlert(
        error.response?.data?.detail ||
          "An error occurred while updating profile",
        "error"
      );
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      bio: user?.bio || "",
    });
    setIsEditing(false);
  };

  const handlePictureEdit = () => {
    // TODO: Implement picture upload functionality
    showAlert("Picture upload feature coming soon!", "info");
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <ProfileHeader />

        <ProfileCard>
          <ProfileHero user={user} />

          <div className="p-8">
            <ProfilePicture user={user} onEdit={handlePictureEdit} />

            <ProfileForm
              formData={formData}
              isEditing={isEditing}
              onInputChange={handleInputChange}
            />

            <AccountStats user={user} />

            <ProfileActions
              isEditing={isEditing}
              onEdit={() => setIsEditing(true)}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </ProfileCard>
      </div>
    </Layout>
  );
};

export default ProfilePage;
