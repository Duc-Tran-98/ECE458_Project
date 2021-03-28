import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import PropTypes from 'prop-types';

export default function MouseOverPopover({
  children, message, className, place,
}) {
  MouseOverPopover.propTypes = {
    children: PropTypes.node.isRequired,
    message: PropTypes.string.isRequired,
    className: PropTypes.string,
    place: PropTypes.string,
  };
  MouseOverPopover.defaultProps = {
    className: '',
    place: 'bottom',
  };

  return (
    <div className={className}>
      <OverlayTrigger
        placement={place}
        delay={{ show: 250, hide: 400 }}
        trigger={['hover', 'hover']} // duplicated 'hover' as workaround to remove repeated unneccesary warnings
        overlay={<Tooltip id="tooltip-bottom">{message}</Tooltip>}
      >
        {children}
      </OverlayTrigger>
    </div>
  );
}

export function PopOverFragment({
  children, message, place,
}) {
  PopOverFragment.propTypes = {
    children: PropTypes.node.isRequired,
    message: PropTypes.string.isRequired,
    place: PropTypes.string,
  };
  PopOverFragment.defaultProps = {
    place: 'bottom',
  };

  return (
    <>
      <OverlayTrigger
        placement={place}
        delay={{ show: 150, hide: 100 }}
        trigger={['hover', 'hover']} // duplicated 'hover' as workaround to remove repeated unneccesary warnings
        overlay={<Tooltip id="tooltip-bottom">{message}</Tooltip>}
      >
        {children}
      </OverlayTrigger>
    </>
  );
}
