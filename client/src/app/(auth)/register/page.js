"use client";

import { Field, Form, Formik } from "formik";
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
    <main className="bg-blue-300 text-black flex flex-col items-center justify-center">
      <h1>User Registration</h1>
      {/* <div>
        {data && (
          <pre className="break-all">
            <div className="break-all">{JSON.stringify(data, null, 2)}</div>
          </pre>
        )}
      </div> */}

      <div>
        <h1>Sign Up</h1>
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
            <Form>
              <div className="flex gap-2">
                <label htmlFor="fullName">Full Name</label>
                <Field name="fullName" placeholder="fullName" />
              </div>

              <div className="flex gap-2">
                <label htmlFor="username">Username</label>
                <Field name="username" placeholder="fullname" />
              </div>

              <div className="flex gap-2">
                <label htmlFor="email">Email</label>
                <Field name="email" placeholder="jabc@gmail.com" type="email" />
              </div>

              <div className="flex gap-2">
                <label htmlFor="password">Password</label>
                <Field name="password" placeholder="password" type="password" />
              </div>

              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </main>
  );
};

export default UserRegistration;
