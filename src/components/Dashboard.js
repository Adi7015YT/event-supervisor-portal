import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Dashboard</h2>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <Link to="/student-progress">
                    <button className="bg-green-500 text-white rounded py-2 px-4 hover:bg-green-700 w-full md:w-auto">
                        Student Progress
                    </button>
                </Link>
                <Link to="/technical-report">
                    <button className="bg-yellow-500 text-white rounded py-2 px-4 hover:bg-yellow-700 w-full md:w-auto">
                        Technical Report
                    </button>
                </Link>
                <Link to="/non-technical-report">
                    <button className="bg-red-500 text-white rounded py-2 px-4 hover:bg-red-700 w-full md:w-auto">
                        Non-Technical Report
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
