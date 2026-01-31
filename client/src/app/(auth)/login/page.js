"use client";
import { Field, Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const UserLogin = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [apiMessage, setApiMessage] = useState(null);
	const [data, setData] = useState({});
	const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
	const router = useRouter();
	return (
		<div className="flex flex-col  bg-yellow-200 text-black justify-center items-center p-4  h-screen w-screen">
			<main className="flex flex-col min-h-64 w-96 bg-gray-100 text-black justify-center items-center p-4 rounded-xl">
				<div className="w-full">
					{/* {JSON.stringify(formData)} */}
					<Formik
						className="w-full"
						initialValues={formData}
						onSubmit={async (values) => {
							await sleep(500);
							// alert(JSON.stringify(values, null, 2));
							try {
								const response = await fetch(
									`http://localhost:8000/user/userLogin`,
									{
										method: "post",
										headers: { "Content-Type": "application/json" },
										body: JSON.stringify(values),
									}
								);
								if (!response.ok) {
									const msg = await response.message;
									setApiMessage(msg);
									throw new Error("login error");
								}
								const parsedData = await response.json();
								setFormData(parsedData);
								setApiMessage(parsedData?.message);
								console.log("parsedData", parsedData);
								alert("login successful");
								router.push(`/${parsedData.user.id}`);
							} catch (error) {
								console.error(error);
							} finally {
								console.log("completed");
							}
						}}
					>
						{({ isSubmitting }) => (
							<Form className="flex flex-col justify-center w-full gap-2 p-4">
								<h1 className="text-2xl font-bold">Sign In</h1>
								<div className="flex flex-col">
									<label htmlFor="email">Email</label>
									<Field
										name="email"
										placeholder="jane@acme.com"
										type="email"
										className="px-2 py-1 w-full border border-gray-400"
									/>
								</div>
								<div className="flex flex-col">
									<label htmlFor="password">Password</label>
									<Field
										name="password"
										placeholder="password"
										type="password"
										className="px-2 py-1 w-full border border-gray-400"
									/>
								</div>
								<button
									type="submit"
									disabled={isSubmitting}
									className="bg-green-500 hover:bg-green-600 text-sm mt-2 rounded-lg p-2 text-white cursor-pointer"
								>
									Submit
								</button>
								<div className="text-sm">
									Do not have an account?{" "}
									<Link href="/register" className="hover:text-blue-500">
										Register here
									</Link>
								</div>
							</Form>
						)}
					</Formik>
				</div>
			</main>
			<div>{JSON.stringify(formData)}</div>
		</div>
	);
};

export default UserLogin;
