import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import PropTypes from 'prop-types';
import { QueryAndThen } from './UseQuery';

const style = {
  height: 30,
  border: '1px solid green',
  margin: 6,
  padding: 8,
};

class InfinityScroll extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      hasMore: true,
      title: props.title,
      query: props.query,
      queryName: props.queryName,
      variables: props.variables,
    };
    this.fetchMoreData = this.fetchMoreData.bind(this);
    this.getVariables = this.getVariables.bind(this);
  }

  componentDidMount() {
    this.fetchMoreData();
  }

  getVariables() {
    const { variables, items } = this.state;
    variables.limit = 10;
    variables.offset = items.length;
    return variables;
  }

  fetchMoreData() {
    const { query, queryName } = this.state;
    let { items } = this.state;
    QueryAndThen({ query, queryName, getVariables: this.getVariables }).then(
      (data) => {
        items = items.concat(data);
        console.log('items');
        console.log(items);
        this.setState({ items });
      },
    );
    // const { items } = this.state;
    // if (items.length >= 100) {
    //   this.setState({ hasMore: false });
    // }
    // setTimeout(() => {
    //   this.setState({
    //     items: items.concat(Array.from({ length: 20 })),
    //   });
    // }, 500);
  }

  render() {
    const { title, items, hasMore } = this.state;
    return (
      <>
        <h2>{title}</h2>
        <hr />
        <InfiniteScroll
          scrollableTarget="scrollableDiv"
          dataLength={items.length}
          next={this.fetchMoreData}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={(
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          )}
        >
          {items.map((entry) => (
            <div style={style} key={entry.id}>
              serial #
              {entry.serialNumber}
            </div>
          ))}
        </InfiniteScroll>
      </>
    );
  }
}

InfinityScroll.propTypes = {
  query: PropTypes.string.isRequired,
  queryName: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  variables: PropTypes.object.isRequired,
};

export default InfinityScroll;
