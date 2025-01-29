import React, { useState, useRef } from "react";
import { FiEdit2, FiCheck, FiX, FiUpload } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState("https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop");
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    bio: "Professional software developer with expertise in React and modern web technologies.",
    country: "United States",
    city: "San Francisco",
    state: "California",
    postalCode: "94105",
    socialLinks: {
      linkedin: "linkedin.com/johndoe",
      twitter: "twitter.com/johndoe",
      github: "github.com/johndoe"
    }
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (formData.fullName.length < 2) {
      newErrors.fullName = "Name must be at least 2 characters long";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (formData.bio.length > 250) {
      newErrors.bio = "Bio must not exceed 250 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <ToastContainer />
      <div className="max-w-4xl mx-auto bg-card rounded-lg shadow-lg p-6 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-heading font-heading text-foreground" style={{color: 'darkblue',fontWeight: 900,fontSize: 'xx-large'}}>Profile Information</h1>
          <button
            onClick={() => isEditing ? handleSubmit() : setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
            style={{fontWeight: 400,
                  borderRadius: '34px',
                  color: 'white',
                  backgroundColor: 'rgb(13, 110, 253)'}}
          >
            {isEditing ? (
              <>
                <FiCheck /> Save Changes
              </>
            ) : (
              <>
                <FiEdit2 /> Edit Profile
              </>
            )}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48 mb-4">
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-2 right-2 p-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
                  >
                    <FiUpload />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-body text-accent mb-1" style={{color:'gray', fontWeight:'bold'}}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    style={{borderRadius:'4px', backgroundColor:'#e8e6e6', borderColor:'gray'}}
                    className={`w-full p-2 border rounded-md ${isEditing ? "bg-white" : "bg-secondary"} ${errors.fullName ? "border-destructive" : "border-input"}`}
                  />
                  {errors.fullName && (
                    <p className="text-destructive text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-body text-accent mb-1" style={{color:'gray', fontWeight:'bold'}}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    style={{borderRadius:'4px', backgroundColor:'#e8e6e6', borderColor:'gray'}}
                    className={`w-full p-2 border rounded-md ${isEditing ? "bg-white" : "bg-secondary"} ${errors.email ? "border-destructive" : "border-input"}`}
                  />
                  {errors.email && (
                    <p className="text-destructive text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-body text-accent mb-1" style={{color:'gray', fontWeight:'bold'}}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    style={{borderRadius:'4px', backgroundColor:'#e8e6e6', borderColor:'gray'}}
                    className={`w-full p-2 border rounded-md ${isEditing ? "bg-white" : "bg-secondary"} border-input`}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-body text-accent mb-1" style={{color:'gray', fontWeight:'bold'}}>
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    style={{borderRadius:'4px', backgroundColor:'#e8e6e6', borderColor:'gray'}}
                    className={`w-full p-2 border rounded-md ${isEditing ? "bg-white" : "bg-secondary"} border-input`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-body text-accent mb-1" style={{color:'gray', fontWeight:'bold'}}>
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    style={{borderRadius:'4px', backgroundColor:'#e8e6e6', borderColor:'gray'}}
                    className={`w-full p-2 border rounded-md ${isEditing ? "bg-white" : "bg-secondary"} border-input`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-body text-accent mb-1" style={{color:'gray', fontWeight:'bold'}}>
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    style={{borderRadius:'4px', backgroundColor:'#e8e6e6', borderColor:'gray'}}
                    className={`w-full p-2 border rounded-md ${isEditing ? "bg-white" : "bg-secondary"} border-input`}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-body text-accent mb-1" style={{color:'gray', fontWeight:'bold'}}>
                Bio
              </label>
              <textarea
                name="bio"
                style={{borderRadius:'4px', backgroundColor:'#e8e6e6', borderColor:'gray'}}
                value={formData.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows="4"
                className={`w-full p-2 border rounded-md ${isEditing ? "bg-white" : "bg-secondary"} ${errors.bio ? "border-destructive" : "border-input"}`}
              />
              <div className="flex justify-between mt-1">
                <span className="text-sm text-accent">
                  {formData.bio.length}/250 characters
                </span>
                {errors.bio && (
                  <p className="text-destructive text-sm">{errors.bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;