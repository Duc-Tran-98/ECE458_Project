import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

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
      items: Array.from({ length: 20 }),
      hasMore: true,
      // eslint-disable-next-line react/prop-types
      title: props.title,
    };
    this.fetchMoreData = this.fetchMoreData.bind(this);
  }

  fetchMoreData() {
    const { items } = this.state;
    if (items.length >= 100) {
      this.setState({ hasMore: false });
    }
    setTimeout(() => {
      this.setState({
        items: items.concat(Array.from({ length: 20 })),
      });
    }, 500);
  }

  render() {
    const { title, items, hasMore } = this.state;
    return (
      <>
        <h1>{title}</h1>
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
          {items.map((i, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div style={style} key={index}>
              div - #
              {index}
            </div>
          ))}
        </InfiniteScroll>
      </>
    );
  }
}
export default InfinityScroll;
