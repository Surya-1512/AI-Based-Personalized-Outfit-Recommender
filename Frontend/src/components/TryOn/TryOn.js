import React, { useState, useEffect } from "react";
import axios from "axios";
import backendUrl from "../Product/axios"; // Import backend URL from axios.js
import "./TryOn.css"; // Import CSS file for styling

const TryOn = () => {
  const [clothImage, setClothImage] = useState(null); 
  const [personImage, setPersonImage] = useState(null);
  const [finalImage, setFinalImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({
    cloth: null,
    person: null,
    mainScript: null,
    finalImage: null,
  });
  const [loading, setLoading] = useState(false); // Loading state

  const handleClothImageChange = (event) => {
    setClothImage(event.target.files[0]);
    setUploadStatus((prevStatus) => ({ ...prevStatus, cloth: null }));
  };

  const handlePersonImageChange = (event) => {
    setPersonImage(event.target.files[0]);
    setUploadStatus((prevStatus) => ({ ...prevStatus, person: null }));
  };

  const uploadClothImage = async () => {
    setLoading(true); // Set loading state to true
    const formData = new FormData();
    formData.append('cloth_image', clothImage);

    try {
      await axios.post(`${backendUrl}/upload_cloth`, formData); // Use backend URL variable
      setUploadStatus((prevStatus) => ({ ...prevStatus, cloth: 'success' }));
      console.log('Cloth image uploaded successfully');
    } catch (error) {
      setUploadStatus((prevStatus) => ({ ...prevStatus, cloth: 'failure' }));
      console.error('Error uploading cloth image:', error);
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  const uploadPersonImage = async () => {
    setLoading(true); // Set loading state to true
    const formData = new FormData();
    formData.append('person_image', personImage);

    try {
      await axios.post(`${backendUrl}/upload_person`, formData); // Use backend URL variable
      setUploadStatus((prevStatus) => ({ ...prevStatus, person: 'success' }));
      console.log('Person image uploaded successfully');
    } catch (error) {
      setUploadStatus((prevStatus) => ({ ...prevStatus, person: 'failure' }));
      console.error('Error uploading person image:', error);
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  const runMainScript = async () => {
    setLoading(true); // Set loading state to true
    try {
      await axios.get(`${backendUrl}/run_main_py`, {
        headers: {
          "ngrok-skip-browser-warning": "skip-browser-warning"
        }
      }); // Use backend URL variable
      // Update the status to indicate success
      setUploadStatus((prevStatus) => ({ ...prevStatus, mainScript: 'success' }));
      console.log('Main script executed successfully');
    } catch (error) {
      // Update the status to indicate failure
      setUploadStatus((prevStatus) => ({ ...prevStatus, mainScript: 'failure' }));
      console.error('Error executing main script:', error);
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  const displayFinalImage = async () => {
    setLoading(true); // Set loading state to true
    try {
      const response = await axios.get(`${backendUrl}/display_image`, {
          responseType: 'blob',
          headers: {
            "ngrok-skip-browser-warning": "skip-browser-warning"
          }
      });
      const imageUrl = URL.createObjectURL(response.data);
      setFinalImage(imageUrl);
      setUploadStatus((prevStatus) => ({ ...prevStatus, finalImage: 'success' }));
    } catch (error) {
      setUploadStatus((prevStatus) => ({ ...prevStatus, finalImage: 'failure' }));
      console.error('Error displaying final image:', error);
    } finally {
      setLoading(false); // Set loading state to false
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setUploadStatus((prevStatus) => ({
        ...prevStatus,
        cloth: null,
        person: null,
        mainScript: null,
        finalImage: null,
      }));
    }, 5000);

    return () => clearTimeout(timer);
  }, [uploadStatus]);

  return (
    <div className="container">
      <h1 className="heading">TryOn Component</h1>

      <Notification uploadStatus={uploadStatus} loading={loading} />

      <div className="upload-row">
        <div className="upload-box cloth-box">
          <h2>Upload Cloth Image</h2>
          <input type="file" onChange={handleClothImageChange} accept="image/*" />
          <button onClick={uploadClothImage} disabled={loading}>Upload</button> {/* Disable button based on loading state */}
        </div>

        <div className="upload-box person-box">
          <h2>Upload Person Image</h2>
          <input type="file" onChange={handlePersonImageChange} accept="image/*" />
          <button onClick={uploadPersonImage} disabled={loading}>Upload</button> {/* Disable button based on loading state */}
        </div>
      </div>

      <div className="process-box">
        <h2 className="center">Process Uploaded Images</h2>
        <div className="process-buttons">
          <button onClick={runMainScript} disabled={loading}>Process Images</button> {/* Disable button based on loading state */}
          <button onClick={displayFinalImage} disabled={loading}>Display Output</button> {/* Disable button based on loading state */}
        </div>
        {uploadStatus.mainScript && (
          <NotificationMessage
            status={uploadStatus.mainScript}
            message={uploadStatus.mainScript === 'success' ? 'Images Processed Successfully!' : 'Failed to Execute Main Script. Please try again'}
          />
        )}
        {uploadStatus.finalImage && (
          <NotificationMessage
            status={uploadStatus.finalImage}
            message={uploadStatus.finalImage === 'success' ? 'Final Image Displayed Successfully' : 'Failed to Display Final Image. Please try again'}
          />
        )}
      </div>

      {finalImage && (
        <div className="final-image-container">
          <h2 className="center">Final Image</h2>
          <img src={finalImage} alt="Final Image" className="final-image" />
        </div>
      )}
    </div>
  );
};

const Notification = ({ uploadStatus, loading }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    const messages = Object.values(uploadStatus).filter((status) => status !== null);
    const lastMessage = messages[messages.length - 1];

    if (lastMessage || loading) {
      setNotificationMessage(loading ? 'Waiting...' : lastMessage === 'success' ? 'Action Successful' : 'Action Failed. Please try again');
      setIsVisible(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [uploadStatus, loading]);

  return (
    <>
      {isVisible && <div className={`notification ${notificationMessage === 'Waiting...' ? 'waiting' : notificationMessage === 'Action Successful' ? 'success' : 'failure'}`}>{notificationMessage}</div>}
    </>
  );
};

const NotificationMessage = ({ status, message }) => {
  return (
    <div className={`notification ${status === 'success' ? 'success' : 'failure'}`}>{message}</div>
  );
};

export default TryOn;
