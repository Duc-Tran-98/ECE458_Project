import React from 'react';
import CustomFormStep from './CustomFormStep';

export default function CustomFormBuilder() {
  return (
    <>
      <h1 className="m-2">Custom Form Builder</h1>
      <CustomFormStep editing />
    </>
  );
}
