import React from 'react';
import CustomFormBuilder from '../components/CustomFormBuilder';
import AccordionWrapper from '../components/AccordionWrapper';

export default function ComponentTest() {
  return (
    <>
      <AccordionWrapper header="Custom Form" contents={<CustomFormBuilder />} />
    </>
  );
}
