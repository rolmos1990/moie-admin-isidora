export default function authHeader() {
  const obj = JSON.parse(localStorage.getItem("authUserV2"))

  if (obj && obj.token) {
    return { Authorization: obj.token }
  } else {
    return {}
  }
}
