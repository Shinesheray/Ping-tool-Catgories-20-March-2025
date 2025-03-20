import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Ips.css'; // Import the CSS file

function AllIps() {
    const [ipAddresses, setIps] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/ping')
            .then(result => setIps(result.data))
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            handlePing();
        }, 15000); // 15 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    const handleDelete = (id) => {
        axios.delete('http://localhost:3001/ping/delete/' + id)
            .then(res => {
                console.log(res);
                setIps(prevIps => prevIps.filter(ip => ip._id !== id));
            })
            .catch(err => console.log(err));
    };

    const handlePing = async () => {
        try {
            const response = await axios.get('http://localhost:3001/ping/ping-all');
            console.log(response.data); // Debugging
            setIps(prevIps =>
                prevIps.map(ip => {
                    const updatedIp = response.data.data.find(p => p.ipAddress === ip.ipAddress);
                    return updatedIp ? { ...ip, status: updatedIp.status === 'success', timestamp: new Date() } : ip;
                })
            );
        } catch (error) {
            console.error('Error pinging all IP addresses:', error);
        }
    };

    const handleSinglePing = async (ipAddress) => {
        try {
            const response = await axios.post('http://localhost:3001/ping/ping-only', { ipAddress });
            console.log(response.data); // Debugging
            setIps(prevIps =>
                prevIps.map(ip =>
                    ip.ipAddress === ipAddress
                        ? { ...ip, status: response.data.data.status, timestamp: new Date() }
                        : ip
                )
            );
        } catch (error) {
            console.error('Error pinging IP address:', error);
        }
    };

    const renderTable = (category) => {
        const filteredIps = ipAddresses.filter(ip => ip.category === category);

        return (
            <table className="table">
                <thead>
                    <tr>
                        <th>IP Address</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Last Ping time</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredIps.map((ipAddresse) => {
                            const lastPingTime = new Date(ipAddresse.timestamp).getTime();
                            const elapsedTime = Date.now() - lastPingTime;

                            let statusText = "Unknown";
                            let badgeClass = "";

                            if (ipAddresse.status) {
                                if (elapsedTime <= 50) {
                                    statusText = "Alive";
                                    badgeClass = "bg-success";
                                } else if (elapsedTime <= 500) {
                                    statusText = "Slow";
                                    badgeClass = "bg-warning";
                                } else {
                                    statusText = "Dead";
                                    badgeClass = "bg-danger";
                                }
                            } else {
                                statusText = "Dead";
                                badgeClass = "bg-danger";
                            }

                            return (
                                <tr key={ipAddresse._id}>
                                    <td>{ipAddresse.ipAddress}</td>
                                    <td>{ipAddresse.name}</td>
                                    <td>
                                        <span className={`badge ${badgeClass}`}>
                                            {statusText}
                                        </span>
                                    </td>
                                    <td>{new Date(ipAddresse.timestamp).toLocaleString()}</td>
                                    <td className="button-group">
                                        <Link to={`/update/${ipAddresse._id}`} className="btn btn-success btn-sm">
                                            Update
                                        </Link>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(ipAddresse._id)}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => handleSinglePing(ipAddresse.ipAddress)}
                                        >
                                            Ping
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        );
    };

    return (
        <div className="container">
            <div className='w-100 bg-white rounded p-3'>
                <Link to="/create" className="btn btn-success mb-3">Add New IP +</Link>
                <button className="btn btn-danger mb-3" onClick={handlePing}>Ping All</button>
                {/*<Link to="/GoogleMapsPing" className="btn btn-warning mb-3">View on Google Maps</Link>*/}
                <div className="grid-container">
                    <div className="category-section">
                        <h3>Client</h3>
                        {renderTable('client')}
                    </div>
                    <div className="category-section">
                        <h3>NNS</h3>
                        {renderTable('NNS')}
                    </div>
                    <div className="category-section">
                        <h3>Hardware</h3>
                        {renderTable('hardware')}
                    </div>
                    <div className="category-section">
                        <h3>Wireless</h3>
                        {renderTable('wireless')}
                    </div>
                    <div className="category-section">
                        <h3>Fibre</h3>
                        {renderTable('fibre')}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AllIps;