/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
import React from 'react';
import { print } from 'graphql';
import { gql } from '@apollo/client';
import AsyncSuggest from './AsyncSuggest';

const TagsInput = (props) => {
  const startTags = props.tags;
  // eslint-disable-next-line prefer-const
  let [tags, setTags] = React.useState(props.tags);
  const [removed, setRemoved] = React.useState(['']);
  const [update, setUpdate] = React.useState(false);
  const models = React.useState(props.models);
  // eslint-disable-next-line prefer-destructuring
  const dis = props.dis;
  let query;
  let queryName;
  const GET_MODELS_CAT = gql`
  query ModelCategories {
    getAllModelCategories {
      name
    }
  }
`;
  const GET_INST_CAT = gql`
    query InstrumentCategories {
        getAllInstrumentCategories {
            name
        }
    }
    `;
  if (models[0]) {
    query = print(GET_MODELS_CAT);
    queryName = 'getAllModelCategories';
  } else {
    query = print(GET_INST_CAT);
    queryName = 'getAllInstrumentCategories';
  }

  const removeTags = (indexToRemove) => {
    if (!dis) {
      setRemoved([...removed, tags[indexToRemove]]);
      setTags([...tags.filter((_, index) => index !== indexToRemove)]);
      props.selectedTags([...tags.filter((_, index) => index !== indexToRemove)]);
    }
  };
  const addTags = (tag) => {
    if (typeof tags === 'undefined') {
      setTags([tag]);
    } else if (tag !== '' && !tags.includes(tag)) {
      setTags([...tags, tag]);
      props.selectedTags([...tags, tag]);
    }
  };
  const formatOption = (option) => `${option.name}`;
  const formatSelected = (option, value) => option.name === value.name;
  const onInputChange = (e, v) => {
    addTags(v.name);
  };

  if (startTags) {
    startTags.forEach((element) => {
      if (!removed.includes(element)) addTags(element);
    });
  }

  return (
    <div className="tags-input">
      <ul id="tags">
        {tags && tags.length > 0 ? (tags.map((tag, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={index} className="tag">
            <span className="tag-title">{tag}</span>
            <span
              className="tag-close-icon"
              onClick={() => removeTags(index)}
            >
              X
            </span>
          </li>
        ))) : (<p>No categories attached</p>)}
      </ul>
      {dis ? (
        <input
          type="text"
          // onKeyUp={(event) => (event.key === 'Enter' ? addTags(event) : null)}
          placeholder="Select Categories"
          className="form-control"
          disabled={dis}
        />
      ) : (
        <AsyncSuggest
          query={query}
          queryName={queryName}
          onInputChange={onInputChange}
          label="Select Categories"
          getOptionSelected={formatSelected}
          getOptionLabel={formatOption}
          allowAdditions={false}
        />
      )}
    </div>
  );
};

export default TagsInput;