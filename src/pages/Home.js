import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import firstimage from '../images/firstimage.png'; // Use the specific image you want to display

export default function Home() {
  const navigate = useNavigate();

  const redirectToSignup = () => {
    navigate('/signup');
  };

  return (
    <div style={{ backgroundColor: '#E8F5E9', minHeight: '100vh', margin: 0, fontFamily: '"Poppins", sans-serif' }}>
      {/* Navbar */}
      <Navbar />

      {/* Main Content with Static Image */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: 'calc(100vh - 100px)',
          padding: '80px 50px',
          color: '#333',
          maxWidth: '1200px',
          margin: '0 auto',
          flexDirection: 'row',
          textAlign: 'left',
        }}
      >
        <div style={{ flex: '1' }}>
          {/* Heading with Beautiful Font */}
          <h1
            style={{
              fontSize: '4rem',
              fontWeight: 'bold',
              color: '#e74c3c', // Red for first word
              marginBottom: '20px',
              letterSpacing: '2px',
            }}
          >
            Healthy
            <span style={{ color: '#333' }}> Living Made Easy</span>
          </h1>

          {/* Updated Beautiful Text */}
          <p
            style={{
              fontSize: '1.6rem',
              fontWeight: '300',
              color: '#333',
              marginBottom: '30px',
              lineHeight: '1.5',
            }}
          >
            Get personalized plans & one-on-one guidance from our experts to live a healthier life.
          </p>

          {/* Sign Up Button */}
          <button
            onClick={redirectToSignup}
            style={{
              padding: '15px 30px',
              fontSize: '1.4rem',
              backgroundColor: 'green',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              transition: 'background-color 0.3s, transform 0.3s',
              boxShadow: '0px 10px 20px rgba(0, 191, 255, 0.3)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#green';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'green';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            SIGN UP – It’s Free
          </button>
        </div>

        {/* Static Image Section */}
        <div style={{ flex: '1', textAlign: 'center', marginLeft: '50px', marginTop: '50px' }}>
          <div
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              borderRadius: '20px',
              overflow: 'hidden',
              boxShadow: '0 15px 40px rgba(0, 191, 255, 0.2)',
            }}
          >
            <img
              src={firstimage}
              alt="Health tracking visualization"
              style={{
                width: '100%',
                height: '450px',
                objectFit: 'cover',
                borderRadius: '10px',
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
