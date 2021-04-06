import React from 'react';
import { useHistory } from 'react-router-dom';
import { ServerPaginationGrid } from '../components/UITable';
import UserContext from '../components/UserContext';

export default function CalibrationApprovalPage() {
  const user = React.useContext(UserContext);
  const history = useHistory();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const [initPage, setInitPage] = React.useState(parseInt(urlParams.get('page'), 10));
  const [initLimit, setInitLimit] = React.useState(parseInt(urlParams.get('limit'), 10));
  const [orderBy, setOrderBy] = React.useState(urlParams.get('orderBy'));
  const [sortBy, setSortBy] = React.useState(urlParams.get('sortBy'));
  const [update, setUpdate] = React.useState(false);
  const getAndSetUrlVals = (search = null) => {
    const urlVals = new URLSearchParams(search || window.location.search);
    const lim = parseInt(urlVals.get('limit'), 10);
    const pg = parseInt(urlVals.get('page'), 10);
    const order = urlVals.get('orderBy');
    const sort = urlVals.get('sortBy');
    setInitLimit(lim);
    setInitPage(pg);
    setOrderBy(order);
    setSortBy(sort);
  };
  React.useEffect(() => {
    history.listen((location) => {
      let active = true;
      (async () => {
        if (!active) return;
        getAndSetUrlVals(location.search); // if history.push/replace or pop happens, update our state
        // based on the search params
      })();
      return () => {
        active = false;
      };
    });
  }, []);
  return (
    <ServerPaginationGrid />
  );
}
