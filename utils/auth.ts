export const signOut = () => {
  localStorage.removeItem("adminToken");

  window.location.href = "/";
};
