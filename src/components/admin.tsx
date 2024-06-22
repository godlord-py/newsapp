import React, { useState } from 'react';

const AdminForm = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('newspaper');
  const [imageUrl, setImageUrl] = useState('');
  const [language, setLanguage] = useState('English');
  const [dates, setDates] = useState(['']);
  const [pdfFiles, setPdfFiles] = useState([{ date: '', path: '' }]);

  const handleDateChange = (index, value) => {
    const newDates = [...dates];
    newDates[index] = value;
    setDates(newDates);
  };

  const handlePathChange = (index, value) => {
    const newPdfFiles = [...pdfFiles];
    newPdfFiles[index].path = value;
    setPdfFiles(newPdfFiles);
  };

  const addDateField = () => {
    setDates([...dates, '']);
    setPdfFiles([...pdfFiles, { date: '', path: '' }]);
  };

  
  const removeDateField = (index) => {
    const newDates = dates.filter((_, i) => i !== index);
    const newPdfFiles = pdfFiles.filter((_, i) => i !== index);
    setDates(newDates);
    setPdfFiles(newPdfFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPublication = { name, type, imageUrl, language, dates, pdfFiles };

    try {
      const response = await fetch('http://localhost:3000/api/add-publication', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPublication),
      });

      if (response.ok) {
        alert('Publication added successfully!');
        setName('');
        setType('newspaper');
        setImageUrl('');
        setLanguage('English');
        setDates(['']);
        setPdfFiles([{ date: '', path: '' }]);
      } else {
        const errorText = await response.text();
        alert(`Failed to add publication: ${errorText}`);
      }
    } catch (error) {
      console.error('Error adding publication:', error);
      alert('Failed to add publication. Please check your network connection.');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Add Newspaper</h2>
        <div className="flex flex-wrap -mx-3">
          <div className="w-full px-3 mb-4">
            <label className="block uppercase tracking-wide text-gray-700 dark:text-gray-300 text-xs font-bold mb-2" htmlFor="name">
              Name
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </label>
          </div>
          <div className="w-full px-3 mb-4">
            <label className="block uppercase tracking-wide text-gray-700 dark:text-gray-300 text-xs font-bold mb-2" htmlFor="type">
              Type
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="block w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
                required
              >
                <option value="newspaper">Newspaper</option>
                <option value="magazine">Magazine</option>
              </select>
            </label>
          </div>
          <div className="w-full px-3 mb-4">
            <label className="block uppercase tracking-wide text-gray-700 dark:text-gray-300 text-xs font-bold mb-2" htmlFor="imageUrl">
              Image URL
              <input
                id="imageUrl"
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="block w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </label>
          </div>
          <div className="w-full px-3 mb-4">
            <label className="block uppercase tracking-wide text-gray-700 dark:text-gray-300 text-xs font-bold mb-2" htmlFor="language">
              Language
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="block w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
                required
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
              </select>
            </label>
          </div>
          <div className="w-full px-3 mb-4">
            <label className="block uppercase tracking-wide text-gray-700 dark:text-gray-300 text-xs font-bold mb-2">
              Dates and PDF Paths
            </label>
            {dates.map((dateField, index) => (
              <div key={index} className="flex flex-wrap -mx-3 mb-2">
                <div className="w-full px-3">
                  <label className="block uppercase tracking-wide text-gray-700 dark:text-gray-300 text-xs font-bold mb-2">
                    Date
                    <input
                    type="date"
                    value={dates}
                    onChange={(e) => handleDateChange(index, e.target.value)}
                    className="block w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
                    required
                  />
                  </label>
                </div>
                <div className="w-full px-3">
                  <label className="block uppercase tracking-wide text-gray-700 dark:text-gray-300 text-xs font-bold mb-2">
                    PDF Path
                <input
                    type="text"
                    value={pdfFiles[index].path}
                    onChange={(e) => handlePathChange(index, e.target.value)}
                    className="block w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
                    required
                  />
                  </label>
                </div>
                {dates.length > 1 && (
                  <div className="w-full px-3">
                    <button
                      type="button"
                      onClick={() => removeDateField(index)}
                      className="inline-block bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
            <div className="w-full px-3">
              <button
                type="button"
                onClick={addDateField}
                className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add Date
              </button>
            </div>
          </div>
        </div>
        <div className="w-full px-3 mb-2">
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Newspaper
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminForm;
