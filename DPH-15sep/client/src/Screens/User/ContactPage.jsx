import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MapPin,
  Phone,
  Mail,
  Printer,
  ArrowRight,
  MessageSquareQuote,
  Mic,
} from "lucide-react";
import FeedbackFormModal from "./FeedbackFormModal"; // Ensure this path is correct
import { useGlobalTranslation } from "@/hooks/useGlobalTranslation";

const ContactPage = () => {
  const [settings, setSettings] = useState({
    en_address: "",
    mobileNumber: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const { translate } = useGlobalTranslation();

  // State for the "Listen" button and the currently highlighted element
  const [isListening, setIsListening] = useState(false);
  const [currentlyHighlighted, setCurrentlyHighlighted] = useState(null);

  // Define the sequence of elements to highlight
  const contentOrder = [
    "pageTitle",
    "addressTitle",
    "addressContent",
    "callTitle",
    "callContent",
    "emailTitle",
    "emailContent",
    "faxTitle",
    "feedbackTitle",
    "feedbackSubtitle",
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/contact-us`
        );
        setSettings(response.data);
      } catch (err) {
        console.error("Failed to fetch settings:", err);
        setError("Failed to load contact information. Please try again later.");
      
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Effect to manage the highlighting sequence
  useEffect(() => {
    let timer;
    if (isListening) {
      const currentIndex = contentOrder.indexOf(currentlyHighlighted);
      if (currentIndex < contentOrder.length - 1) {
        timer = setTimeout(() => {
          setCurrentlyHighlighted(contentOrder[currentIndex + 1]);
        }, 1500); // 1.5 second pause between highlights
      } else if (currentlyHighlighted === contentOrder[contentOrder.length - 1]) {
        // If it was the last item, stop listening
        setTimeout(() => {
            setIsListening(false);
            setCurrentlyHighlighted(null);
        }, 1500);
      }
    }
    return () => clearTimeout(timer); // Cleanup timer
  }, [isListening, currentlyHighlighted]);

  const handleListenToggle = () => {
    if (isListening) {
      setIsListening(false);
      setCurrentlyHighlighted(null);
    } else {
      setIsListening(true);
      setCurrentlyHighlighted(contentOrder[0]); // Start from the first item
    }
  };

  // Component to conditionally wrap text with a highlight
  const HighlightableText = ({ id, children, className = "" }) => {
    const isHighlighted = currentlyHighlighted === id;
    return (
      <span
        className={`${className} ${
          isHighlighted ? "bg-yellow-200 rounded px-1" : ""
        } transition-colors duration-300`}
      >
        {children}
      </span>
    );
  };

 const InfoCard = ({ icon, title, children }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 h-full min-h-[180px]">
    <div className="flex items-center space-x-2 mb-3">
      <div className="text-blue-500">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
    </div>
    <div className="flex items-start space-x-4">
      <div className="text-gray-700">{children}</div>
    </div>
  </div>
);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          <HighlightableText id="pageTitle">
            {translate("Contact-Us")}
          </HighlightableText>
        </h1>
        <div className="mb-6">
          <button
            onClick={handleListenToggle}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${
              isListening
                ? "bg-yellow-400 shadow-lg"
                : "bg-white shadow-sm hover:bg-gray-100"
            }`}
          >
            <Mic size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <InfoCard
                icon={<MapPin size={24} />}
                title={
                  <HighlightableText id="addressTitle">
                    {translate("Address")}
                  </HighlightableText>
                }
              >
                <p>
                  <HighlightableText id="addressContent">
                    {loading ? "Loading..." : settings.en_address}
                  </HighlightableText>
                </p>
                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
              </InfoCard>

              <InfoCard
                icon={<Phone size={24} />}
                title={
                  <HighlightableText id="callTitle">
                    {translate("Call Us")}
                  </HighlightableText>
                }
              >
                <p>
                  <HighlightableText id="callContent">
                    {loading ? "Loading..." : settings.mobileNumber}
                  </HighlightableText>
                </p>
              </InfoCard>

              <InfoCard
                icon={<Mail size={24} />}
                title={
                  <HighlightableText id="emailTitle">
                    {translate("Email")}
                  </HighlightableText>
                }
              >
                <p>
                  <HighlightableText id="emailContent">
                    {loading ? "Loading..." : settings.email}
                  </HighlightableText>
                </p>
              </InfoCard>

              <InfoCard
                icon={<Printer size={29} />}
                title={
                  <HighlightableText id="faxTitle">
                    {translate("Fax")}
                  </HighlightableText>
                }
              />

              <div
                onClick={() => setFeedbackOpen(true)}
                className="group relative sm:col-span-1 bg-[#F0F4FF] p-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex justify-between items-center overflow-hidden min-h-[180px]"
              >
                <div className="z-10">
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-300 to-cyan-300 rounded-full flex items-center justify-center">
                      <MessageSquareQuote size={24} className="text-white" />
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="font-semibold text-gray-700">
                      <HighlightableText id="feedbackTitle">
                        {translate("We value your input")}
                      </HighlightableText>
                    </p>
                    <p className="text-lg font-bold text-blue-800">
                      <HighlightableText id="feedbackSubtitle">
                        {translate("share your thoughts!")}
                      </HighlightableText>
                    </p>
                  </div>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-14 bg-[#673AB7] rounded-l-full flex items-center justify-center transform translate-x-12 group-hover:translate-x-0 transition-transform duration-300 ease-in-out">
                  <ArrowRight
                    size={24}
                    className="text-white transform -translate-x-1"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3 w-full">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3740.7446229612333!2d85.88347727421952!3d20.35216601067498!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909afddfe1db1%3A0x2b97f2457bcfe147!2sMindtrack%20Technologies%20Private%20Limited!5e0!3m2!1sen!2sin!4v1757933591980!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>

      <FeedbackFormModal
        open={feedbackOpen}
        onClose={() => setFeedbackOpen(false)}
      />
    </div>
  );
};

export default ContactPage;