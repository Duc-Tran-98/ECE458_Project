/* eslint-disable no-shadow */
import { gql } from '@apollo/client';
import { print } from 'graphql';
import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useHistory } from 'react-router-dom';
import InstrumentForm from './InstrumentForm';
import Query from './UseQuery';
import UserContext from './UserContext';
import EditInstrumentQuery from '../queries/EditInstrument';

export default function EditInstrument({
  initVendor,
  initModelNumber,
  initSerialNumber,
  id,
  description,
  handleDelete,
  footer,
}) {
  EditInstrument.propTypes = {
    initVendor: PropTypes.string.isRequired,
    initModelNumber: PropTypes.string.isRequired,
    initSerialNumber: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    handleDelete: PropTypes.func,
    footer: PropTypes.node,
  };
  EditInstrument.defaultProps = {
    handleDelete: null,
    footer: null,
  };
  const history = useHistory();
  const user = React.useContext(UserContext);
  const [loading, setLoading] = React.useState(false); // if we are waiting for response
  const [responseMsg, setResponseMsg] = React.useState(''); // msg response
  const [formState, setFormState] = React.useState({
    modelNumber: initModelNumber,
    vendor: initVendor,
    serialNumber: initSerialNumber,
    description,
    comment: '',
    id,
    calibrationFrequency: 0,
  });
  React.useEffect(() => {
    const FIND_INST = gql`
      query FindInst(
        $modelNumber: String!
        $vendor: String!
        $serialNumber: String!
      ) {
        getInstrument(
          modelNumber: $modelNumber
          vendor: $vendor
          serialNumber: $serialNumber
        ) {
          calibrationFrequency
          comment
        }
      }
    `;
    const query = print(FIND_INST);
    const queryName = 'getInstrument';
    const { modelNumber, vendor, serialNumber } = formState;
    const getVariables = () => ({ modelNumber, vendor, serialNumber });
    const handleResponse = (response) => {
      let { comment, calibrationFrequency } = response;
      if (comment === null) {
        comment = '';
      }
      if (calibrationFrequency === null) {
        calibrationFrequency = 0;
      }
      setFormState({ ...formState, comment, calibrationFrequency });
    };
    Query({
      query,
      queryName,
      getVariables,
      handleResponse,
    });
  }, [initModelNumber, initVendor, initSerialNumber]);
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const {
      comment,
      modelNumber,
      vendor,
      serialNumber,
      description,
      id,
      calibrationFrequency,
    } = formState;
    const handleResponse = (response) => {
      setLoading(false);
      setResponseMsg(response.message);
      setTimeout(() => {
        setResponseMsg('');
      }, 1000);
      if (response.success) {
        history.replace(
          `/viewInstrument/?modelNumber=${modelNumber}&vendor=${vendor}&serialNumber=${serialNumber}&description=${description}&id=${id}&calibrationFrequency=${calibrationFrequency}`,
        ); // editing => old url no longer valid, so replace it
      }
    };
    EditInstrumentQuery({
      modelNumber,
      vendor,
      serialNumber,
      id,
      comment,
      handleResponse,
    });
  };

  const onInputChange = (_e, v) => {
    // This if for updating instrument's fields from autocomplete input
    setFormState({
      ...formState,
      modelNumber: v.modelNumber,
      vendor: v.vendor,
    });
  };

  const changeHandler = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };
  const {
    modelNumber,
    vendor,
    serialNumber,
    comment,
    calibrationFrequency,
  } = formState;
  const value = { modelNumber, vendor };
  let footElement = null;
  if (user.isAdmin) {
    footElement = responseMsg.length > 0 ? (
      <div className="row">
        <div className="col">
          <button type="button" className="btn  text-nowrap">
            Delete Instrument
          </button>
        </div>
        <div className="col">
          <button type="button" className="btn  text-nowrap">
            {responseMsg}
          </button>
        </div>
        {footer}
      </div>
    ) : (
      <div className="row">
        <div className="col">
          <button
            type="button"
            className="btn  text-nowrap"
            onClick={handleDelete}
          >
            Delete Instrument
          </button>
        </div>
        <div className="col">
          {loading ? (
            <CircularProgress />
          ) : (
            <button
              type="button"
              className="btn  text-nowrap"
              onClick={handleSubmit}
            >
              Save Changes
            </button>
          )}
        </div>
        {footer}
      </div>
    ); // foot element controls when to display Save Changes buttion or response msg
  }
  return (
    <>
      <InstrumentForm
        val={value}
        modelNumber={modelNumber}
        vendor={vendor}
        comment={comment}
        serialNumber={serialNumber}
        changeHandler={changeHandler}
        validated={false}
        onInputChange={onInputChange}
        viewOnly={!user.isAdmin}
        description={description}
        calibrationFrequency={calibrationFrequency}
      />
      <div className="d-flex justify-content-center my-3">
        <div className="">{loading ? <CircularProgress /> : footElement}</div>
      </div>
    </>
  );
}

