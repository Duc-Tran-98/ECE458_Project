import React from 'react';
import PropTypes from 'prop-types';

export default function ImportError({ allRowErrors }) {
  ImportError.propTypes = {
    allRowErrors: PropTypes.instanceOf(Array).isRequired,
  };

  console.log('Creating Import Error Component with allRowErrors: ');
  console.log(allRowErrors);

  const errorItems = allRowErrors.map(((rowError) => (
    <li>
      Row:
      {' '}
      {rowError.row}
    </li>
  )
  ));

  return (
    <>
      <ul>{errorItems}</ul>
    </>
  );
}
