"use client";

import { Field, Form, Formik } from "formik";
import Link from "next/link";
import React, { useState } from "react";

const UserRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [resp, setResp] = useState(null);
  const [apiMessage, setApiMessage] = useState(null);

  const [data, setData] = useState({});
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  return (
    <main className="bg-yellow-200 text-black flex flex-col items-center justify-center h-screen w-screen">
      {/* <div>
        {data && (
          <pre className="break-all">
            <div className="break-all">{JSON.stringify(data, null, 2)}</div>
          </pre>
        )}
      </div> */}

      <div className="bg-gray-100 p-4 min-h-64 w-96 rounded-xl ">
        <Formik
          initialValues={formData}
          onSubmit={async (values) => {
            await sleep(500);
            // alert(JSON.stringify(values, null, 2));
            setFormData(values);
            try {
              const response = await fetch(
                `http://localhost:8000/user/userRegistration`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(values),
                }
              );

              if (!response.ok) new Error("something went wrong");

              const parsedData = await response.json();
              setData(parsedData);
              alert(JSON.stringify(parsedData, 2, 2));
            } catch (error) {
              console.error(error);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-2 p-4">
              <h1 className="text-2xl font-bold">Sign Up</h1>

              <div className="flex flex-col ">
                <label htmlFor="fullName">Full Name</label>
                <Field
                  name="fullName"
                  placeholder="fullName"
                  className="border border-gray-400 px-2 py-1 rounded-sm"
                />
              </div>

              <div className="flex flex-col ">
                <label htmlFor="username">Username</label>
                <Field
                  name="username"
                  placeholder="fullname"
                  className="border border-gray-400 px-2 py-1 rounded-sm"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="email">Email</label>
                <Field
                  name="email"
                  placeholder="jabc@gmail.com"
                  type="email"
                  className="border border-gray-400 px-2 py-1 rounded-sm"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="password">Password</label>
                <Field
                  name="password"
                  placeholder="password"
                  type="password"
                  className="border border-gray-400 px-2 py-1 rounded-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-500 hover:bg-green-600 cursor-pointer text-white rounded-sm px-2 py-1"
              >
                Submit
              </button>
              <div className="text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="hover:text-blue-500 cursor-pointer"
                >
                  Login here
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
};

export default UserRegistration;
