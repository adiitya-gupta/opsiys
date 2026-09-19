/**
 * Utility functions for Markdown content processing and sanitization
 */

export const cleanMarkdownContent = (rawContent: string): string => {
  if (!rawContent) return "";

  let content = rawContent;

  // 1. Unescape unnecessarily backslash-escaped Markdown special characters
  // Fixes: \# -> #, \*\* -> **, \- -> -, \` -> `, \| -> |, \> -> >, etc.
  content = content
    .replace(/\\#/g, "#")
    .replace(/\\\*/g, "*")
    .replace(/\\_/g, "_")
    .replace(/\\-/g, "-")
    .replace(/\\>/g, ">")
    .replace(/\\`/g, "`")
    .replace(/\\\|/g, "|")
    .replace(/\\\[/g, "[")
    .replace(/\\\]/g, "]")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/https\\:\/\//g, "https://")
    .replace(/http\\:\/\//g, "http://");

  // 2. Clean up legacy copied SVG text prefixes in bullet lines (e.g., "svgA website" -> "A website")
  content = content.replace(/^(\s*[-*]\s+)svg([A-Z0-9])/gm, "$1$2");

  // 3. Normalize single-line collapsed tables if any legacy data exists
  // If table headers and dividers were collapsed without linebreaks: "| col | col | |---|---| | val | val |"
  content = content.replace(/\|\s*\|\s*\|---/g, "|\n|---");
  content = content.replace(/(---\|)\s*\|/g, "$1\n|");

  return content.trim();
};
