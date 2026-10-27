const storageKey = "ngRaigarhCommunityV2";
function all() {
  try {
    const x = JSON.parse(localStorage.getItem(storageKey));
    return Array.isArray(x) ? x : [];
  } catch {
    return [];
  }
}
const params = new URLSearchParams(location.search),
  s = all().find((x) => x.id === params.get("id"));
const put = (id, v) => {
  const el = document.getElementById(id);
  if (el) el.textContent = v || "Not provided";
};
function initials(n) {
  return (n || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((x) => x[0] || "")
    .join("")
    .toUpperCase();
}
if (!s) {
  document.querySelector(".profile-body").innerHTML =
    '<p class="eyebrow">COMMUNITY PROFILE</p><h1>Profile not found</h1><p class="profile-meta">This profile may be on another browser or device. The demo does not sync submissions between devices.</p><br><a class="primary-button" href="index.html">← Back to community</a>';
} else {
  document.title = s.name + " | Navgurukul Raigarh";
  put("name", s.name);
  put(
    "meta",
    s.role === "Team Member" ? "Campus Team Member" : s.role || "Student",
  );
  put("d-name", s.name);
  put("role-label", s.role || "Student");
  put("d-role", s.role || "Student");
  put("cohort", s.cohort ? "Cohort " + s.cohort : "Not applicable");
  put("council", s.councilPost);
  put("father", s.fatherName);
  put("mother", s.motherName);
  put("city", s.city);
  put("district", s.district);
  put("study", s.study);
  put("language", s.language);
  put("about", s.about || "No introduction added yet.");
  if (s.role === "Team Member")
    document.getElementById("cohort-detail").hidden = true;
  const av = document.getElementById("avatar");
  av.textContent = initials(s.name);
  if (s.photo) {
    const im = document.createElement("img");
    im.src = s.photo;
    im.alt = s.name;
    av.textContent = "";
    av.append(im);
  }
  if (s.joiningDate) {
    const d = new Date(s.joiningDate + "T00:00:00"),
      today = new Date();
    today.setHours(0, 0, 0, 0);
    put(
      "joining",
      d.toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    );
    const days = Math.max(0, Math.floor((today - d) / 86400000)),
      years = Math.floor(days / 365),
      months = Math.floor((days % 365) / 30),
      rem = days - years * 365 - months * 30;
    put(
      "duration",
      [
        years ? years + " year(s)" : null,
        months ? months + " month(s)" : null,
        rem + " day(s)",
      ]
        .filter(Boolean)
        .join(", "),
    );
  } else {
    put("joining", "Not provided");
    put("duration", "Add joining date to calculate");
  }
}
