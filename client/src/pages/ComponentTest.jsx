import React from 'react';
import ModelCategories from '../components/ModelCategories';
import ModalAlert from '../components/ModalAlert';
import AppBarDemo from '../components/AppBarDemo';

// ModalAlert.propTypes = {
//   title: PropTypes.string.isRequired,
//   children: PropTypes.node.isRequired,
//   footer: PropTypes.node,
//   width: PropTypes.string,
//   btnText: PropTypes.string.isRequired,
//   altCloseBtnId: PropTypes.string, // id of other button that you want to close modal
//   btnClass: PropTypes.string,
//   popOverText: PropTypes.string,
//   onShow: PropTypes.func, // call back for when user clicks button
//   altBtn: PropTypes.node, // if you want to replace btn with something else that user will click on
//   altBtnId: PropTypes.string, // id of alt btn so we can assign on click event to it
// };

export default function ComponentTest() {
  return (
    <>
      <ModalAlert
        title="Model Categories"
        btnText="Show Model Categories"
      >
        <ModelCategories />
      </ModalAlert>
      <AppBarDemo />
    </>
  );
}
