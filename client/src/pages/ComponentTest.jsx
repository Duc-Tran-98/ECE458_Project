import React from 'react';
import CustomFormBuilder from '../components/CustomFormBuilder';
import MuiDemoForm, { MuiInputsDemo } from '../components/MuiDemoForm';

export default function ComponentTest() {
  return (
    <>
      <CustomFormBuilder />
      <MuiDemoForm editing />
      <MuiInputsDemo />
    </>
  );
}
