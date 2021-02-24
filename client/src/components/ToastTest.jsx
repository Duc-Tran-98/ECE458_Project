import React from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ToastTest() {
  const notify = () => toast('Successfully Logged in via Shib!');

  return (
    <div>
      <button onClick={notify} type="submit">Notify!</button>
      <ToastContainer />
    </div>
  );
}
