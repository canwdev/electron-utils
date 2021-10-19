'use strict'

/*
	Straight-forward node.js arguments parser
	Author: eveningkid
	License: Apache-2.0
*/

function parseArgs(argv, slice = 2) {
  // Removing node/bin and called script name
  argv = argv.slice(slice)

  // Returned object
  const args = {}

  let argName, argValue

  // For each argument
  argv.forEach(function (arg) {
    // Separate argument, for a key/value return
    arg = arg.split('=')

    // Retrieve the argument name
    argName = arg[0]

    // Remove "--" or "-"
    if (argName.indexOf('-') === 0) {
      argName = argName.slice(argName.slice(0, 2).lastIndexOf('-') + 1)
    }

    // Associate defined value or initialize it to "true" state
    argValue = (arg.length === 2)
      ? parseFloat(arg[1]).toString() === arg[1] // check if argument is valid number
        ? +arg[1]
        : arg[1]
      : true

    // Finally add the argument to the args set
    args[argName] = argValue
  })

  return args
}

module.exports = parseArgs
