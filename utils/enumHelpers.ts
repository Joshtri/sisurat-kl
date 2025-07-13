export const enumToSelectOptions = <T extends Record<string, string>>(
  enumObj: T,
  labelMapping?: Partial<Record<keyof T, string>>,
) => {
  return Object.entries(enumObj).map(([key, value]) => ({
    label:
      labelMapping?.[key as keyof T] || key.replace(/_/g, " ").toLowerCase(),
    value,
  }));
};
