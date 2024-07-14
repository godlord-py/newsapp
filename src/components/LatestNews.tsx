// import React, { useEffect, useState } from 'react';
// import NavBar from '../layouts/Navbar';

// const NewsFeed: React.FC = () => {
//   const [newsData, setNewsData] = useState<any[]>([]);
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [filterBySource, setFilterBySource] = useState<string>('');
//   const [selectedCountry, setSelectedCountry] = useState<string>('in'); // Default country is India
//     const apiKey = "cec30f314b0d40a5acbec1e7f2bc521e";

//   useEffect(() => {
//     const fetchNewsData = async () => {
//       try {
//         const url = `https://newsapi.org/v2/top-headlines?country=${selectedCountry}&apiKey=${apiKey}`;

//         const req = new Request(url);
//         const response = await fetch(req);
//         const data = await response.json();
//         setNewsData(data.articles);
//         console.log('News data:', data.articles);
//       } catch (error) {
//         console.error('Error fetching news data:', error);
//       }
//     };

//     fetchNewsData();
//   }, [selectedCountry]);

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//   };

//   const handleFilterBySource = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setFilterBySource(e.target.value);
//   };

//   const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedCountry(e.target.value);
//   };

//   // Get unique news source names for dropdown options
//   const newsSources = newsData ? [...new Set(newsData.map(article => article.source.name))] : [];
  
//   // Filter news based on search term and selected source
//   const filteredNews = newsData ? newsData.filter(article =>
//     article.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
//     (filterBySource === '' || article.source.name.toLowerCase() === filterBySource.toLowerCase())
// ) : [];


//   return (
//     <>
//       <div className="dark:bg-[#111010] container mx-auto py-8">
//         <h2 className="text-6xl dark:bg-[#111010] font-bold mb-4 text-center font-serif">Latest News</h2>
//         <div className="mb-4">
//           <input
//             type="text"
//             placeholder="Search by news name"
//             value={searchTerm}
//             onChange={handleSearch}
//             className="mb-4 px-4 py-2 border-2 border-slate-500 rounded-lg mr-4"
//           />
//         </div>
//         <div className="flex mb-8 flex-wrap space-x-2">
//           <select
//             value={selectedCountry}
//             onChange={handleCountryChange}
//             className="px-2 border rounded-3xl"
//           >
//             <option value="in">India</option>
//             <option value="us">USA</option>
//             <option value="ae">United Arab Emirates</option>
//             <option value="ar">Argentina</option>
//             <option value="at">Austria</option>
//             <option value="au">Australia</option>
//             <option value="be">Belgium</option>
//             <option value="bg">Bulgaria</option>
//             <option value="br">Brazil</option>
//             <option value="ca">Canada</option>
//             <option value="ch">Switzerland</option>
//             <option value="cn">China</option>
//             <option value="co">Colombia</option>
//             <option value="cu">Cuba</option>
//             <option value="cz">Czech Republic</option>
//             <option value="de">Germany</option>
//             <option value="eg">Egypt</option>
//             <option value="fr">France</option>
//             <option value="gb">United Kingdom</option>
//             <option value="gr">Greece</option>
//             <option value="hk">Hong Kong</option>
//             <option value="hu">Hungary</option>
//             <option value="id">Indonesia</option>
//             <option value="ie">Ireland</option>
//             <option value="it">Italy</option>
//             <option value="jp">Japan</option>
//             <option value="kr">South Korea</option>
//             <option value="lt">Lithuania</option>
//             <option value="lv">Latvia</option>
//             <option value="ma">Morocco</option>
//             <option value="mx">Mexico</option>
//             <option value="my">Malaysia</option>
//             <option value="ng">Nigeria</option>
//             <option value="nl">Netherlands</option>
//             <option value="no">Norway</option>
//             <option value="nz">New Zealand</option>
//             <option value="ph">Philippines</option>
//             <option value="pl">Poland</option>
//             <option value="pt">Portugal</option>
//             <option value="ro">Romania</option>
//             <option value="rs">Serbia</option>
//             <option value="ru">Russia</option>
//             <option value="sa">Saudi Arabia</option>
//             <option value="se">Sweden</option>
//             <option value="sg">Singapore</option>
//             <option value="si">Slovenia</option>
//             <option value="sk">Slovakia</option>
//             <option value="th">Thailand</option>
//             <option value="tr">Turkey</option>
//             <option value="tw">Taiwan</option>
//             <option value="ua">Ukraine</option>
//             <option value="ve">Venezuela</option>
//             <option value="za">South Africa</option>
//             <option value="">Worldwide</option>
//           </select>
//           <button
//             className={`px-4 py-2 border rounded-3xl dark:hover:bg-blue-500 hover:bg-green-200 ${filterBySource === '' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 dark:bg-slate-800 dark:text-white'}`}
//             onClick={() => setFilterBySource('')}
//           >
//             All Sources
//           </button>
//           {newsSources.map((source, index) => (
//             <button
//               key={index}
//               className={`mt-2 px-4 py-2 border rounded-3xl dark:hover:bg-purple-950 hover:bg-green-200 ${filterBySource === source ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 dark:bg-slate-800 dark:text-white'}`}
//               onClick={() => setFilterBySource(source)}
//             >
//               {source}
//             </button>
//           ))}
//         </div>
      
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
//           {filteredNews.map((article, index) => (
//             <a key={index} href={article.url} target="_blank" rel="noopener noreferrer" className="p-4 border rounded-lg block dark:hover:bg-slate-900 hover:bg-gray-100">
//               <h3 className="text-xl font-bold mb-2">{article.title}</h3>
//               <img src={article.urlToImage} alt={article.title} className="w-full h-48 object-cover mb-2" />
//               <p className="text-gray-600 mb-2">{article.description}</p>
//               <p className='text-blue-500'>Click To Read more</p>
//               <p className="text-gray-500">{new Date(article.publishedAt).toLocaleString()}</p>
//             </a>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// };

// export default NewsFeed;
