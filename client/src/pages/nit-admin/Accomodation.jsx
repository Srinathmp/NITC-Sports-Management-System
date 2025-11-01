import React, { useState } from 'react';
import { Search, Star, Users, MapPin, Clock, Mail } from 'lucide-react';

const TypeTag = ({ type }) => {
    let colors = '';
    switch (type.toLowerCase()) {
        case 'hostel':
            colors = 'bg-blue-100 text-blue-700';
            break;
        case 'guesthouse':
            colors = 'bg-green-100 text-green-700';
            break;
        case 'dormitory':
            colors = 'bg-orange-100 text-orange-700';
            break;
        default:
            colors = 'bg-gray-100 text-gray-700';
    }
    return (
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${colors}`}>
            {type}
        </span>
    );
};

const AccommodationCard = ({ data }) => {
    const { id, title, type, rating, price, description, availability, distance, checkIn, checkOut, amenities, email, occupancy, } = data;

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                        <div className="flex items-center gap-2 mt-1.5">
                            <TypeTag type={type} />
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                <span className="text-sm text-gray-600 font-medium">{rating}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="text-xl font-bold text-blue-600">{price}</p>
                        <p className="text-sm text-gray-500">per night</p>
                    </div>
                </div>
                
                <p className="text-sm text-gray-600 mt-4">{description}</p>
    
                <div className="space-y-3 mt-4">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{availability}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{distance}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Check-in: {checkIn} | Check-out: {checkOut}</span>
                    </div>
                </div>

                <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700">Amenities:</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {amenities.map(amenity => (
                            <span key={amenity} className="text-xs bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                                {amenity}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-blue-600 hover:underline cursor-pointer">{email}</span>
                </div>

                <div className="mt-6">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{occupancy}% occupied</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${occupancy}%` }}></div>
                    </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors mt-6 cursor-pointer">
                    Book Now
                </button>
            </div>
        </div>
    );
};

function Accommodation() {
    const [activeTab, setActiveTab] = useState('accommodation');

    const accommodationData = [
        { id: 1, title: 'Main Campus Hostel', type: 'Hostel', rating: 4.5, price: '₹500/night', description: 'Well-maintained hostel with modern amenities, located within the campus premises.', availability: '45 of 120 rooms available', distance: '0.5 km from Main Ground', checkIn: '14:00', checkOut: '11:00', amenities: ['WiFi', 'AC', 'Mess', 'Laundry', 'Sports Room'], email: 'hostel@nitrichy.ac.in', occupancy: 63, },
        { id: 2, title: 'Guest House Block A', type: 'Guesthouse', rating: 4.8, price: '₹800/night', description: 'Premium guest house with excellent facilities for comfortable stay.', availability: '23 of 80 rooms available', distance: '1.2 km from Main Ground', checkIn: '15:00', checkOut: '12:00', amenities: ['WiFi', 'AC', 'Restaurant', 'Room Service', 'Parking'], email: 'guesthouse@nitrichy.ac.in', occupancy: 71, },
        { id: 3, title: 'Sports Complex Dormitory', type: 'Dormitory', rating: 4.2, price: '₹300/night', description: 'Budget-friendly accommodation right next to the sports complex.', availability: '89 of 200 rooms available', distance: '0.2 km from Main Ground', checkIn: '13:00', checkOut: '10:00', amenities: ['WiFi', 'Fan', 'Shared Bath', 'Mess', 'Gym Access'], email: 'sports@nitrichy.ac.in', occupancy: 56, },
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <h1 className="text-3xl font-bold text-gray-900">Accommodation & Mess Information</h1>
            <p className="text-gray-600 mt-1">Complete details about accommodation options and dining facilities at NIT Trichy</p>

            <div className="relative my-6">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input type="text" placeholder="Search accommodation options..." className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <nav className="flex space-x-2 p-1.5">
                    <button onClick={() => setActiveTab('accommodation')} className={`w-1/2 py-2.5 rounded-md text-sm font-medium ${activeTab === 'accommodation'? 'bg-white shadow text-blue-600': 'text-gray-600 hover:bg-gray-100'}`} >
                        Accommodation
                    </button>
                    <button onClick={() => setActiveTab('mess')} className={`w-1/2 py-2.5 rounded-md text-sm font-medium ${activeTab === 'mess' ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-gray-100' }`} >
                        Mess & Dining
                    </button>
                </nav>
            </div>

            <div className="pt-6">
                {activeTab === 'accommodation' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {accommodationData.map(item => (
                            <AccommodationCard key={item.id} data={item} />
                        ))}
                    </div>
                )}
                {activeTab === 'mess' && (
                    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center">
                        <p className="text-gray-600">Mess & Dining content goes here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Accommodation;