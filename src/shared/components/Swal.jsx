import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {renderToString} from "react-dom/server";
import LoadingSpinner from '@/shared/components/LoadingSpinner';

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
   * Show a wait/loading dialog.
   * @param {string} title
   * @param {string} message
   * @param {object} options - Optional additional SweetAlert2 config options.
   * @returns {Promise<SweetAlertResult>}
   */
  wait(title = "Please wait...", message = "Processing your request.", options = {}) {
    return MySwal.fire({
      title: <strong>{title}</strong>,
      html: <i>{message}<LoadingSpinner size="64px" className={"min-h-[80px]"}/></i>,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showCancelButton: false,
      showConfirmButton: false,
      showDenyButton: false,
      didOpen: () => {
        // MySwal.showLoading();
        // Mount your React component into the placeholder
        // const el = document.getElementById("swal-custom-loader");
        // if (el) {
        //   const root = ReactDOM.createRoot(el);
        //   root.render(<LoadingSpinner />);
        // }
      },
      loaderHtml: renderToString(<LoadingSpinner size="64px" className={"min-h-[70px]"}/>), //"<div id='swal-custom-loader'></div>",
      ...options
    });
  },
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

