/** One CSV line. Quotes every cell, and neutralizes spreadsheet formulas. */
export function csvRow(cells: (string | number | null | undefined)[]) {
  return cells
    .map((cell) => {
      let text = cell == null ? "" : String(cell);
      if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
      return `"${text.replace(/"/g, '""')}"`;
    })
    .join(",");
}

export function csvResponse(filename: string, rows: string[]) {
  return new Response(`${rows.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
