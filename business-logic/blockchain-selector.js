module.exports.selectBlockchain = (policy) => {
    if (policy.preferredBC.length === 1) {
        return policy.preferredBC[0];
    }

    const conflictError = new Error("Policy conflict detected");
    conflictError.statusCode = 500;
    throw conflictError
};