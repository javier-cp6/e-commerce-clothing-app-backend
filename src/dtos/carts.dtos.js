import _ from "lodash";

export const cartRequestDTO = (body) => {
  const errors = [];

  if(_.isNil(body.productId)){
    errors.push("Product id is required")
  }
  if(_.isNil(body.quantity)){
    errors.push("Quantity is required")
  }
  if(_.isNil(body.size)){
    errors.push("Size is required")
  }
  if(_.isNil(body.color)){
    errors.push("Color is required")
  }
  if(errors.length !== 0){
    throw new Error(errors)
  } else {
    return body
  }
}