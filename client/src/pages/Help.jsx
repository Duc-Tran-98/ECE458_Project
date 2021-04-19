/* eslint-disable max-len */
import React, { useContext } from 'react';
import UserContext from '../components/UserContext';

export default function Help() {
  const user = useContext(UserContext);

  return (
    <div className="container-fluid">
      <div className="row">
        <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
            <h1 className="h2">
              Welcome
              {' '}
              {user.firstName}
            </h1>
            {/* <div className="btn-toolbar mb-2 mb-md-0">
              <div className="btn-group mr-2">
                <button className="btn btn-sm btn-outline-light text-light" type="button">
                  Share
                </button>
                <button className="btn btn-sm btn-outline-light text-light" type="button">
                  Export
                </button>
              </div>
              <button className="btn btn-sm btn-outline-light dropdown-toggle" type="button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-calendar"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                This week
              </button>
            </div>
           */}
          </div>
          <h2>User Guide</h2>
          <p>
            Our system is designed to make tracking and calibrating equipment simple, easy, and error-proof. We provide a unified equipment inventory and calibration system that can replace
            a basic spreadsheet system.

            Our system allows users with the appropriate permissions to easily add, remove, and modify models and instruments and perform calibrations.
          </p>
          <h3>Viewing Models</h3>
          <p>To view all of the models, select “Models” from the menu bar. This will take you to a table displaying 25 models at a time. If you wish to view more models on the page, you may adjust the “Rows per page” in the bottom right corner of the table. </p>
          <p>From this view, you may:</p>
          <ul>
            <li>Filter models by any of their characteristics with the search bar on top of the page.</li>
            <li>Adjust the visible information and display of the table using the “COLUMNS” and “DENSITY” buttons found in the upper left corner.</li>
            <li>Open a detailed view of the model using the magnifying glass icon, which allows you to view the model information as well as all of the instruments of that model.</li>
            <li>View, and then edit or delete models by clicking on them to see their detailed view.</li>
            <li>Select a group of models to export in bulk using the “EXPORT SELECTED ROWS” button above the table.</li>
            <li>Export all models using the “EXPORT ALL MODELS” button above the table.</li>
          </ul>
          <h3>Viewing Instruments</h3>
          <p>Similarly, to view all of the instruments, select “Instruments” from the menu bar. This will take you to a table displaying 25 instruments at a time. If you wish to view more instruments on the page, you may adjust the “Rows per page” in the bottom right corner of the table. Note: if the “Most Recent Calibration” and “Calibration Expiration” columns appear empty at first, try clicking anywhere in the table to make them appear.</p>
          <p>From this view, you may:</p>
          <ul>
            <li>Filter instruments by any of their characteristics with the search bar on top of the page.</li>
            <li>Adjust the visible information and display of the table using the “COLUMNS” and “DENSITY” buttons found in the upper left corner.</li>
            <li>View the most recent calibration date and the calibration expiration date (The expiration date will display in green when it is more than 30 days away, yellow when it is less than 30 days away, and red when it is expired.)</li>
            <li>Open a detailed view of the instrument by clicking on the row, which allows you to view the instrument information, including its calibration history. From this detailed view you can: add a calibration event, go to the models detail view, or generate a calibration certificate.</li>
            <li>Edit or delete instruments from their detailed view (with permission only).</li>
            <li>Select a group of instruments to export in bulk using the “EXPORT SELECTED ROWS” button above the table.</li>
            <li>Export all instruments using the “EXPORT ALL INSTRUMENTS” button above the table.</li>
          </ul>
          <h3>Adding a model/instrument</h3>
          <p>
            To add a model, press the plus button on the models page. Fill in the required fields of Model Number, Vendor, and Description with the model’s information, and add a comment if necessary. If the model is calibratable, add a calibration frequency. If not, simply leave the frequency at 0.

            To add an instrument, press the plus button from the instruments page. Fill in the required fields of Model Selection and Serial Number, and add a comment if necessary. Note: the model must already exist in the database before an instrument can be added. Then, input the instrument’s calibration history and review to confirm the information is correct. Only users with appropriate permissions can do this.
          </p>
          <h3>Importing models/instruments in bulk</h3>
          <p>To import models or instruments in bulk, select “Import” icon from the models or instruments page. This will take you to a page containing a link to the import documentation and allow you to download templates for models and instruments. Once you are sure your file is formatted correctly, import it using the correct file selector button. Only users with appropriate permissions can do this.</p>
          <h3>Exporting models/instruments in bulk</h3>
          <p>To export models or instruments in bulk, select “Models” or “Instruments,” respectively, from the menu bar. Use the checkboxes to select the desired rows for export, and then export using the “Export Selected Rows” button above the table. Additionally, all of the models and instruments can be exported using the “Export All” button above the table. For more information on navigating these tables, see the Viewing Models and Viewing Instruments sections of this document.</p>
          
          <h3>Calibrating Instruments</h3>
          <p>Users with appropriate permissions may record instrument calibrations. There are 4 types of calibration events: simple, load bank wizard, klufe wizard, and custom form. All calibration events record the user, date, and an optional comment. Models can support one of the special calibration types.</p>
    <ul>
            <li>Simple calibrations: all instruments can record simple calibrations. Simple calibrations can also include a file upload.</li>
            <li>Load Bank Wizard: instruments with appropriately marked models can be calibrated using the load bank wizard. This will guide the user through the calibration process.</li>
            <li>Klufe Calibration Wizard: instruments with appropriately marked models can be calibrated using the Klufe 5700 wizard. This will guide the user through the calibration process.</li>
            <li>Custom Form: instruments with appropriately marked models can be calibrated using a custom form. The form used will be created when the model is created.</li>
  </ul>
          
  
  <h3>Creating Users</h3>
          <p>To create a new user, select “Create Users” from the menu bar. Add the new user’s first name, last name, username, email, password, their appropriate permissions and then click register. Only administrators can do this.</p>
  
          <h3>Permission management</h3>
          <p>All users in the system are assigned permissions. The available permissions are: instrument management, model management, calibration, calibration approver, and administrator. Administrators can edit the permissions of all other users.</p>
          <ul>
            <li>Instrument management permission:  Allows creation, modification, and deletion of instruments. This also includes management of instrument categories. This does not confer the ability to calibrate an instrument.</li>
            <li>Model management permission: Allows creation, modification, and deletion of models. This also includes management of model categories. This permission implies instrument management permission.</li>
  <li>Calibration permission:  Allows the user to perform calibrations.</li>
  <li>Calibration Approver permission: Allows the user to approve/reject calibrations for models that require it. This permission implies calibration permission.</li>
  <li>Administrator permission: Inherits all of the abilities described above. Can also confer or revoke permissions onto users.</li>
          </ul>
  
          <hr />
          <p>
            Created for ECE 458 by Angel Huizar, Louis Jensen, Max Smith, Duc Tran, and Natasha Von Seelen
          </p>
          <p>Duke University, Prof. Tyler Bletsch</p>
        </main>
      </div>
    </div>
  );
}
