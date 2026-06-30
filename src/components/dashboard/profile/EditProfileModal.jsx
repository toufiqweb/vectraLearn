import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit3, X, Camera, Link, Globe, Save, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { imageUpload } from "../../../lib/imageUpload";
import { useRouter } from "next/navigation";
import { updateUserProfileAction } from "@/lib/actions/user";

export default function EditProfileModal({ isOpen, onClose, user, onSuccess }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    profileImage: "",
    bio: "",
    skills: "",
    phoneNumber: "",
    title: "",
    location: "",
    github: "",
    linkedin: "",
    twitter: "",
  });

  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        name: user.name || "",
        profileImage: user.image || "",
        bio: user.bio || "",
        skills: user.skills?.join(", ") || "",
        phoneNumber: user.phoneNumber || "",
        title: user.title || "",
        location: user.location || "",
        github: user.socials?.github || "",
        linkedin: user.socials?.linkedin || "",
        twitter: user.socials?.twitter || "",
      });
    }
  }, [user, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const uploadData = await imageUpload(file);
      if (uploadData?.url) {
        setFormData((prev) => ({ ...prev, profileImage: uploadData.url }));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Failed to upload image.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while uploading.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const skillsArray = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const payload = {
        name: formData.name,
        profileImage: formData.profileImage,
        bio: formData.bio,
        skills: skillsArray,
        phoneNumber: formData.phoneNumber,
        title: formData.title,
        location: formData.location,
        socials: {
          github: formData.github,
          linkedin: formData.linkedin,
          twitter: formData.twitter,
        },
      };

      const data = await updateUserProfileAction(payload, user.id);

      if (data.success) {
        toast.success(data.message || "Profile updated successfully!");
        onSuccess(payload);
        onClose();
        router.refresh();
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("An error occurred while updating profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass-card w-full max-w-3xl rounded-[32px] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl border border-card-border"
          >
            <div className="flex justify-between items-center p-6 border-b border-card-border bg-card-bg">
              <h3 className="text-xl font-black text-foreground flex items-center">
                <Edit3 size={20} className="mr-3 text-brand-cyan" />
                Update Identity Profile
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-foreground/10 text-muted transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 custom-scrollbar"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-muted">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-card-border bg-foreground/5 focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan outline-none transition-all text-sm font-bold text-foreground"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-muted">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-card-border bg-foreground/5 focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan outline-none transition-all text-sm font-bold text-foreground"
                    placeholder="Senior Frontend Developer"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-muted">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-card-border bg-foreground/5 focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan outline-none transition-all text-sm font-bold text-foreground"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-muted">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-card-border bg-foreground/5 focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan outline-none transition-all text-sm font-bold text-foreground"
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>

              {/* Profile Image */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-muted">
                  Profile Image
                </label>
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-foreground/5 border border-card-border shrink-0 overflow-hidden flex items-center justify-center relative">
                    {formData.profileImage ? (
                      <Image
                        height={100}
                        width={100}
                        src={formData.profileImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera size={24} className="text-muted" />
                    )}
                    {isUploadingImage && (
                      <div className="absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-sm">
                        <Loader2 size={16} className="text-brand-cyan animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="cursor-pointer inline-flex items-center justify-center px-4 py-3 rounded-xl border border-card-border bg-foreground/5 hover:bg-brand-cyan/10 hover:border-brand-cyan/50 transition-all text-sm font-bold text-foreground w-full text-center h-full">
                      <span className="mr-2">{isUploadingImage ? 'Uploading...' : 'Choose File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                        disabled={isUploadingImage}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-4 pt-4 border-t border-card-border">
                <h4 className="text-sm font-black text-foreground">
                  Social Profiles
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Link size={16} className="text-muted" />
                    </div>
                    <input
                      type="url"
                      name="github"
                      value={formData.github}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-card-border bg-foreground/5 focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan outline-none transition-all text-sm font-bold text-foreground"
                      placeholder="GitHub URL"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Globe size={16} className="text-muted" />
                    </div>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleInputChange}
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-card-border bg-foreground/5 focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan outline-none transition-all text-sm font-bold text-foreground"
                      placeholder="LinkedIn URL"
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2 pt-4 border-t border-card-border">
                <label className="text-xs font-black uppercase tracking-wider text-muted">
                  Custom Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-card-border bg-foreground/5 focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan outline-none transition-all resize-none text-sm font-medium text-foreground"
                  placeholder="Tell us about your background, goals, and interests..."
                />
              </div>

              {/* Skills */}
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-muted flex justify-between">
                  <span>Expert Skill Matrix</span>
                  <span className="text-muted/70 font-medium normal-case tracking-normal">
                    Comma separated
                  </span>
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-card-border bg-foreground/5 focus:ring-2 focus:ring-brand-cyan/50 focus:border-brand-cyan outline-none transition-all text-sm font-bold text-foreground"
                  placeholder="React, Node.js, UI Design..."
                />
              </div>
            </form>

            <div className="p-6 border-t border-card-border bg-card-bg flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-xl font-bold text-foreground bg-foreground/10 hover:bg-foreground/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="px-8 py-3 rounded-xl font-bold text-background bg-foreground hover:bg-brand-cyan hover:text-background active:scale-95 transition-all flex items-center gap-2 disabled:opacity-70 disabled:pointer-events-none shadow-md"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {isSaving ? "Saving..." : "Save Identity"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
