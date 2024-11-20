import React, { useState } from 'react';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    profilePicture: 'https://via.placeholder.com/150',
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-page bg-gray-100 p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile</h1>

      <div className="flex items-center mb-6">
        <img
          src={profile.profilePicture}
          alt="Profile"
          className="w-24 h-24 rounded-full border"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="ml-4"
        />
      </div>

      <div className="mb-4">
        <label className="text-gray-700 font-medium">Name:</label>
        <p className="ml-2 inline-block font-semibold">{profile.name}</p>
      </div>

      <div>
        <label className="text-gray-700 font-medium">Email:</label>
        <p className="ml-2 inline-block font-semibold">{profile.email}</p>
      </div>
    </div>
  );
};

export default Profile;
