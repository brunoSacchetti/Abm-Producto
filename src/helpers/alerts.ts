import Swal from "sweetalert2";

export const handleConfirm = (title: string, fn: any) => {
  Swal.fire({
    title: `${title}`,
    showCancelButton: true,
    confirmButtonText: "Confirmar",
    denyButtonText: `Cancelar`,
  }).then((result) => {
    if (result.isConfirmed) {
      fn();
    }
  });
};

export const handleError = (title: string) => {
  Swal.fire({
    icon: "error",
    title: "Oops...",
    text: `${title}`,
  });
};
export const handleSuccess = (title: string) => {
  Swal.fire({
    title: "Perfecto",
    text: title,
    icon: "success",
  });
};
