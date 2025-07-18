// utils/pdf/renderTemplate.ts
export function renderTemplate(
  template: string,
  data: Record<string, string | undefined | null>,
): string {
  let rendered = template;

  for (const key in data) {
    const value = data[key] ?? "-";
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");

    rendered = rendered.replace(regex, String(value));
  }

  return rendered;
}
