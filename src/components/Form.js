import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import '../styles/Form.css';

const Form = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    mobile: '',
    otp: '',
    generatedOtp: ''
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [errors, setErrors] = useState({});

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    const usernameRegex = /^[0-9A-Za-z]{6,16}$/;
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;
    const mobileRegex = /^\d{10}$/;

    if (!usernameRegex.test(formData.username)) {
      newErrors.username = 'Username must be 6-16 characters and alphanumeric.';
    }
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email must be valid and end with .com.';
    }
    if (!passwordRegex.test(formData.password)) {
      newErrors.password = 'Password must be 8-16 characters and include at least one digit, one lowercase letter, one uppercase letter, and one special character.';
    }
    if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be exactly 10 digits.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOtp = (e) => {
    e.preventDefault();
    const otp = generateOtp();
    setFormData({ ...formData, generatedOtp: otp });

    const templateParams = {
      to_name: formData.username,
      to_email: formData.email,
      message: `Your OTP is ${otp}`,
    };

    emailjs.send('service_vbmjcid', 'template_pafiwym', templateParams, 'kOmCRJu5kjLT6kd_H')
      .then(() => {
        setOtpSent(true);
        alert('OTP sent successfully!');
      }, (error) => {
        console.log(error.text);
        alert('Failed to send OTP.');
      });
  };

  const verifyOtp = () => {
    if (formData.otp === formData.generatedOtp) {
      setOtpVerified(true);
      alert('OTP verified successfully!');
    } else {
      alert('Invalid OTP.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!otpVerified) {
      alert('Please verify your OTP first.');
      return;
    }
    if (validateForm()) {
      // Submit form data
      console.log('Form submitted', formData);
    }
  };

  return (
    <div className="form-container">
      <h1>OTP Form</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && <p className="error-message">{errors.username}</p>}
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
          <button
            type="button"
            className="btn btn-primary mt-2"
            onClick={sendOtp}
            disabled={otpSent}
          >
            Send OTP
          </button>
        </div>
        {otpSent && (
          <div className="form-group">
            <label>OTP:</label>
            <input
              type="text"
              className="form-control"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="btn btn-secondary mt-2"
              onClick={verifyOtp}
            >
              Verify OTP
            </button>
          </div>
        )}
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>
        <div className="form-group">
          <label>Mobile:</label>
          <input
            type="text"
            className="form-control"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
          {errors.mobile && <p className="error-message">{errors.mobile}</p>}
        </div>
        <button type="submit" className="btn btn-success" disabled={!otpVerified}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;
