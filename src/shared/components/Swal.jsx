import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {renderToString} from "react-dom/server";
import LoadingSpinner from '@/shared/components/LoadingSpinner';
import {
  buttonBaseClasses,
  buttonVariants,
  buttonSizes,
} from "@/shared/components/button";

// const MySwal = withReactContent(Swal);
const MySwal = withReactContent(
  Swal.mixin({
    buttonsStyling: false,
    // backdrop: `
    //   rgba(0, 0, 0, 0.4)
    //   linear-gradient(90deg, rgba(147,51,234,0.7), rgba(79,70,229,0.7))
    // `,
  })
);

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
      customClass: {
        confirmButton: `${buttonBaseClasses} ${buttonVariants.primary} ${buttonSizes.medium}`,
      },
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
      icon: 'success',
      customClass: {
        confirmButton: `${buttonBaseClasses} ${buttonVariants["accent-purple"]} ${buttonSizes.medium}`,
      },
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
      icon: 'error',
      customClass: {
        confirmButton: `${buttonBaseClasses} ${buttonVariants.danger} ${buttonSizes.medium}`,
      },
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
      customClass: {
        confirmButton: `${buttonBaseClasses} ${buttonVariants["danger"]} ${buttonSizes.medium} mx-1`,
        cancelButton: `${buttonBaseClasses} ${buttonVariants["accent-purple"]} ${buttonSizes.medium} mx-1`,
      },
      ...options
    });
  },
};

export default SwAlert;

