import React, { useState, useEffect } from "react";

const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [checkedState, setCheckedState] = useState({});
  const [cache, setCache] = useState({});
  const [page, setPage] = useState(0);

  const fetchData = async (page) => {
    const start = page * 10;
    const url = `https://jsonplaceholder.typicode.com/todos?_start=${start}&_limit=10`;

    if (cache[url]) {
      setData(cache[url]);
      setFilteredData(removeDuplicates(cache[url]));
    } else {
      const response = await fetch(url);
      const result = await response.json();
      const uniqueData = removeDuplicates(result);
      setData(result);
      setFilteredData(uniqueData);
      setCache((prevCache) => ({ ...prevCache, [url]: result }));
    }
  };

  const removeDuplicates = (data) => {
    const titles = new Set();
    return data.filter((item) => {
      if (titles.has(item.title)) {
        return false;
      }
      titles.add(item.title);
      return true;
    });
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  return (
    <div className=" max-w-screen-xl m-auto">
      <h1 className="text-4xl font-medium my-4 text-center">List</h1>
      <div className="flex gap-3 items-center justify-center mb-4">
        <button className="px-6 py-2 rounded-md bg-blue-400 text-base font-semibold" onClick={() => setPage(page - 1)} disabled={page === 0}>
          Prev
        </button>
        <button className="px-6 py-2 rounded-md bg-blue-400 text-base font-semibold" onClick={() => setPage(page + 1)}>Next</button>
      </div>
      <ul className="w-80 m-auto">
        {filteredData.map((item) => (
          <li key={item.id} className="flex gap-4 text-xl">
            <input
              type="checkbox"
              checked={!!checkedState[item.id]}
              onChange={() => toggleCheckbox(item.id)}
            />
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );

  function toggleCheckbox(id) {
    setCheckedState((prev) => ({ ...prev, [id]: !prev[id] }));
  }
};

export default App;
