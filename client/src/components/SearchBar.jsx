import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { print } from 'graphql';
import SearchIcon from '@material-ui/icons/Search';
import AsyncSuggest from './AsyncSuggest';

// eslint-disable-next-line no-unused-vars
export default function SearchBar({ forModelSearch, onSearch }) {
  SearchBar.propTypes = {
    forModelSearch: PropTypes.bool.isRequired,
    onSearch: PropTypes.func.isRequired,
  };
  // const [which, setWhich] = React.useState('vendor');
  // eslint-disable-next-line no-unused-vars
  const [vendors, setVendors] = React.useState([]);
  const [modelNumbers, setModelNumbers] = React.useState([]);
  const [descriptions, setDescriptions] = React.useState([]);
  const [categories, setCategories] = React.useState([]);
  // const dropdownMenu = (
  //   <div className="btn-group dropdown mx-2 my-auto">
  //     <button
  //       className="btn dropdown-toggle my-auto"
  //       type="button"
  //       id="dropDownMenu3"
  //       data-bs-toggle="dropdown"
  //       aria-expanded="false"
  //     >
  //       Filters
  //     </button>
  //     <ul className="dropdown-menu bg-light" aria-labelledby="dropDownMenu3">
  //       <li>
  //         <button
  //           className="dropdown-item"
  //           type="button"
  //           onClick={() => setWhich('vendor')}
  //         >
  //           Vendor
  //         </button>
  //       </li>
  //       <li>
  //         <button
  //           className="dropdown-item"
  //           type="button"
  //           onClick={() => setWhich('modelNumber')}
  //         >
  //           Model Number
  //         </button>
  //       </li>
  //       <li>
  //         <button
  //           className="dropdown-item"
  //           type="button"
  //           onClick={() => setWhich('description')}
  //         >
  //           Description
  //         </button>
  //       </li>
  //       <li>
  //         <button
  //           className="dropdown-item"
  //           type="button"
  //           onClick={() => setWhich('category')}
  //         >
  //           Category
  //         </button>
  //       </li>
  //       <li>
  //         <button
  //           className="dropdown-item"
  //           type="button"
  //           onClick={() => {
  //             setWhich('vendor');
  //             setCategories([]);
  //             setDescriptions([]);
  //             setModelNumbers([]);
  //             setVendors([]);
  //             onClearFilters();
  //           }}
  //         >
  //           Clear Filters
  //         </button>
  //       </li>
  //     </ul>
  //   </div>
  // );

  if (forModelSearch) {
    return (
      <>
        <div className="m-2 w-25 my-auto pt-1">
          <AsyncSuggest
            query={print(gql`
                query Models {
                  getUniqueVendors {
                    vendor
                  }
                }
              `)}
            queryName="getUniqueVendors"
            onInputChange={(_e, v) => setVendors(v)}
            label="Filter by Vendor"
            getOptionLabel={(option) => `${option.vendor}`}
            getOptionSelected={(option, value) => option.vendor === value.vendor}
            multiple
            multipleValues={vendors}
          />
        </div>
        <div className="m-2 w-25 my-auto pt-1">
          <AsyncSuggest
            query={print(gql`
                query GetModelNumbers {
                  getAllModels {
                    modelNumber
                  }
                }
              `)}
            queryName="getAllModels"
            onInputChange={(_e, v) => setModelNumbers(v)}
            label="Filter by Model Number"
            getOptionLabel={(option) => `${option.modelNumber}`}
            getOptionSelected={() => undefined}
            multiple
            multipleValues={modelNumbers}
          />
        </div>
        <div className="m-2 w-25 my-auto pt-1">
          <AsyncSuggest
            query={print(gql`
                query GetCategories {
                  getAllModelCategories {
                    name
                  }
                }
              `)}
            queryName="getAllModelCategories"
            onInputChange={(_e, v) => setCategories(v)}
            label="Filter by Category"
            getOptionLabel={(option) => `${option.name}`}
            getOptionSelected={() => undefined}
            multiple
            multipleValues={categories}
          />
        </div>
        <div className="m-2 w-25 my-auto pt-1">
          <AsyncSuggest
            query={print(gql`
                query GetModelNumbers {
                  getAllModels {
                    description
                  }
                }
              `)}
            queryName="getAllModels"
            onInputChange={(_e, v) => setDescriptions(v)}
            label="Filter by Description"
            getOptionLabel={(option) => `${option.description}`}
            getOptionSelected={() => undefined}
            multiple
            multipleValues={descriptions}
          />
        </div>
        {/* {dropdownMenu} */}
        <button className="btn my-auto mx-2" type="button" onClick={() => onSearch(vendors, modelNumbers, descriptions, categories)}>
          <SearchIcon />
        </button>
      </>
    );
  }
  return (
    <div className="d-flex flex-row">
      <div className="m-2 w-25">
        <AsyncSuggest
          query={print(gql`
            query Models {
              getUniqueVendors {
                vendor
              }
            }
          `)}
          queryName="getUniqueVendors"
          onInputChange={(_e, v) => console.log(v)}
          label="Filter by Vendor"
          getOptionLabel={(option) => `${option.vendor}`}
          getOptionSelected={() => undefined}
          multiple
        />
      </div>
      <div className="m-2 w-25">
        <AsyncSuggest
          query={print(gql`
            query GetModelNumbers {
              getAllModels {
                modelNumber
              }
            }
          `)}
          queryName="getAllModels"
          onInputChange={(_e, v) => console.log(v)}
          label="Filter by Model Number"
          getOptionLabel={(option) => `${option.modelNumber}`}
          getOptionSelected={() => undefined}
          multiple
        />
      </div>
      <div className="m-2 w-25">
        <AsyncSuggest
          query={print(gql`
            query GetCategories {
              getAllModelCategories {
                name
              }
            }
          `)}
          queryName="getAllModelCategories"
          onInputChange={(_e, v) => console.log(v)}
          label="Filter by Category"
          getOptionLabel={(option) => `${option.name}`}
          getOptionSelected={() => undefined}
          multiple
        />
      </div>
      <div className="m-2 w-25">
        <AsyncSuggest
          query={print(gql`
            query GetModelNumbers {
              getAllModels {
                description
              }
            }
          `)}
          queryName="getAllModels"
          onInputChange={(_e, v) => console.log(v)}
          label="Filter by Description"
          getOptionLabel={(option) => `${option.description}`}
          getOptionSelected={() => undefined}
          multiple
        />
      </div>
    </div>
  );
}
