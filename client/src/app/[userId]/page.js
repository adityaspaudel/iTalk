"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const UserHome = () => {
	const { userId } = useParams();

	const [allUsers, setAllUsers] = useState([]);
	const [followingList, setFollowingList] = useState([]);

	const fetchAllUsers = useCallback(async () => {
		try {
			const response = await fetch(`http://localhost:8000/user/fetchAllUsers`);
			const data = await response.json();
			setAllUsers(data);

			// Users followed by logged-in user
			const filteredUsers = data.filter((user) =>
				user.followers.includes(userId)
			);
			setFollowingList(filteredUsers);
		} catch (error) {
			console.error(error);
		}
	}, [userId]);

	useEffect(() => {
		fetchAllUsers();
	}, [fetchAllUsers]);

	// -------------------------------------
	// SEARCH STATES
	// -------------------------------------
	const BACKEND_URL = "http://localhost:8000/user/userSearchByName";
	const [searchTerm, setSearchTerm] = useState("");
	const [searchResult, setSearchResult] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleSearch = async () => {
		const term = searchTerm.trim();
		if (!term) {
			setSearchResult({ message: "Please type a name to search." });
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(
				`${BACKEND_URL}?fullName=${encodeURIComponent(term)}`
			);
			const data = await response.json();

			if (!response.ok)
				throw new Error(data.message || "Error searching user.");

			if (data.users?.length > 0) {
				setSearchResult({
					status: "success",
					resultsCount: data.results,
					users: data.users,
				});
			} else {
				setSearchResult({ message: "No users found." });
			}
		} catch (err) {
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	// -------------------------------------
	// FOLLOW/UNFOLLOW
	// -------------------------------------
	const toggleFollowUnfollow = async (e, targetUser) => {
		e.preventDefault();

		try {
			await fetch(`http://localhost:8000/user/toggleFollowUnfollow`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ followedBy: userId, followingTo: targetUser }),
			});

			// Refresh the lists so UI updates instantly
			fetchAllUsers();
			if (searchResult) handleSearch();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<main className="flex bg-amber-200 min-h-screen w-screen text-black content-center items-center">
			<div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-8 font-sans">
				<div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full">
					{/* SEARCH BAR */}
					<div className="mb-8 flex space-x-2">
						<input
							className="grow px-2 py-1 border border-gray-300 rounded-lg"
							type="text"
							placeholder="Search user by full name"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleSearch()}
						/>

						<button
							onClick={handleSearch}
							disabled={isLoading}
							className={`rounded-sm px-3 py-1 cursor-pointer text-white ${
								isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
							}`}
						>
							{isLoading ? "Searching..." : "Search"}
						</button>
					</div>

					{/* ERROR */}
					{error && (
						<div className="p-3 bg-red-200 text-red-800 rounded">{error}</div>
					)}

					{/* SEARCH RESULTS */}
					<div className="p-2 rounded-md text-sm">
						{searchResult?.users && (
							<div className="flex flex-col gap-3">
								{searchResult.users.map((u) => (
									<div
										key={u._id}
										className="flex justify-between items-center"
									>
										<Link href={`/${userId}/${u._id}`}>{u.fullName}</Link>

										<button
											onClick={(e) => toggleFollowUnfollow(e, u._id)}
											className="bg-green-500 hover:bg-green-600 cursor-pointer px-2 py-1 text-white rounded"
										>
											{followingList?.some((f) => f._id === u._id)
												? "Unfollow"
												: "Follow"}
										</button>
									</div>
								))}
							</div>
						)}

						{/* NO RESULT MESSAGE */}
						{searchResult?.message && (
							<div className="text-gray-700">{searchResult.message}</div>
						)}
					</div>
				</div>

				{/* ALL USERS LIST */}
				{allUsers.length > 0 && (
					<div className="flex flex-col gap-2 items-center bg-amber-300 p-2 mt-6 w-96">
						{allUsers.map((user) => (
							<div
								key={user._id}
								className="flex justify-between items-center w-full p-4 bg-gray-200"
							>
								<div>
									<div>{user.fullName}</div>
									<div>{user.username}</div>
								</div>

								<button
									onClick={(e) => toggleFollowUnfollow(e, user._id)}
									className="bg-green-500 hover:bg-green-600 cursor-pointer px-2 py-1 text-white rounded"
								>
									{followingList?.some((f) => f._id === user._id)
										? "Unfollow"
										: "Follow"}
								</button>
							</div>
						))}
					</div>
				)}
			</div>

			{/* DEBUG */}
			<pre>{JSON.stringify(followingList, null, 2)}</pre>
		</main>
	);
};

export default UserHome;
