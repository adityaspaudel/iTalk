"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const UserHome = () => {
	const { userId } = useParams();
	const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
	const [allUsers, setAllUsers] = useState([]);
	const [followingList, setFollowingList] = useState([]);

	const fetchAllUsers = useCallback(async () => {
		try {
			const response = await fetch(`${NEXT_PUBLIC_API_URL}/user/fetchAllUsers`);
			const data = await response.json();
			setAllUsers(data);

			const filteredUsers = data.filter((user) =>
				user.followers.includes(userId),
			);
			setFollowingList(filteredUsers);
		} catch (error) {
			console.error(error);
		}
	}, [userId, NEXT_PUBLIC_API_URL]);

	useEffect(() => {
		fetchAllUsers();
	}, [fetchAllUsers]);

	// --------------------------
	// SEARCH STATES
	// --------------------------
	const BACKEND_URL = `${NEXT_PUBLIC_API_URL}/user/userSearchByName`;
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
				`${BACKEND_URL}?fullName=${encodeURIComponent(term)}`,
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

	// FOLLOW / UNFOLLOW
	const toggleFollowUnfollow = async (e, targetUser) => {
		e.preventDefault();

		try {
			await fetch(`${NEXT_PUBLIC_API_URL}/user/toggleFollowUnfollow`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ followedBy: userId, followingTo: targetUser }),
			});

			fetchAllUsers();
			if (searchResult) handleSearch();
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<main className="flex min-h-screen w-screen bg-gradient-to-br from-amber-100 to-amber-300 text-black justify-center items-start p-6">
			<div className="flex flex-col items-center max-w-3xl w-full gap-8">
				{/* SEARCH CARD */}
				<div className="bg-white p-6 rounded-2xl shadow-xl w-full">
					<h2 className="text-xl font-semibold mb-4 text-gray-700">
						Search Users
					</h2>

					{/* SEARCH BAR */}
					<div className="mb-6 flex space-x-2">
						<input
							className="grow px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 outline-none"
							type="text"
							placeholder="Search user by full name"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleSearch()}
						/>

						<button
							onClick={handleSearch}
							disabled={isLoading}
							className={`rounded-md px-4 py-2 text-white transition ${
								isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
							}`}
						>
							{isLoading ? "Searching..." : "Search"}
						</button>
					</div>

					{/* ERROR BOX */}
					{error && (
						<div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-md mb-3">
							{error}
						</div>
					)}

					{/* SEARCH RESULTS */}
					<div className="p-3 rounded-md text-sm">
						{searchResult?.users && (
							<div className="flex flex-col gap-3">
								{searchResult.users.map((u) => (
									<div
										key={u._id}
										className="flex justify-between items-center p-3 bg-gray-100 rounded-lg shadow-sm"
									>
										<Link
											className="text-blue-600 font-semibold"
											href={`/${userId}/${u._id}`}
										>
											{u.fullName}
										</Link>

										<button
											onClick={(e) => toggleFollowUnfollow(e, u._id)}
											className={`px-3 py-1 rounded-lg text-white transition ${
												followingList.some((f) => f._id === u._id)
													? "bg-red-500 hover:bg-red-600"
													: "bg-green-600 hover:bg-green-700"
											}`}
										>
											{followingList.some((f) => f._id === u._id)
												? "Unfollow"
												: "Follow"}
										</button>
									</div>
								))}
							</div>
						)}

						{searchResult?.message && (
							<div className="text-gray-700">{searchResult.message}</div>
						)}
					</div>
				</div>
				{followingList.length > 0 && (
					<div className="flex flex-col gap-3 bg-white p-6 rounded-2xl shadow-xl w-full">
						<h2 className="text-xl font-semibold text-gray-700 mb-2">
							Following
						</h2>

						{followingList.map((user) => (
							<div
								key={user._id}
								className="flex justify-between items-center p-4 bg-gray-100 rounded-xl shadow-sm"
							>
								<Link href={`/${userId}/${user._id}`}>
									<div>
										<div className="font-semibold text-gray-800">
											{user.fullName}
										</div>
										<div className="text-gray-600 text-sm">
											@{user.username}
										</div>
									</div>
								</Link>

								<button
									onClick={(e) => toggleFollowUnfollow(e, user._id)}
									className="px-3 py-1 rounded-lg text-white bg-red-500 hover:bg-red-600 transition"
								>
									Unfollow
								</button>
							</div>
						))}
					</div>
				)}{" "}
				{/* ALL USERS LIST */}
				{allUsers.length > 0 && (
					<div className="flex flex-col gap-3 bg-white p-6 rounded-2xl shadow-xl w-full">
						<h2 className="text-xl font-semibold text-gray-700 mb-2">
							All Users
						</h2>

						{allUsers.map((user) => (
							<div
								key={user._id}
								className="flex justify-between items-center p-4 bg-gray-100 rounded-xl shadow-sm"
							>
								<Link href={``}>
									<div>
										<div className="font-semibold text-gray-800">
											{user.fullName}
										</div>
										<div className="text-gray-600 text-sm">
											@{user.username}
										</div>
									</div>
								</Link>

								<button
									onClick={(e) => toggleFollowUnfollow(e, user._id)}
									className={`px-3 py-1 rounded-lg text-white transition ${
										followingList.some((f) => f._id === user._id)
											? "bg-red-500 hover:bg-red-600"
											: "bg-green-600 hover:bg-green-700"
									}`}
								>
									{followingList.some((f) => f._id === user._id)
										? "Unfollow"
										: "Follow"}
								</button>
							</div>
						))}
					</div>
				)}
			</div>
		</main>
	);
};

export default UserHome;