// class X extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       // eslint-disable-next-line react/prop-types
//       vendor: props.vendor,
//       // eslint-disable-next-line react/prop-types
//       modelNumber: props.modelNumber,
//       // eslint-disable-next-line react/prop-types
//       serialNumber: props.serialNumber,
//       description: '',
//       comment: '',
//       id: '',
//       calibrationFrequency: 0,
//       validated: false,
//       // eslint-disable-next-line react/prop-types
//       viewOnly: props.viewOnly, // Is this only for viewing
//     };
//     // eslint-disable-next-line react/prop-types
//     this.handleClose = props.handleClose;
//     this.changeHandler = this.changeHandler.bind(this);
//     this.handleSubmit = this.handleSubmit.bind(this);
//     this.onInputChange = this.onInputChange.bind(this);
//   }

//   componentDidMount() {
//     const FIND_INST = gql`
//       query FindInst(
//         $modelNumber: String!
//         $vendor: String!
//         $serialNumber: String!
//       ) {
//         getInstrument(
//           modelNumber: $modelNumber
//           vendor: $vendor
//           serialNumber: $serialNumber
//         ) {
//           calibrationFrequency
//           comment
//           id
//           description
//         }
//       }
//     `;
//     const query = print(FIND_INST);
//     const queryName = 'getInstrument';
//     const { modelNumber, vendor, serialNumber } = this.state;
//     const getVariables = () => ({ modelNumber, vendor, serialNumber });
//     const handleResponse = (response) => {
//       const {
//         comment, id, description, calibrationFrequency,
//       } = response;
//       this.setState({
//         comment,
//         id,
//         description,
//         calibrationFrequency,
//       });
//     };
//     Query({
//       query,
//       queryName,
//       getVariables,
//       handleResponse,
//     });
//   }

//   // eslint-disable-next-line class-methods-use-this
// handleSubmit(e) {
//   const { viewOnly } = this.state;
//   if (typeof viewOnly === 'undefined' || !viewOnly) {
//     e.preventDefault();
//     const {
//       comment, id, modelNumber, vendor, serialNumber,
//     } = this.state;
//     this.setState({ validated: true });
//     const handleResponse = (response) => {
//       if (response.success) {
//         this.handleClose(true);
//       }
//       // eslint-disable-next-line no-alert
//       alert(response.message);
//     };
//     EditInstrumentQuery({
//       modelNumber, vendor, serialNumber, id, comment, handleResponse,
//     });
//   }
// }

// onInputChange(e, v) {
//   // This if for updating instrument's fields from autocomplete input
//   this.setState({
//     modelNumber: v.modelNumber,
//     vendor: v.vendor,
//   });
// }

// changeHandler(e) {
//   const { viewOnly } = this.state;
//   if (typeof viewOnly === 'undefined' || !viewOnly) {
//     this.setState({ [e.target.name]: e.target.value });
//   }
// }

//   render() {
// const {
//   modelNumber,
//   vendor,
//   serialNumber,
//   comment,
//   validated,
//   viewOnly,
//   description,
//   calibrationFrequency,
// } = this.state;
// const value = { modelNumber, vendor };
// // const value = vendor.concat(' ', modelNumber);
// return (
//   <div className="d-flex justify-content-center">
//     <InstrumentForm
//       val={value}
//       modelNumber={modelNumber}
//       vendor={vendor}
//       comment={comment}
//       serialNumber={serialNumber}
//       handleSubmit={this.handleSubmit}
//       changeHandler={this.changeHandler}
//       validated={validated}
//       onInputChange={this.onInputChange}
//       viewOnly={viewOnly}
//       description={description}
//       calibrationFrequency={calibrationFrequency}
//     />
//   </div>
// );
//   }
// }

// export default X;
