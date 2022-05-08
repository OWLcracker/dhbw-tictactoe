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
