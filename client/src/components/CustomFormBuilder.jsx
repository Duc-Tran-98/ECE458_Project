import React from 'react';
import CustomFormStep from './CustomFormStep';

export default function CustomFormBuilder() {
  return (
    <>
      <h2>Custom Form Builder</h2>
      <h4>Hello World</h4>
      <CustomFormStep editing />
      <CustomFormStep editing />
    </>
  );
}
