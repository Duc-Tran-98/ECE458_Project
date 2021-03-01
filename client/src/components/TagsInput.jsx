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
  const [tags, setTags] = React.useState([]);
  React.useEffect(() => {
    console.log(props);
    setTags(props.tags);
    console.log(props.tags);
    console.log(startTags);
    console.log('NOW');
  }, []);
  const models = React.useState(props.models);
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
  const [dis, setDis] = React.useState(props.disable);
  const removeTags = (indexToRemove) => {
    if (!dis) {
      setTags([...tags.filter((_, index) => index !== indexToRemove)]);
      props.selectedTags([...tags.filter((_, index) => index !== indexToRemove)]);
    }
  };
  const addTags = (tag) => {
    if (tag !== '' && !tags.includes(tag)) {
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
    startTags.forEach((element) => addTags(element));
  }
  console.log('adding');

  return (
    <div className="tags-input">
      <ul id="tags">
        {tags.map((tag, index) => (
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
        ))}
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
