const constants = require('../constants');
const util = require('../util');

function validateCostsForInterval(policyToValidate, otherPolicies, interval) {
    const {DEFAULT} = constants.intervals;
    const policiesToCompareTo = otherPolicies.filter(policy => policy.interval !== DEFAULT && policy.interval !== interval);
    if (policiesToCompareTo && policiesToCompareTo.length > 0) {
        const higherIntervals = util.getHigherIntervals(interval);
        const lowerIntervals = util.getLowerIntervals(interval);
        const policiesWithInvalidLowerCostThreshold = policiesToCompareTo.filter(policy => higherIntervals.includes(policy.interval) && policy.cost < policyToValidate.cost);
        const policiesWithInvalidHigherCostThreshold = policiesToCompareTo.filter(policy => lowerIntervals.includes(policy.interval) && policy.cost > policyToValidate.cost);
        if (policiesWithInvalidLowerCostThreshold.length > 0 || policiesWithInvalidHigherCostThreshold.length > 0) {
            let errorString = 'Policy conflict detected: <br/> ';
            policiesWithInvalidLowerCostThreshold.forEach((policy) => {
                errorString += `A policy with interval ${policy.interval} has a lower cost threshold of ${policy.cost} <br/> `;
            });
            policiesWithInvalidHigherCostThreshold.forEach((policy) => {
                errorString += `A policy with interval ${policy.interval} has a higher cost threshold of ${policy.cost} <br/> `;
            });
            const conflictError = new Error(errorString);
            conflictError.statusCode = 400;
            throw conflictError
        }

    }
}

module.exports.validatePolicy = async (userPolicies, policyToValidate, user) => {
    const {DEFAULT, DAILY, WEEKLY, MONTHLY, YEARLY} = constants.intervals;
    const otherPolicies = userPolicies.filter(policy => !policy._id.equals(policyToValidate._id));
    util.sortPoliciesByPriority(otherPolicies);

    // Only a single default policy is allowed
    if (policyToValidate.interval === DEFAULT) {
        const otherDefaultPolicies = otherPolicies.filter(policy => policy.interval === DEFAULT);
        if (otherDefaultPolicies && otherDefaultPolicies.length > 0) {
            const conflictError = new Error("Policy conflict detected: A default Policy for this user already exists");
            conflictError.statusCode = 400;
            throw conflictError
        }
    }

    // Daily threshold policies need to have lower max cost than weekly, monthly and yearly
    if (policyToValidate.interval === DAILY) {
        return validateCostsForInterval(policyToValidate, otherPolicies, DAILY);
        /* const policiesToCompareTo = otherPolicies.filter(policy => policy.interval !== DEFAULT && policy.interval !== DAILY);
         if (policiesToCompareTo && policiesToCompareTo.length > 0) {
             const policiesWithInvalidLowerCostThreshold = policiesToCompareTo.filter(policy => policy.cost < policyToValidate.cost);
             if (policiesWithInvalidLowerCostThreshold && policiesWithInvalidLowerCostThreshold.length > 0) {
                 const conflictError = new Error(`Policy conflict detected: A policy with interval ${policiesWithInvalidLowerCostThreshold[0].interval} has a lower cost threshold of ${policiesWithInvalidLowerCostThreshold[0].cost}`);
                 conflictError.statusCode = 400;
                 throw conflictError
             }

         }*/
    }

    // Weekly threshold policies need to have lower max cost than monthly and yearly and higher than daily
    if (policyToValidate.interval === WEEKLY) {
        return validateCostsForInterval(policyToValidate, otherPolicies, WEEKLY);
    }

    if (policyToValidate.interval === MONTHLY) {
        return validateCostsForInterval(policyToValidate, otherPolicies, MONTHLY);
    }

    if (policyToValidate.interval === YEARLY) {
        return validateCostsForInterval(policyToValidate, otherPolicies, YEARLY);
    }

};