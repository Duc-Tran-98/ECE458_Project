import React from 'react';
import SearchSuggest from '../components/SearchSuggest';
import Asynchronous from '../components/AsyncSuggest';

function ComponentTest() {
  return (
    <div className="bg-light">
      <SearchSuggest />
      <Asynchronous />
    </div>
  );
}

export default ComponentTest;
