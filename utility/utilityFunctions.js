
export const handleErrorMessage = (errors, name) => {
  if (name in errors) {
    return errors[name]?.message;
  }
  return "";
};
