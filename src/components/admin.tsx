import React, { useState } from 'react';

const AdminForm = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('newspaper');
  const [imageUrl, setImageUrl] = useState('');
  const [language, setLanguage] = useState('English');
  const [date, setDate] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !date) {
      alert('Please select a PDF file and enter a date');
      return;
    }

    // First, upload the file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('date', date);

    try {
      console.log('Sending data:', { name, date, file }); 
      const uploadResponse = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        console.error('Upload response:', errorText); 
        throw new Error(`Failed to upload file: ${errorText}`);
      }

      const uploadResult = await uploadResponse.json();
      console.log('Upload result:', uploadResult);

      // Then, add the publication
      const newPublication = { 
        name, 
        type, 
        imageUrl, 
        language, 
        dates: [date], 
        pdfFiles: [{ date, path: uploadResult.path }]
      };

      console.log('Sending publication data:', newPublication);

      const response = await fetch('http://localhost:3000/api/add-publication', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPublication),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Add publication response:', errorText);  
        throw new Error(`Failed to add publication: ${errorText}`);
      }

      alert('Publication added successfully!');
      setName('');
      setType('newspaper');
      setImageUrl('');
      setLanguage('English');
      setDate('');
      setFile(null);
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
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
            <label className="block uppercase tracking-wide text-gray-700 dark:text-gray-300 text-xs font-bold mb-2" htmlFor="date">
              Date
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="block w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </label>
          </div>
          <div className="w-full px-3 mb-2">
            <label className="block uppercase tracking-wide text-gray-700 dark:text-gray-300 text-xs font-bold mb-2" htmlFor="file">
              Upload PDF
              <input
                id="file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="block w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:text-gray-200"
                required
              />
            </label>
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