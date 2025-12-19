import React from "react";
import { TextField, Button } from "@mui/material";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaClock,
  FaEnvelope,
} from "react-icons/fa";
import SendIcon from "@mui/icons-material/Send";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-6xl w-full bg-white shadow-lg rounded-lg p-8 flex">
        {/* Left Column - Store Information */}
        <div className="w-full md:w-1/2 pr-8 mb-8 md:mb-0">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Our Store
          </h1>

          <div className="text-gray-600 mb-4">
            <p className="flex items-center">
              <FaMapMarkerAlt className="text-rose-500 mr-2" />
              <strong>Address:</strong>
            </p>
            <p className="ml-6">
              1 Đ. Đại Cồ Việt, Bách Khoa, Hai Bà Trưng, Hà Nội
            </p>
          </div>

          <div className="text-gray-600 mb-4">
            <p className="flex items-center">
              <FaPhoneAlt className="text-rose-500 mr-2" />
              <strong>Phone:</strong>
            </p>
            <p className="ml-6">(+84) 987-654-321</p>
          </div>

          <div className="text-gray-600 mb-4">
            <p className="flex items-center">
              <FaClock className="text-rose-500 mr-2" />
              <strong>Hours:</strong>
            </p>
            <p className="ml-6">Mon - Fri: 9 AM - 6 PM, Sat: 10 AM - 4 PM</p>
          </div>

          <div className="text-gray-600 mb-4">
            <p className="flex items-center">
              <FaEnvelope className="text-rose-500 mr-2" />
              <strong>Email:</strong>
            </p>
            <p className="ml-6">ecommerce@gmail.com</p>
          </div>

          {/* Map (with iframe) */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Find Us Here
            </h2>
            <div className="mapswrapper">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.6341764178947!2d105.84264359999999!3d21.007296399999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ac71294bf0ab%3A0xc7e2d20e5e04a9da!2zxJDhuqFpIEjhu41jIELDoWNoIEtob2EgSMOgIE7hu5lp!5e0!3m2!1svi!2s!4v1732546488941!5m2!1svi!2s"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Right Column - Contact Form */}
        <div className="w-full md:w-1/2">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center md:text-left">
            Get In Touch With Us
          </h1>
          <p className="text-gray-600 text-center md:text-left mb-8 text-lg">
            For more information about our products & services, please feel free
            to drop us an email. Our staff is always here to help you out. Do
            not hesitate!
          </p>

          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Message sent successfully!");
            }}
          >
            {/* Name */}
            <div>
              <TextField
                label="Full Name"
                variant="outlined"
                fullWidth
                required
                className="bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Email */}
            <div>
              <TextField
                label="Email Address"
                type="email"
                variant="outlined"
                fullWidth
                required
                className="bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Subject */}
            <div>
              <TextField
                label="Subject"
                variant="outlined"
                fullWidth
                className="bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Message */}
            <div>
              <TextField
                label="Message"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
                required
                className="bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Submit Button */}
            <div className="text-center md:text-left">
              <Button variant="contained" endIcon={<SendIcon />}>
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
