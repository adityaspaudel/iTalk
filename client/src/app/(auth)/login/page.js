"use client";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";

const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [data, setData] = useState({});
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  return (
    <main>
      <div>UserLogin</div>

      <div>
        <h1>Sign In</h1>
        {JSON.stringify(formData)}
        <Formik
          initialValues={formData}
          onSubmit={async (values) => {
            await sleep(500);
            alert(JSON.stringify(values, null, 2));
            try {
              const response = await fetch(
                `http://localhost:8000/user/userLogin`,
                {
                  method: "post",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(values),
                }
              );
              const parsedData = await response.json();
              setFormData(parsedData);
              console.log("parsedData", parsedData);
            } catch (error) {
              console.error(error);
            } finally {
              console.log("completed");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <label htmlFor="email">Email</label>
              <Field name="email" placeholder="jane@acme.com" type="email" />

              <label htmlFor="password">password</label>

              <Field name="password" placeholder="password" />

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

export default UserLogin;
