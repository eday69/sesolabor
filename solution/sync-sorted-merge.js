"use strict";
// Print all entries, across all of the sources, in chronological order.
var _ = require('lodash');

module.exports = (logSources, printer) => {
  let entries = logSources.map((log, i) => ({log: log.pop(), index: i}));
  entries = _.sortBy(entries, 'log.date');

  do {
    const entry = entries.splice(0, 1);
    printer.print(entry[0].log);

    const newEntry = logSources[entry[0].index].pop();
    if (newEntry) entries.push({ log: newEntry, index: entry[0].index });
    entries = _.sortBy(entries, 'log.date');
  }
  while(entries.length);

  printer.done();
  return console.log("Sync sort complete.");
};


