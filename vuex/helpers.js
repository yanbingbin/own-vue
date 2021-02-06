export const mapState = (states) => {
    const res = {};
    states.forEach((stateName) => {
        res[stateName] = function() {
            return this.$store.state[stateName];
        };
    });
    return res;
};

export const mapGetters = (getters) => {
    const res = {};
    getters.forEach((getterName) => {
        res[getterName] = function() {
            return this.$store.getters[getterName];
        };
    });
    return res;
};

export const mapMutations = (mutations) => {
    const res = {};
    mutations.forEach(type => {
        res[type] = function(payload) {
            this.$store.commit(type, payload);
        };
    });
    return res;
};

export const mapActions = (actions) => {
    const res = {};
    actions.forEach(type => {
        res[type] = function(payload) {
            this.$store.dispatch(type, payload);
        };
    });
};