export const GetHighestRole = async (level, roles) => {
    for (let i = level; i > 0; i--) {
        if (roles[i]) {
            return roles[i];
        }
    }
    return null;
}