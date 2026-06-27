const LEAF_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>`;

const MARKER_GREEN = "#1B5E3B";

export function createProjectMarkerElement(title: string): HTMLButtonElement {
  const el = document.createElement("button");
  el.type = "button";
  el.className = "project-marker";
  el.setAttribute("aria-label", title);
  el.innerHTML = `
    <span class="project-marker-pin" style="background-color:${MARKER_GREEN}">
      <span class="project-marker-icon">${LEAF_ICON}</span>
    </span>
  `;
  return el;
}
