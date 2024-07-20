export const validate = (propName, formData) => {
  const val = formData.get(propName);
  const results = {};

  const validationChain = {
    get propertyName() {
      return propName;
    },

    get results() {
      return results;
    },
  };

  validationChain.required = () => {
    results.required = val?.trim().length > 0;
    return validationChain;
  };

  validationChain.minLength = (min) => {
    results.minLength = val?.trim().length >= min;
    return validationChain;
  };

  validationChain.isInteger = () => {
    results.isInteger = /^[0-9]+$/.test(val);
    return validationChain;
  };

  return validationChain;
};
