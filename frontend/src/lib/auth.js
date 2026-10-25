export function saveSession(data) {
  sessionStorage.setItem("nexoraDemoSession", JSON.stringify({
    token: data.token,
    user: data.user,
  }));
}

export function readSession() {
  try {
    return JSON.parse(sessionStorage.getItem("nexoraDemoSession") || "null");
  } catch {
    return null;
  }
}

export function clearSession() {
  sessionStorage.removeItem("nexoraDemoSession");
}
