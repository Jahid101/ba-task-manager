
export const handleErrorMessage = (errors, name) => {
  if (name in errors) {
    return errors[name]?.message;
  }
  return "";
};

export const changeThemeColor = (primary = '#04818c') => {
  document.documentElement.style.setProperty('--color-primary', primary);
};
