import React from 'react';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/customToast.css';

export default function ToastTest() {
  const notifyLogin = () => toast('Successfully Logged in via Shib!');
  const notifyFailure = () => toast.error('Unfortunately our DB is broken');
  const notifySuccess = () => toast.success('Something was successful!');

  return (
    <div>
      <button onClick={notifyLogin} type="submit">Notify Login!</button>
      <button onClick={notifyFailure} type="submit">Notify Error!</button>
      <button onClick={notifySuccess} type="submit">Notify Success!</button>
    </div>
  );
}
