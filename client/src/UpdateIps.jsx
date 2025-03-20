import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateIps() {
    const { id } = useParams();
    const [ipAddress, setIpAddress] = useState('');
    const [name, setName] = useState('');
    const [category, setCategory] = useState(''); // Add state for category
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:3001/ping/getIP/' + id)
            .then(result => {
                setIpAddress(result.data.ipAddress);
                setName(result.data.name);
                setCategory(result.data.category); // Set the category
                console.log(result);
            })
            .catch(err => console.log(err));
    }, [id]);

    const Update = (e) => {
        e.preventDefault();
        axios.put("http://localhost:3001/ping/update/" + id, { ipAddress, name, category }) // Include category in the update
            .then(result => {
                console.log(result);
                navigate('/');
            })
            .catch(err => console.log(err));
    };

    return (
        <div className='d-flex vh-100 bg-primary justify-content-center align-items-center'>
            <div className='w-50 bg-white rounded p-3'>
                <form onSubmit={Update}>
                    <h2>Update IP</h2>
                    <div className='mb-2'>
                        <label htmlFor="">IP Address</label>
                        <input type="text" placeholder='Enter New IP address eg. 8.8.8..' className='form-control'
                            value={ipAddress} onChange={(e) => setIpAddress(e.target.value)} />
                    </div>

                    <div className='mb-2'>
                        <label htmlFor="">Name</label>
                        <input type="text" placeholder='Enter New Name' className='form-control'
                            value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className='mb-2'>
                        <label htmlFor="">Category</label>
                        <select className='form-control' value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="">Select Category</option>
                            <option value="client">Client</option>
                            <option value="NNS">NNS</option>
                            <option value="hardware">Hardware</option>
                            <option value="wireless">Wireless</option>
                            <option value="fibre">Fibre</option>
                        </select>
                    </div>

                    <button className="btn btn-success">Update</button>
                </form>
            </div>
        </div>
    );
}

export default UpdateIps;