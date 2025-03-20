import React, { useState } from 'react';
import axios from 'axios';

function PingIp() {
  const [ipAddress, setIpAddress] = useState('');
  const [status, setStatus] = useState('idle'); // Initial state
  const [responseTime, setResponseTime] = useState(null);

  const handleInputChange = (event) => {
    setIpAddress(event.target.value);
  };

  const handlePing = async () => {
    setStatus('pinging'); // Set status to pinging

    try {
      const startTime = Date.now();
      const response = await axios.post('http://localhost:3001/ping', { ipAddress });

      if (response.data.status === 'success') {
        setStatus('success');
        setResponseTime(Date.now() - startTime);
      } else {
        setStatus('failure');
      }
    } catch (error) {
      console.error('Error pinging IP:', error);
      setStatus('error');
    }
  };

  return (
    <div>
      <h1>Ping IP Address</h1>
      <input type="text" value={ipAddress} onChange={handleInputChange} placeholder="Enter IP address" />
      <button onClick={handlePing}>Ping</button>
      {status === 'pinging' && <p>Pinging...</p>}
      {status === 'success' && (
        <div style={{ color: 'green' }}>
          <p>Ping successful! Response time: {responseTime}ms</p>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'green' }}></div>
        </div>
      )}
      {status === 'failure' && (
        <div style={{ color: 'red' }}>
          <p>Ping failed.</p>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'red' }}></div>
        </div>
      )}
      {status === 'error' && <p>Error: Something went wrong.</p>}
    </div>
  );
}

export default PingIp;