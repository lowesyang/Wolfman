let LocalStorage = {
    setItem: function (key, value) {
        if (typeof value == "object") {
            value = JSON.stringify(value);
        }
        localStorage.setItem(key, value);
    },
    getItem: function (key) {
        let temp = localStorage.getItem(key);
        let res;
        if (res = JSON.parse(temp)) return res;
        return temp;
    },
    clear: function () {
        localStorage.clear();
    }
};

export default LocalStorage;

//# sourceMappingURL=LocalStorage-compiled.js.map