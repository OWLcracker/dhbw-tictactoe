var user = {
        "id": null,
        "session_key": null,
        "session_creationDate": null
    }
    let resetSession = () => {
    this.user.id = null;
    this.user.session_key = null;
    this.user.session_creationDate = null;

};
let setCookie = () => {
    document.cookie = "id=" + this.user.id +";path=/";
    document.cookie = "session_key="+ this.user.session_key +";path=/";
};
let getCookieValue = (name) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
)