  import React, { useState, useEffect } from 'react';
  import Dashboard from './Dashboard/dashboard';
  import { useNavigate } from 'react-router-dom';


  interface AdminPageProps {
    setIsLoggedIn: (isLoggedIn: boolean) => void;
  }

  const AdminPage: React.FC<AdminPageProps>  = () => {
    const [name, setName] = useState('');
    const [type, setType] = useState('newspaper');
    const [imageUrl, setImageUrl] = useState('');
    const [language, setLanguage] = useState('English');
    const [date, setDate] = useState('');
    const [file, setFile] = useState(null); 
    const [publications, setPublications] = useState([]);
    const [selectedPublication, setSelectedPublication] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isEditPopupVisible, setIsEditPopupVisible] = useState(false);
  const [currentEditDate, setCurrentEditDate] = useState(null);
  const [editPdfPath, setEditPdfPath] = useState('');
  const [isAddDatePopupVisible, setIsAddDatePopupVisible] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newPdfPath, setNewPdfPath] = useState('');


  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setIsLoggedIn(false);
      navigate('/signin');
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const response = await fetch('/api/newspapers');
        if (!response.ok) {
          throw new Error('Failed to fetch publications');
        }
        const data = await response.json();
        setPublications(data);
      } catch (error) {
        console.error('Error fetching publications:', error);
        // Handle error state or logging as needed
      }
    };

    fetchPublications();
  }, []); 

    const handlePublicationClick = (publication, type) => {
      setSelectedPublication(publication);
      setSelectedType(type);
      setIsPopupVisible(true);
    };

    const handleEditDate = (date) => {
      const pdfFile = selectedPublication.pdfFiles.find(file => file.date === date);
      setCurrentEditDate(date);
      setEditPdfPath(pdfFile ? pdfFile.path : '');
      setIsEditPopupVisible(true);
    };

    const handleAddDate = async () => {
      if (!newDate || !newPdfPath) {
        alert('Please enter both date and PDF path');
        return;
      }
    
      try {
        const token = localStorage.getItem('authToken');
        console.log('Token being sent:', token);
        const response = await fetch('https://newsappcode1971694234svsvasvasvsavwefwff.onrender.com/api/add-publication-date', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: selectedPublication.name,
            type: selectedType,
            date: newDate,
            pdfPath: newPdfPath
          }),
        });
    
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response status:', response.status);
          console.error('Response text:', errorText);
          throw new Error(`Failed to add publication: ${errorText}`);
        }
    
        // Update the local state
        const updatedPublication = {
          ...selectedPublication,
          dates: [...selectedPublication.dates, newDate].sort(),
          pdfFiles: [...selectedPublication.pdfFiles, { date: newDate, path: newPdfPath }]
        };
        setSelectedPublication(updatedPublication);
    
        // Update the publications state
        setPublications(prev => ({
          ...prev,
          [selectedType]: prev[selectedType].map(pub => 
            pub.name === selectedPublication.name ? updatedPublication : pub
          )
        }));
    
        setIsAddDatePopupVisible(false);
        setNewDate('');
        setNewPdfPath('');
        alert('New date added successfully');
      } catch (error) {
        console.error('Error adding new date:', error);
        alert('Failed to add new date');
      }
    };
    const handleDeleteDate = async (date) => {
      if (window.confirm(`Are you sure you want to delete the issue for ${date}?`)) {
        try {
          const token = localStorage.getItem('authToken');
          const response = await fetch(`https://newsappcode1971694234svsvasvasvsavwefwff.onrender.com/api/delete-publication-date`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: selectedPublication.name,
              type: selectedType,
              date: date
            }),
          });

        if (!response.ok) {
          throw new Error('Failed to delete date');
        }
          // Update the local state
        const updatedPublication = {
          ...selectedPublication,
          dates: selectedPublication.dates.filter(d => d !== date),
          pdfFiles: selectedPublication.pdfFiles.filter(file => file.date !== date)
        };
        setSelectedPublication(updatedPublication);

        // Update the publications state
        setPublications(prev => ({
          ...prev,
          [selectedType]: prev[selectedType].map(pub => 
            pub.name === selectedPublication.name ? updatedPublication : pub
          )
        }));
        alert('Date deleted successfully');
      } catch (error) {
        console.error('Error deleting date:', error);
        alert('Failed to delete date');
      }
    }
  };
  //SAVE EDITED DATE

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`https://newsappcode1971694234svsvasvasvsavwefwff.onrender.com/api/update-publication-pdf`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: selectedPublication.name,
          type: selectedType,
          date: currentEditDate,
          newPdfPath: editPdfPath
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update PDF path');
      }

      // Update the local state
      const updatedPublication = {
        ...selectedPublication,
        pdfFiles: selectedPublication.pdfFiles.map(file => 
          file.date === currentEditDate ? { ...file, path: editPdfPath } : file
        )
      };
      setSelectedPublication(updatedPublication);

      // Update the publications state
      setPublications(prev => ({
        ...prev,
        [selectedType]: prev[selectedType].map(pub => 
          pub.name === selectedPublication.name ? updatedPublication : pub
        )
      }));

      setIsEditPopupVisible(false);
      alert('PDF path updated successfully');
    } catch (error) {
      console.error('Error updating PDF path:', error);
      alert('Failed to update PDF path');
    }
  };





    const handleSignOut = () => {
      // Remove the auth token from localStorage
      localStorage.removeItem('authToken');
      // Update the logged in state
      setIsLoggedIn(false);
      // Redirect to the sign-in page
      navigate('/signin');
    };
    
    const closePopup = () => {
      setIsPopupVisible(false);
      setSelectedPublication(null);
      setSelectedType(null);
    };

    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('authToken');
      console.log('Token being used for API call:', token); // Log the token for debugging
    
      if (!token) {
        alert('No authentication token found. Please log in again.');
        navigate('/signin'); // Redirect to login page
        return;
      }

      if (!file || !date) {
        alert('Please select a PDF file and enter a date');
        return;
      }


      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', name);
      formData.append('date', date);

      try {
        console.log('Sending data:', { name, date, file }); 
        const token = localStorage.getItem('authToken');
        const uploadResponse = await fetch('https://newsappcode1971694234svsvasvasvsavwefwff.onrender.com/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error('Upload response:', errorText); 
          throw new Error(`Failed to upload file: ${errorText}`);
        }

        const uploadResult = await uploadResponse.json();
        console.log('Upload result:', uploadResult);

        const newPublication = { 
          name, 
          type, 
          imageUrl, 
          language, 
          dates: [date], 
          pdfFiles: [{ date, path: uploadResult.path }]
        };

        console.log('Sending publication data:', newPublication);

        const response = await fetch('https://newsappcode1971694234svsvasvasvsavwefwff.onrender.com/api/add-publication', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(newPublication),
        });
        console.log('Response status:', response.status);
    const responseData = await response.json();
    console.log('Response data:', responseData);
    console.log("TOKEN PUBLISH", token)

    if (!response.ok) {
      if (response.status === 401) {
        alert('Authentication failed. Please log in again.');
        navigate('/signin');
      } else {
        throw new Error(responseData.message || 'Failed to add publication');
      }
    } else {
      console.log('Publication added successfully:', responseData);
      // Handle success (e.g., clear form, show success message)
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
      <div className="flex flex-col md:flex-row gap-8 p-8 dark:bg-[#111010] min-h-screen">
        <div className="md:w-1/2">
        <button
              onClick={handleSignOut}
              className="mt-4 px-4 py-2 mb-4 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300"
            >
              Sign Out
            </button>
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Add Publication</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="name">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 p-3 block w-full rounded-lg border-1 border-gray-400 shadow-sm dark:bg-gray-700 dark:text-gray-200 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="type">
                  Type
                </label>
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="mt-1 p-3 block w-full border-1 rounded-md border-gray-400 shadow-sm dark:bg-gray-700 dark:text-gray-200 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="newspaper">Newspaper</option>
                  <option value="magazine">Magazine</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="imageUrl">
                  Thumbnail URL
                </label>
                <input
                  id="imageUrl"
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="mt-1 p-3 block w-full border-1 rounded-md border-gray-400 shadow-sm dark:bg-gray-700 dark:text-gray-200 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="language">
                  Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="mt-1 p-3 block w-full border-1 rounded-md border-gray-400 shadow-sm dark:bg-gray-700 dark:text-gray-200 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="date">
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 p-3 block w-full border-1 rounded-md border-gray-400 shadow-sm dark:bg-gray-700 dark:text-gray-200 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="file">
                  Upload PDF
                </label>
                <input
                  id="file"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="mt-1 p-3 block w-full border-1 rounded-md border-gray-300 shadow-sm dark:bg-gray-700 dark:text-gray-200 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition duration-300"
                >
                  Add Publication
                </button>
              </div>
              <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Dashboard</h2>
            <Dashboard />
          </div>
      
            </form>
          </div>
        </div>
        <div className="md:w-1/2">
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">Current Publications</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Newspapers</h3>
          {publications.newspapers && publications.newspapers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {publications.newspapers.map((newspaper, index) => (
                <div 
                  key={index}
                  className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:bg-blue-50 dark:hover:bg-gray-600"
                  onClick={() => handlePublicationClick(newspaper, 'newspaper')}
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src={newspaper.imageUrl || '/default-newspaper-icon.png'} 
                      alt={newspaper.name} 
                      className="w-12 h-12 object-cover rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">{newspaper.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{newspaper.language}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {newspaper.dates.length} issue{newspaper.dates.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-blue-500 dark:text-blue-300">View Dates →</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No newspapers available.</p>
          )}
        </div>
        
        {/* Similar structure for Magazines */}
        <div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Magazines</h3>
          {publications.magazines && publications.magazines.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {publications.magazines.map((magazine, index) => (
                <div 
                  key={index}
                  className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:bg-green-50 dark:hover:bg-gray-600"
                  onClick={() => handlePublicationClick(magazine, 'magazine')}
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src={magazine.imageUrl || '/default-magazine-icon.png'} 
                      alt={magazine.name} 
                      className="w-12 h-12 object-cover rounded-full"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">{magazine.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{magazine.language}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {magazine.dates.length} issue{magazine.dates.length !== 1 ? 's' : ''}
                    </span>
                    <span className="text-green-500 dark:text-green-300">View Dates →</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No magazines available.</p>
          )}
        </div>
      </div>
    </div>
  </div>
  {isPopupVisible && selectedPublication && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-md w-full">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Available Dates for {selectedPublication.name}
        </h3>
        <ul className="space-y-2 max-h-60 overflow-y-auto">
          {selectedPublication.dates.map((date, index) => (
            <li key={index} className="flex justify-between items-center text-gray-600 dark:text-gray-400">
              <span>{date}</span>
              <div>
                <button 
                  onClick={() => handleEditDate(date)}
                  className="mr-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteDate(date)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between">
          <button 
            onClick={() => setIsAddDatePopupVisible(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Date
          </button>
          <button 
            onClick={closePopup}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )}
  {isEditPopupVisible && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-md w-full">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Edit PDF Path for {currentEditDate}
        </h3>
        <input
          type="text"
          value={editPdfPath}
          onChange={(e) => setEditPdfPath(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter new PDF path"
        />
        <div className="flex justify-end">
          <button 
            onClick={() => setIsEditPopupVisible(false)}
            className="mr-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button 
            onClick={handleSaveEdit}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )}
  {isAddDatePopupVisible && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-md w-full">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-3">
          Add New Date for {selectedPublication.name}
        </h3>
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <input
          type="text"
          value={newPdfPath}
          onChange={(e) => setNewPdfPath(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Enter PDF path"
        />
        <div className="flex justify-end">
          <button 
            onClick={() => setIsAddDatePopupVisible(false)}
            className="mr-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button 
            onClick={handleAddDate}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  )}
  </div>
    );
  };

  export default AdminPage;