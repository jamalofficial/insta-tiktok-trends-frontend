import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import React from 'react';

const MySwal = withReactContent(Swal);

/**
 * A reusable component that can show SweetAlert2 dialogs for success, error, and confirmation.
 * Usage: 
 *   import SwAlert from "@/shared/components/Swal";
 *   SwAlert.success("Saved!", "Your item was saved.");
 *   SwAlert.error("Oops", "Something went wrong.");
 *   SwAlert.confirm("Are you sure?", "This action is irreversible!").then(result => { ... });
 */
const SwAlert = {
  /**
   * Show a success alert.
   * @param {string} title
   * @param {string} message
   */
  success(title = "Success!", message = "Your action was completed successfully.") {
    return MySwal.fire({
      title: <strong>{title}</strong>,
      html: <i>{message}</i>,
      icon: 'success'
    });
  },

  /**
   * Show an error alert.
   * @param {string} title
   * @param {string} message
   */
  error(title = "Error", message = "There was an error processing your request.") {
    return MySwal.fire({
      title: <strong>{title}</strong>,
      html: <i>{message}</i>,
      icon: 'error'
    });
  },

  /**
   * Show a confirmation dialog.
   * @param {string} title
   * @param {string} message
   * @param {object} options - Optional additional SweetAlert2 config options.
   * @returns {Promise<SweetAlertResult>} The SweetAlert2 promise result.
   */
  confirm(
    title = "Are you sure?", 
    message = "Do you want to proceed?", 
    options = {}
  ) {
    return MySwal.fire({
      title: <strong>{title}</strong>,
      html: <i>{message}</i>,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      ...options
    });
  },
};

export default SwAlert;

