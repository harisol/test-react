/**
 * When we want to export multiple variables/functions from one module to another,
 * we use exports.
 * exports bisa pake berbagai cara
 */

// cara 1
exports.tentacles = 8;
exports.logA = () => {
    console.log('you called function logA');
};

// cara 2
logB = () => {
    console.log('you called function logB');
};
exports.logB = logB;

// cara 3
function currentDate() {
    console.log(new Date());
}
exports.currentDate = currentDate;

// ini adalah promise. Jalannya Asynchronous
exports.myPromise = (x) => {
    return new Promise(function (myResolve, myReject) {
        if (x == 0) {
            const valueThatCanBeAnything = {
                name: "ben",
                address: "jakarta"
            }
            // const valueThatCanBeAnything = "OK";
            myResolve(valueThatCanBeAnything); // used in then or can be saved in variable
        } else {
            const valueThatCanBeAnything = new Error('parameter is not zero');
            // const valueThatCanBeAnything = "Error";
            myReject(valueThatCanBeAnything); // used in catch
        }
    });
};
