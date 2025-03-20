import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateIp() {
    const [ipAddress, setIpAddress] = useState("");
    const [name, setName] = useState("");
    const [category, setCategory] = useState("client"); // Default category will be client for now
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/ping', { ipAddress, name, category });
            navigate('/');
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Error response:', error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('Error request:', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error message:', error.message);
            }
        }
    };

    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className='w-50 bg-white rounded p-3'>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="ipAddress" className="form-label">IP Address</label>
                        <input
                            type="text"
                            className="form-control"
                            id="ipAddress"
                            value={ipAddress}
                            onChange={(e) => setIpAddress(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="category" className="form-label">Category</label>
                        <select
                            className="form-control"
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="client">Client</option>
                            <option value="NNS">NNS</option>
                            <option value="hardware">Hardware</option>
                            <option value="wireless">Wireless</option>
                            <option value="fibre">Fibre</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary">Add IP</button>
                </form>
            </div>
        </div>
    );
}

export default CreateIp;