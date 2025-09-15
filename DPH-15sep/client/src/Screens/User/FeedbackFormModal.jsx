import React, { useState, useCallback } from "react";
import axios from "axios";
import { ModalDialog } from "@/Components/Admin/Modal/MessageModal.jsx";
import feedbackImage from "@/assets/Logos/feedback.png";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const FeedbackFormModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalVariant, setModalVariant] = useState("info");
  const [modalMessage, setModalMessage] = useState("");

  const handleInputChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: null }));
      }
    },
    [errors]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/api/feedback`, formData);
      setModalVariant("success");
      setModalMessage("Thank you for your feedback!");
      setFormData({ name: "", email: "", mobile: "", message: "" });
      setErrors({});
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setModalVariant("error");
      setModalMessage("Failed to submit feedback. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 z-20"
          aria-label="Close"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>

        {/* Left Column */}
        <div className="w-1/2 hidden md:flex flex-col items-center justify-center p-12 bg-white">
          <h2 className="text-3xl font-bold text-blue-600 text-center leading-tight mb-6">
            Feel free to drop
            <br />
            us your feedback !
          </h2>
          <img
            src={feedbackImage}
            alt="Feedback illustration"
            className="w-full max-w-sm"
          />
        </div>

        {/* Right Column (Form) */}
        <div className="w-full md:w-1/2 p-8 bg-gray-50">
          <div className="bg-purple-100 border border-purple-200 mt-1 p-5 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full p-3 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-yellow-500 ${
                    errors?.name ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors?.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full p-3 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-yellow-500 ${
                    errors?.email ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors?.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile No <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Mobile No"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                  className={`w-full p-3 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-yellow-500 ${
                    errors?.mobile ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors?.mobile && (
                  <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Message"
                  value={formData.message}
                  onChange={(e) =>
                    handleInputChange("message", e.target.value)
                  }
                  className={`w-full p-3 border rounded-lg resize-none bg-white outline-none focus:ring-2 focus:ring-yellow-500 ${
                    errors?.message ? "border-red-500" : "border-gray-200"
                  }`}
                  rows="4"
                />
                {errors?.message && (
                  <p className="mt-1 text-xs text-red-600">{errors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-lg bg-yellow-400 hover:bg-yellow-500 font-semibold text-black transition duration-300 disabled:bg-gray-300"
                >
                  {isSubmitting ? "SENDING..." : "SEND"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success/Error Modal */}
      <ModalDialog
        open={!!modalMessage}
        onClose={() => setModalMessage("")}
        variant={modalVariant}
        message={modalMessage}
      />
    </div>
  );
};

export default FeedbackFormModal;
