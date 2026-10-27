const form = document.querySelector("#form"),
  msg = document.querySelector("#message"),
  date = document.querySelector("#joining"),
  role = document.querySelector("#role"),
  cohortField = document.querySelector("#cohort-field"),
  councilField = document.querySelector("#council-field");
const storageKey = "ngRaigarhCommunityV2";
date.max = new Date().toISOString().slice(0, 10);
function all() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}
function updateRoleFields() {
  cohortField.hidden = role.value === "Team Member";
  councilField.hidden = role.value !== "Student Council";
}
role.addEventListener("change", updateRoleFields);
updateRoleFields();
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = new FormData(form),
    name = String(d.get("name") || "").trim();
  if (!name) return;
  const kind = String(d.get("role") || "Student"),
    entry = {
      id: "NG-" + Date.now(),
      name,
      role: kind,
      group: kind === "Team Member" ? "team" : "students",
      cohort: kind === "Team Member" ? "" : Number(d.get("cohort") || 1),
      councilPost: String(d.get("councilPost") || "").trim(),
      study: String(d.get("study") || "").trim(),
      language: String(d.get("language") || "").trim(),
      fatherName: String(d.get("fatherName") || "").trim(),
      motherName: String(d.get("motherName") || "").trim(),
      city: String(d.get("city") || "").trim(),
      district: String(d.get("district") || "").trim(),
      joiningDate: String(d.get("joiningDate") || ""),
      mobile: String(d.get("mobile") || "").trim(),
      photo: String(d.get("photo") || "").trim(),
      about: String(d.get("about") || "").trim(),
      submittedAt: new Date().toISOString(),
    };
  try {
    const list = all();
    list.push(entry);
    localStorage.setItem(storageKey, JSON.stringify(list));
    msg.textContent =
      "Your profile was saved in this browser. Opening the community page…";
    form.reset();
    updateRoleFields();
    setTimeout(() => {
      location.href = "index.html";
    }, 1100);
  } catch {
    msg.textContent =
      "Could not save this profile in browser storage. Please try again.";
  }
});
