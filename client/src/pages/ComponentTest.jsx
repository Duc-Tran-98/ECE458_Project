/* eslint-disable max-len */
import React from 'react';
import OAuth from '../components/OAuthLogin';
import ToastTest from '../components/ToastTest';
import TagsInput from '../components/TagsInput';

export default function ComponentTest() {
  const selectedTags = (tags) => {
    console.log(tags);
  };
  return (
    <>
      <TagsInput selectedTags={selectedTags} tags={['Nodejs', 'MongoDB']} />
      <ToastTest />
      <OAuth />
    </>
  );
}
