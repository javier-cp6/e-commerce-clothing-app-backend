import _ from "lodash";
import validator from "validator";

export const userRequestDTO = (data) => {

  const errores = [];
  if (_.isNil(data.email)) {
    errores.push("Falta el email");
  }

  if (_.isNil(data.password)) {
    errores.push("Falta la password");
  }
  
  if (!validator.isEmail(data.email)) {
    errores.push("Email invalido");
  }

  if (errores.length !== 0) {
    throw new Error(errores);
  } else {
    return data;
  }
};

export const loginRequestDTO = (data) => {
  const errores = [];

  if (_.isNil(data.email)) {
    errores.push("Falta el email");
  }

  if (_.isNil(data.password)) {
    errores.push("Falta la password");
  }

  if (!validator.isEmail(data.email)) {
    errores.push("Email invalido");
  }

  if (errores.length !== 0) {
    throw new Error(errores);
  } else {
    return data;
  }
};
