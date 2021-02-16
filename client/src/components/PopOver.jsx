import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import PropTypes from 'prop-types';

export default function MouseOverPopover({ children, message, className }) {
  MouseOverPopover.propTypes = {
    children: PropTypes.node.isRequired,
    message: PropTypes.string.isRequired,
    className: PropTypes.string,
  };
  MouseOverPopover.defaultProps = {
    className: '',
  };

  return (
    <div className={className}>
      <OverlayTrigger
        placement="bottom"
        delay={{ show: 250, hide: 400 }}
        trigger={['hover', 'hover']} // duplicated 'hover' as workaround to remove repeated unneccesary warnings
        overlay={<Tooltip id="tooltip-bottom">{message}</Tooltip>}
      >
        {children}
      </OverlayTrigger>
    </div>
  );
}
