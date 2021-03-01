/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/prop-types */
import React from 'react';

const TagsInput = (props) => {
  // eslint-disable-next-line react/destructuring-assignment
  const [tags, setTags] = React.useState(props.tags);
  const removeTags = (indexToRemove) => {
    setTags([...tags.filter((_, index) => index !== indexToRemove)]);
  };
  const addTags = (event) => {
    if (event.target.value !== '') {
      setTags([...tags, event.target.value]);
      props.selectedTags([...tags, event.target.value]);
      // eslint-disable-next-line no-param-reassign
      event.target.value = '';
    }
  };
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
      <input
        type="text"
        onKeyUp={(event) => (event.key === 'Enter' ? addTags(event) : null)}
        placeholder="Press enter to add categories"
        className="form-control"
      />
    </div>
  );
};

export default TagsInput;
