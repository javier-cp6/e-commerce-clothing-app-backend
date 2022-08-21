import validator from "validator";
import _ from "lodash";

export const shoppingCartRequestDTO = (data) => {
  const errores = [];

  if (_.isNil(data.productId)) {
    errores.push("productoId es requerido");
  }

  if (errores.length !== 0) {
    throw new Error(errores);
  } else {
    return data;
  }
};