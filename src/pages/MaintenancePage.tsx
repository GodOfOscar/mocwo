import React from 'react';
import { Wrench, Clock } from 'lucide-react';

const MaintenancePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 text-white p-4">
      <div className="text-center space-y-6">
        <Wrench className="w-24 h-24 text-blue-400 mx-auto animate-bounce" />
        <h1 className="text-5xl md:text-6xl font-black tracking-tight">Site Under Maintenance</h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          We're currently performing essential updates and improvements to bring you a better experience.
          Thank you for your patience and understanding.
        </p>
        <div className="flex items-center justify-center gap-3 text-slate-400">
          <Clock className="w-5 h-5" />
          <span className="text-lg font-medium">We'll be back shortly!</span>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;