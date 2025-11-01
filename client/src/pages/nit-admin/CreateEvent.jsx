import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

const FormInput = ({ label, placeholder, required }) => (
    <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input type="text" placeholder={placeholder} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
);

const FormSelect = ({ label, placeholder, required, options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleSelect = (option) => {
        onChange(option);
        setIsOpen(false);
    };

    return (
        <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative" ref={dropdownRef}>
                <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center text-left" >
                    <span className={value ? 'text-gray-900' : 'text-gray-500'}>
                        {value || placeholder}
                    </span>
                    <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <ul className="p-1">
                            {options.map((option) => (
                                <li key={option} onClick={() => handleSelect(option)} className={`p-2 text-gray-800 rounded-md cursor-pointer ${value === option ? 'bg-gray-100 font-medium' : 'hover:bg-gray-100'}`} >
                                    {option}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

const FormDateInput = ({ label, placeholder, required }) => (
    <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <input type="text" placeholder={placeholder} onFocus={(e) => (e.target.type = 'date')} onBlur={(e) => (e.target.type = 'text')} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
    </div>
);

const FormTextarea = ({ label, placeholder }) => (
    <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
            {label}
        </label>
        <textarea
            placeholder={placeholder}
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
    </div>
);

function CreateEvent() {
    const [sportType, setSportType] = useState('');

    const sportOptions = [ 'Basketball', 'Football', 'Cricket', 'Volleyball', 'Badminton', 'Table Tennis', 'Tennis', 'Chess', 'Athletics', 'Swimming' ];

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Create Event</h1>
                <p className="text-gray-600">NIT Trichy</p>
            </div>

            <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Create New Event</h2>
                    <p className="text-sm text-gray-500">Add a new sports event to the tournament schedule</p>
                </div>

                <form className="space-y-6">
                    <FormInput label="Event Name" placeholder="e.g., Men's Basketball Finals" required />

                    <FormSelect label="Sport Type" placeholder="Select sport type" required options={sportOptions} value={sportType} onChange={setSportType} /> 
                    
                    <FormInput label="Venue" placeholder="e.g., Main Sports Complex" required />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormDateInput label="Start Date" placeholder="Pick a date" required />
                        <FormDateInput label="End Date" placeholder="Pick a date" required />
                    </div>

                    <FormTextarea label="Description" placeholder="Enter event details and description..." />

                    <button type="submit" className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer" >
                        Create Event
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateEvent;