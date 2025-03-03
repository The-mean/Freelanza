import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4">
                <nav className="flex items-center justify-between">
                    <div className="text-xl font-bold text-blue-600">Freelanza</div>
                    <div className="flex items-center space-x-4">
                        <a href="/jobs" className="text-gray-600 hover:text-gray-900">İş İlanları</a>
                        <a href="/freelancers" className="text-gray-600 hover:text-gray-900">Freelancerlar</a>
                        <a href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</a>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header; 