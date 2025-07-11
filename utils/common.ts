export const roleLabel = (role: string) => {
  switch (role) {
    case "superadmin":
      return "Superadmin";
    case "admin":
      return "Admin";
    case "user":
      return "User";
    default:
      return role;
  }
};

export const toLowerCase = (value: string | undefined): string => {
  return value ? value.toLowerCase() : "";
};
