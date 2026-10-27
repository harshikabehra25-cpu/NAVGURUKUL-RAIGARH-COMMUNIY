const grid = document.querySelector("#grid"),
  search = document.querySelector("#search"),
  cohort = document.querySelector("#cohort");
let page = 1,
  group = "students";
const pageSize = 24,
  storageKey = "ngRaigarhCommunityV2";
function all() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}
function initials(name) {
  return (name || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((x) => x[0] || "")
    .join("")
    .toUpperCase();
}
function isTeam(person) {
  return person.group === "team" || person.role === "Team Member";
}
function render() {
  const allPeople = all(),
    students = allPeople.filter((p) => !isTeam(p)),
    team = allPeople.filter(isTeam);
  document.querySelector("#student-count").textContent = students.length;
  document.querySelector("#team-count").textContent = team.length;
  const source = group === "team" ? team : students,
    term = search.value.trim().toLowerCase();
  const list = source.filter(
    (p) =>
      (p.name || "").toLowerCase().includes(term) &&
      (group === "team" ||
        cohort.value === "all" ||
        String(p.cohort) === cohort.value),
  );
  const pages = Math.max(1, Math.ceil(list.length / pageSize));
  page = Math.min(page, pages);
  grid.innerHTML = "";
  list.slice((page - 1) * pageSize, page * pageSize).forEach((p) => {
    const a = document.createElement("a");
    a.className = "person-card";
    a.href = "student.html?id=" + encodeURIComponent(p.id);
    const av = document.createElement("span");
    av.className = "avatar";
    if (p.photo) {
      const im = document.createElement("img");
      im.src = p.photo;
      im.alt = p.name || "Profile photo";
      im.loading = "lazy";
      av.append(im);
    } else av.textContent = initials(p.name);
    const n = document.createElement("strong");
    n.textContent = p.name || "Unnamed profile";
    const pill = document.createElement("span");
    pill.className = "role-pill";
    pill.textContent = isTeam(p)
      ? "Campus Team"
      : p.councilPost || p.role || "Student";
    a.append(av, n, pill);
    grid.append(a);
  });
  const empty = document.querySelector("#empty");
  empty.hidden = list.length > 0;
  grid.hidden = !list.length;
  document.querySelector("#total-count")?.remove();
  document.querySelector("#page").textContent = `Page ${page} of ${pages}`;
  document.querySelector("#prev").disabled = page === 1;
  document.querySelector("#next").disabled = page === pages || !list.length;
  document.querySelector("#cohort-wrap").hidden = group === "team";
  document
    .querySelector("#students-tab")
    .classList.toggle("active", group === "students");
  document
    .querySelector("#team-tab")
    .classList.toggle("active", group === "team");
  document
    .querySelector("#students-tab")
    .setAttribute("aria-selected", String(group === "students"));
  document
    .querySelector("#team-tab")
    .setAttribute("aria-selected", String(group === "team"));
}
document.querySelectorAll(".tab").forEach((btn) =>
  btn.addEventListener("click", () => {
    group = btn.dataset.group;
    page = 1;
    search.value = "";
    render();
  }),
);
search.addEventListener("input", () => {
  page = 1;
  render();
});
cohort.addEventListener("change", () => {
  page = 1;
  render();
});
document.querySelector("#prev").onclick = () => {
  page--;
  render();
};
document.querySelector("#next").onclick = () => {
  page++;
  render();
};
window.addEventListener("storage", render);
render();
