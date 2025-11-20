"use client";
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



  return (
    <main className="flex bg-amber-200 h-screen w-screen text-black">
      <div>UserHome</div>
      {/* {userId} */}
      {/* {JSON.stringify(allUsers)} */}
      {/* user search  */}
      <div className="bg-gray-100">
        <input
          className="border border-gray-400"
          type="text"
          name="searchName"
        />
        <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-sm px-2 cursor-pointer">
          search
        </button>
      </div>
    </main>
  );
};

export default UserHome;
