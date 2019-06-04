function capitialize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
    // return str;
}

module.exports = {
    capitialize: capitialize
};