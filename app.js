#!/usr/bin/node

import Send from '#lib/send';
import SendMessage from '#lib/message';
import {program} from 'commander';
import splitString from 'split-string';

import 'commander-extras';

let args = program
	.name('push')
	.usage('-m module@opt=val --text [message...]')
	.option('-m, --module [name]', 'Specify the module(s) to use as a CSV, options are specified as key=vals after an @ symbol', (v, acc) => acc.concat([v]), [])
	.option('-t, --text [text]', 'Specify a plain text message, use multiple times for multiple messages', (v, acc) => acc.concat([v]), [])
	.option('-v, --verbose', 'Increase verbosity level, specify multiple times to increment', (v ,acc) => acc+1, 0)
	.option('-n, --dry-run', 'Dont actually send anything')
	.example('send -m slack@token=1234,channel=messages,username=@bot --text Hello', 'Say hello using Slack')
	.parse(process.argv)
	.opts();

if (args.verbose > 3) console.log('Running Send with raw args', args);

let send = new Send();

// Init all modules
if (args.verbose > 3) console.log('Init modules:');
args.module.forEach(rawMod => {
	let [, mod, modArgs] = /^(.+?)\s*@\s*(.+)$/.exec(rawMod);
	if (!mod) throw new Error(`Invalid module spec "${rawMod}"`);

	let modOptions = Object.fromEntries(
		splitString(modArgs, {
			quotes: ['"', "'"],
			separator: ',',
		})
			.map(rawArg => rawArg.split(/\s*=\s*/, 2))
	);

	if (args.verbose > 2) console.log('Init module', mod, modOptions);
	send.use(mod, modOptions);
});

// Gather all messages
if (args.verbose > 3) console.log('Process messages');
let messages = [];
args.text.forEach(rawText => {
	messages.push(new SendMessage({text: rawText}));
});

// Actually send messages
if (!args.dryRun) send.send(messages)
	.then(()=> {
		if (args.verbose > 0) console.log('Sent', messages.length, 'messages');
		process.exit(0);
	})
