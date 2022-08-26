const program = require('commander')

let {version, description} = require('../package.json')

program
    .name('skelo')
    .version(version)
    .description(description)

program
    .command("build")
    .description("build Docusaurus-related files (sidebars.js and markdown files)")
    .argument('[outlineFiles...]', 'documentation outline filename(s) in either .yaml or .md format', [])

    .option('-d, --docs <path>', 'path to Docusarus project docs root folder', 'docs')
    .option('-s, --sidebars <filename>', 'path and filename to sidebars.js for Docusaurus-project', 'sidebars.js')

    .action((outlineFiles, options) => {
        console.log(JSON.stringify(outlineFiles, null, 4))
    })

program
    .parse("node cli.js build".split(/\s+/))


