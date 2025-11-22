"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const UserHome = () => {
  const { userId } = useParams();
  console.log(userId);
  const [allUsers, setAllUsers] = useState([]);
  // alert(userId);
  const fetchAllUsers = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8000/user/fetchAllUsers`);
      const data = await response.json();
      console.log(data);
      setAllUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      console.log("completed");
    }
  }, []);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const BACKEND_URL = "http://localhost:8000/user/userSearchByName";

  const [searchTerm, setSearchTerm] = useState("");

  const [searchResult, setSearchResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    const term = searchTerm.trim();

    if (term === "") {
      setSearchResult({ message: "Please type a name to search." });
      return;
    }

    setIsLoading(true);
    setError(null);
    setSearchResult(null);

    const fullBackendUrl = `${BACKEND_URL}?fullName=${encodeURIComponent(
      term
    )}`;

    try {
      const response = await fetch(fullBackendUrl);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Backend request failed with status ${response.status}`
        );
      }

      if (data.users && data.users.length > 0) {
        setSearchResult({
          status: "success",
          resultsCount: data.results,
          users: data.users,
          note: "Successfully fetched real data from backend.",
        });
      } else if (data.message) {
        setSearchResult({ message: data.message });
      } else if (data.error) {
        setError(`Backend Error: ${data.error}`);
      } else {
        // Handle case where no users are found
        setSearchResult({
          message: "No users found matching the search term.",
        });
      }
    } catch (err) {
      setError(
        `Connection Error: ${err.message}. Ensure your backend is running at ${BACKEND_URL}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex bg-amber-200 h-screen w-screen text-black justify-center items-center">
      {/* <div>UserHome</div> */}
      {/* {userId} */}
      {/* {JSON.stringify(allUsers)} */}
      {/* user search  */}

      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-8 font-sans">
        <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full">
          {/* Search Input and Button */}
          <div className="mb-8 flex space-x-2">
            <input
              className="grow px-2 py-1 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              type="text"
              placeholder="Enter Full Name (sends as 'fullName' query)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className={`rounded-sm px-2 py-1 cursor-pointer transition duration-150 shadow-md ${
                isLoading
                  ? "bg-gray-400"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
          </div>

          {/* <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Backend Response (JSON)
          </h2> */}

          {/* Display Error Message */}
          {error && (
            <div className="p-4 mb-4 bg-red-100 text-red-800 rounded-md">
              {error}
            </div>
          )}

          {/* Display Loading State */}
          {isLoading && (
            <div className="p-4 mb-4 bg-yellow-100 text-yellow-800 rounded-md">
              Fetching data from backend...
            </div>
          )}

          {/* Display Results */}
          <div className="p-4  rounded-md overflow-x-auto text-sm">
            <pre>
              {searchResult ? (
                searchResult.users.map((u, i) => (
                  <Link key={u._id} href={`/${userId}/${u._id}`}>
                    <div>{u?.fullName}</div>
                  </Link>
                ))
              ) : (
                <></>
              )}
            </pre>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserHome;
