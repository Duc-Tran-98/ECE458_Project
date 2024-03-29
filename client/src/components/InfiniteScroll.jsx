/* eslint-disable no-param-reassign */
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import PropTypes from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';
import $ from 'jquery';
import { QueryAndThen } from './UseQuery';

export default function InfinityScroll({
  query, queryName, title, variables, renderItems, titleClassName,
}) {
  InfinityScroll.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    query: PropTypes.object.isRequired,
    queryName: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    variables: PropTypes.object.isRequired,
    renderItems: PropTypes.func, // How you want items to be displayed; optional
    titleClassName: PropTypes.string, // Title classname; for styling
  };

  InfinityScroll.defaultProps = {
    renderItems: null,
    titleClassName: '',
  };
  const [items, setItems] = React.useState([]);
  const [hasMore, setHasMore] = React.useState(true);
  const [total, setTotal] = React.useState(null);
  const getVariables = () => {
    variables.limit = 10;
    variables.offset = items.length;
    return variables;
  };
  const fetchMoreData = () => {
    if (total && items.length >= total) { // If total not null and length exceeds/equal to total, stop scroll
      setHasMore(false);
    } else if (hasMore) { // else, set total and update state
      QueryAndThen({
        query, queryName, getVariables, fetchPolicy: 'no-cache',
      }).then(
        (data) => {
          const newItems = items.concat(data.rows);
          if (data.total < 10) {
            setHasMore(false);
          }
          if (data.total === 0) {
            $('#remove-if-empty').first().remove();
          }
          setItems(newItems);
          setTotal(data.total);
        },
      );
    }
  };
  React.useEffect(() => {
    let active = true;
    (() => {
      if (active) {
        fetchMoreData();
      }
    })();

    return () => {
      active = false;
    }; // if variables prop changes, re-render
  }, [items, variables]);
  return (
    <>
      <h3 className={titleClassName} style={{ zIndex: '10' }}>{title}</h3>
      <InfiniteScroll
        scrollableTarget="scrollableDiv"
        dataLength={items.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<LinearProgress />}
        endMessage={<div className="my-4" />}
      >
        {items.length === 0 && (
          <div className="py-3 bg-light text-center">No Instances</div>
        )}
        {renderItems === null ? (
          items.map((entry) => (
            <div key={entry.id}>
              ID
              {entry.id}
            </div>
          ))
        ) : (
          <ul className="list-group">{renderItems(items)}</ul>
        )}
      </InfiniteScroll>
    </>
  );
}
