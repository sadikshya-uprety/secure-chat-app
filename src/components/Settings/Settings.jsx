import React, { useState } from 'react';

const Settings = () => {
  const [vanishMode, setVanishMode] = useState(false);
  const [theme, setTheme] = useState('light');

  const toggleVanishMode = () => {
    setVanishMode(!vanishMode);
    alert(`Vanish mode ${!vanishMode ? 'enabled' : 'disabled'}`);
  };

  const changeTheme = (e) => {
    setTheme(e.target.value);
    alert(`Theme changed to ${e.target.value}`);
  };

  return (
    <div className="settings-page bg-gray-100 p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Settings</h1>

      <div className="mb-6">
        <label className="text-gray-700 font-medium">Vanish Mode:</label>
        <button
          className={`ml-4 px-4 py-2 rounded ${vanishMode ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}
          onClick={toggleVanishMode}
        >
          {vanishMode ? 'Disable' : 'Enable'}
        </button>
      </div>

      <div>
        <label className="text-gray-700 font-medium">Select Theme:</label>
        <select
          className="ml-4 px-3 py-2 border rounded"
          value={theme}
          onChange={changeTheme}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="blue">Blue</option>
        </select>
      </div>
    </div>
  );
};

export default Settings;
