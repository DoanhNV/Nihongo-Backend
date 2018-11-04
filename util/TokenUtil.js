export function resetCookie(token) {
  this.deleteCookie();
  var date = new Date();
  const TOKEN_SERVICE_TIME = 30;
  var currentTime = new Date();
  currentTime.setMinutes(date.getMinutes() + TOKEN_SERVICE_TIME);
  this.saveCookie(token, currentTime);
}

export function redirectWhenNotExistToken(token) {
  if(token == null || token === "" || token === "undefined") {
    alert("token: " + token);
    redirectTo("/login");
  }
}

export function deleteCookie() {
    $.removeCookie('token');
}

export function saveCookie(token, expiresTime) {
    $.cookie("token", token, { Path: "/",expires: expiresTime});
}

export function getToken() {
  return $.cookie("token");
}

export function redirectTo(url) {
  window.location.href = url;
}