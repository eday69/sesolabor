"use strict";
var _ = require('lodash');

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = (logSources, printer) => {

  const logEntry = (log) => new Promise((resolve, reject) => {
    const value = log.popAsync();
    resolve(value);
  });

  return new Promise((resolve, reject) => {
    const logEntries = logSources.map((log, i) => logEntry(log).then(
      (res) => ({
        log: res,
        index: i
      })
    ));

    Promise.all(logEntries)
      .then((entries) => _.sortBy(entries, 'log.date'))
      .then(async (sortedEntries) => {
        let next = true;
        do {
          if (next) {
            next = false;
            const last = sortedEntries[0];
            printer.print(last.log);
            sortedEntries.splice(0, 1);
            await logEntry(logSources[last.index]).then((newEntry) => {
              if (newEntry) sortedEntries.push({log: newEntry, index: last.index});
              sortedEntries = _.sortBy(sortedEntries, 'log.date');
              next = true;
            });
          }
        }
        while(sortedEntries.length);
      })
      .then(() => {
        printer.done();
        resolve(console.log("Async sort complete."));
      });
  });
};
