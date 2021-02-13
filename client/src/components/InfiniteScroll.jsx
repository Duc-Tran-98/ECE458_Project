import React, { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import PropTypes from 'prop-types';
import LinearProgress from '@material-ui/core/LinearProgress';
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
      total: null,
      title: props.title,
      query: props.query,
      queryName: props.queryName,
      variables: props.variables,
      titleClassName: props.titleClassName,
    };
    this.renderItems = props.renderItems;
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
    const { total } = this.state;
    let { items } = this.state;
    if (total && items.length >= total) { // If total not null and length exceeds/equal to total, stop scroll
      this.setState({ hasMore: false });
    } else { // else, set total and update state
      QueryAndThen({ query, queryName, getVariables: this.getVariables }).then(
        (data) => {
          items = items.concat(data.rows);
          if (data.total < 10) {
            this.setState({ hasMore: false });
          }
          this.setState({ total: data.total, items });
        },
      );
      // eslint-disable-next-line react/destructuring-assignment
      // total = this.state.total;
      // if (total <= 10) {
      //   this.setState({ hasMore: false });
      // }
    }
  }

  render() {
    const {
      title, items, hasMore, titleClassName,
    } = this.state;
    return (
      <>
        <h2 className={titleClassName}>{title}</h2>
        <hr />
        <InfiniteScroll
          scrollableTarget="scrollableDiv"
          dataLength={items.length}
          next={this.fetchMoreData}
          hasMore={hasMore}
          loader={<LinearProgress />}
          endMessage={(
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          )}
        >
          {this.renderItems === null ? (
            items.map((entry) => (
              <div style={style} key={entry.id}>
                ID
                {entry.id}
              </div>
            ))
          ) : (
            <ul className="list-group">{this.renderItems(items)}</ul>
          )}
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
  renderItems: PropTypes.func, // How you want items to be displayed; optional
  titleClassName: PropTypes.string, // Title classname; for styling
};

InfinityScroll.defaultProps = {
  renderItems: null,
  titleClassName: '',
};

export default InfinityScroll;
