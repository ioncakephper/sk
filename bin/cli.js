const program = require('commander')

const path = require("path");
const { saveDocument, setDefaultExtension } = require("file-easy");
const hbsr = require("hbsr");
const yamljs = require("yamljs");
const beautify = require("beautify");

const {loadMarkdownSidebarDefinitions} = require('../lib/md-app.js');
const fs = require('fs');

const VERSION = require("../package.json").version;
const DESCRIPTION = require("../package.json").description || "";

program.version(VERSION).description(DESCRIPTION).name("skelo");

program
    .command('init')
    .description('create configuration file')
    .argument('[configFilename]', 'configuration filename', 'skelo-config.json')
    .action((configFilename) => {
        configFilename = setDefaultExtension(configFilename, '.json')
        let defaultConfigurationFilename = path.join('../', 'skelo-config.json')
        let defaultConfiguration = require(defaultConfigurationFilename) || {
            'autoFolder': true,
            "autoOverview": {
                "active": true,
                "options": {
                    "label": "Overview",
                    "title": "{{{category-label}}}",
                    "titleCase": "sentence"
                }
            }
        }
        let configurationContent = JSON.stringify(defaultConfiguration, null, 4)
        saveDocument(configFilename, configurationContent)
    }); 

program
    .command("build", { isDefault: true })
    .description("Builds the documentation")
    .argument("[outlineFiles...]", "The outline files to build", ["outline"])
    .option("-s, --sidebars <sidebars>", "The sidebars file to use", "sidebars")
    .option("-d, --docs <path>", "The docs directory to use", "docs")
    .option(
        "--sidebarsTemplate <path>",
        "The sidebars template to use",
        "sidebars"
    )
    .option("--outlineExtension <extension>", "The outline extension to use", ".yml")
    .option("--headingsTemplate <path>", "The headings template to use", "headings")
    .option("--topicExtension <extension>", "The topic extension to use", ".md")
    .option("--topicTemplate <path>", "The topic template to use", "topic")
    .option("-c, --configuration <configFilename>", 'path to configuration file', 'skelo-config.json')
    .action((outlineFiles, options) => {
        
        // Load the configuration file
        // let configuration = require(configFilename);
        let generalConfiguration = loadConfiguration(options);
        // console.log(JSON.stringify(configuration, null, 4));

        let sidebars = buildSidebarsFromAllFiles(outlineFiles, {
            ...{generalConfiguration: generalConfiguration},
            ...options});
        createSidebarsFile(sidebars, options);
    }); 

// TODO: Remove manual CLI invocations below and place program.parse() instead

// program.parse("node cli.js fintechos-outline.md".split(/\s+/));
// program.parse("node cli.js outline".split(/\s+/));
// program.parse("node cli.js skelo-outline.md".split(/\s+/));
// program.parse("node cli.js stripe-outline.md apple-style-outline.md yammer-outline.md".split(/\s+/));
// program.parse("node cli.js all-ftos-documentation-outline.md".split(/\s+/));
program.parse("node cli.js ./website/skelo-outline.md ./website/sample-outline.md -d ./website/docs -s ./website/sidebars.js -c ../skelo-config.json".split(/\s+/));
// program.parse("node cli.js ftos-outline.md".split(/\s+/));
// program.parse("node cli.js b4-outline.md".split(/\s+/));
// program.parse("node cli.js init".split(/\s+/));


/**
 * Loads the configuration file.       
 * @param {object} [options={}] - the options object.       
 * @returns {object} the configuration object.      
 */
function loadConfiguration(options = {}) {
    // Get whichever configuration files exist, and use the first configuration path found. First try the configuration file in the local folder, then
    // try the configuration path in the package (skelo-config.json)

    let viableConfigFilenames = [
        path.join('./', setDefaultExtension(options.configuration, '.json')),
        path.join(__dirname, '../', 'skelo-config.json')
    ]
    // Check if the file exists, if not, return undefined.
    .filter((item) => {
        return fs.existsSync(item)
    });

    let configFilename = viableConfigFilenames[0];

    if (!configFilename) {
        throw new Error(`Configuration file not found: ${configFilename}`)
    }
    let generalConfiguration = require(configFilename);
    return generalConfiguration;
}

/**
 * Builds the sidebar from the given outline file.           
 * @param {string} outlineFile - the path to the outline file.           
 * @param {Object} options - the options object.           
 * @returns {Object} the sidebar object.           
 */
function buildSidebarsFromAllFiles(outlineFiles, options) {
    let sidebars = {};
    outlineFiles.forEach((outlineFile) => {
        sidebars = { ...sidebars, ...buildSidebarsFromFile(outlineFile, options) };
    });
    return sidebars;
}

/**
 * Builds the sidebar items from the outline file.       
 * @param {string} outlineFile - the path to the outline file.       
 * @param {object} options - the options object.       
 * @returns {object} the sidebar items.       
 */
function buildSidebarsFromFile(outlineFile, options) {
    const sidebars = {};
    const outline = getSidebarsOutlineFromFile(outlineFile, options);
    outline.forEach((section) => {
        let isAutoGenerated = section.autogenerated && section.autogenerated === true;
        sidebars[section.sidebar] = isAutoGenerated ? buildAutogeneratedSidebar(section, {...options, ...{autogenerated: isAutoGenerated}}) : buildSidebarItems(section.items || [], { ...options, ...section });
    }
    );
    return sidebars;
}

/**
 * Builds the sidebar for the given section.
 * @param {string} section - the section to build the sidebar for.
 * @param {object} options - the options for the sidebar.
 * @returns {Array<SidebarItem>} - the sidebar items for the given section.
 */
function buildAutogeneratedSidebar(section, options) {
    let sidebarItems = [];
    sidebarItems.push({
        type: 'autogenerated',
        dirName: path.join('.', section.path || ""),
    })

    buildSidebarItems(section.items || [], { ...options, ...section })

    return sidebarItems;
}
/**
 * Takes in a file path and returns the outline from that file.       
 * @param {string} outlineFile - the file path of the outline       
 * @param {object} options - the options object       
 * @returns {object} the outline from the file       
 */
function getSidebarsOutlineFromFile(outlineFile, options) {
    // append default outline extension from options if outlineFile extension is not provided
    if (!path.extname(outlineFile)) {
        outlineFile += options.outlineExtension;
    }
    const isYamlFile = outlineFile.endsWith(".yaml") || outlineFile.endsWith(".yml");
    let outline = isYamlFile ? yamljs.load(outlineFile).sidebars : loadMarkdownSidebarDefinitions(outlineFile, options);

    return outline;
}



/**
 * Takes in an array of items and returns an array of sidebar items.           
 * @param {Array<SidebarItem>} items - the array of sidebar items.           
 * @param {SidebarOptions} options - the options for the sidebar.           
 * @returns {Array<SidebarItem>} - the array of sidebar items.           
 */
function buildSidebarItems(items = [], options) {
    return items.map((item) => {
        item = normalizeItem(item);
        return isTopic(item) ? buildTopic(item, options) : buildSection(item, options);
    }
    );
}

/**
 * Builds the topic slug for the given item.       
 * @param {object} item - the item to build the topic slug for.       
 * @param {object} options - the options object.       
 * @returns {string} the topic slug.       
 */
function buildTopic(item, options) {

    let topicSlug = getItemSlug(item, options) || getItemId(item, options);
    topicSlug = path.join(options.path || "", getItemPath(item, options), topicSlug);

    createTopicFile(topicSlug, item, options);

    return topicSlug.replace(/\\/g, "/");
}

/**
 * Creates a topic file for the given item.           
 * @param {string} topicSlug - the slug of the topic to create a file for.           
 * @param {Item} item - the item to create a file for.           
 * @param {Options} options - the options for the site.           
 * @returns None           
 */
function createTopicFile(topicSlug, item, options) {

    if (item.protect) {
        return;
    }
    let topicContent = hbsr.render_template(options.topicTemplate, {
        ...item,
        ...{
            title: (item.title && item.title.trim() !== item.label.trim()) ? item.title : null,
            id: getItemId(item, options),
            slug: getItemSlug(item, options),
            sidebar_label: item.label,
            headings: buildHeadings(item.headings || [], options),
        }
    })
    let topicFile = path.join(options.docs, topicSlug + options.topicExtension);
    saveDocument(topicFile, topicContent);
}

/**
 * Takes in an array of items and builds a heading tree.           
 * @param {Array<Item>} items - the items to build a heading tree from.           
 * @param {Object} options - the options object.           
 * @param {number} [level=2] - the level of the headings.           
 * @returns {string} - the headings as a string.           
 */
function buildHeadings(items = [], options, level = 2) {
    let headings = items.map((item) => {
        item = normalizeItem(item);
        return {
            prefix: '#'.repeat(level),
            label: item.label,
            brief: item.brief,
            headings: buildHeadings(item.items || [], options, level + 1),
        }
    });

    return hbsr.render_template(options.headingsTemplate, { headings: headings })

}

/**
 * Builds the sidebar items for the given item.       
 * @param {SidebarItem} item - the sidebar item to build.       
 * @param {SidebarOptions} options - the options for the sidebar.       
 * @returns {SidebarItem[]} the sidebar items for the given item.       
 */
function buildSection(item, options) {
    options = { ...options, ...{ path: path.join(options.path || '', getItemPath(item, options)) } };
    createAutogeneratedSectionFile(item, options);
    return {
        label: item.label,
        type: "category",
        items: buildSidebarItems(item.items, options),
    }
}

/**
 * Creates a file that contains the category information for the generated index.       
 * @param {object} item - the category object to save       
 * @param {object} options - the options object       
 * @returns None       
 */
function createAutogeneratedSectionFile(item, options) {
    if (options.autogenerated) {
        let category = {
            label: item.label,
            link: {
                type: "generated-index",
            }
        }
        let sectionContent = JSON.stringify(category, null, 2);
        let sectionFile = path.join(options.docs, options.path || '.',  `_category_.json`);
        saveDocument(sectionFile, sectionContent);
    }
}

/**
 * Takes in an item and normalizes it to a valid object.           
 * @param {string | {label: string, items: Array<string | {label: string, items: Array<string>}>}} item - the item to normalize.
 * @returns {SidebarItem} the normalized item.
 */
function normalizeItem(item) {
    let isItemAString = typeof item === "string";
    if (isItemAString) {
        item = { label: item };
    }
    if (item.label) {
        item.label = item.label.trim();
        item = { ...{ items: [] }, ...item };
    }
    return item;
}

/**
 * Gets the id of an item.       
 * @param {object} item - the item to get the id of       
 * @param {object} options - the options object       
 * @returns {string} the id of the item       
 */
function getItemId(item, options) {
    return (item.id || item.label).toLowerCase().replace(/\s/g, "-");
}

/**
 * Gets the path of an item.       
 * @param {Item} item - the item to get the path of.       
 * @param {Object} [options] - the options object.       
 * @returns {string} the path of the item.       
 */
function getItemPath(item, options) {
    return (item.path || "").trim().toLowerCase().replace(/\s/g, "-");
}

/**
 * Gets the slug of an item.       
 * @param {object} item - the item to get the slug of.       
 * @param {object} [options] - the options to use.       
 * @returns {string} the slug of the item.       
 */
function getItemSlug(item, options) {
    if (item.slug) {
        let r = item.slug.trim().toLowerCase().replace(/\s/g, "-");
        r = r.replace(/[^a-z0-9-]/g, "-");
        r = r.replace(/-+/g, "-");
        return r;
    }
}

/**
 * Checks if the given item is a topic.           
 * @param {any} item - the item to check           
 * @returns {boolean} - true if the item is a topic, false otherwise           
 */
function isTopic(item) {
    return !item.items || (item.items && item.items.length === 0);
}

/**
 * Creates a sidebars.js file with the given sidebars.
 * @param {Sidebar[]} sidebars - The sidebars to create a file for.
 * @param {Options} options - The options object.
 * @returns None
 */
function createSidebarsFile(sidebars, options) {
    const sidebarsTemplate = options.sidebarsTemplate || "sidebars`";
    let sidebarsFilename = options.sidebars || "sidebars.js";

    // append extension .js if sidebarsFilename extension is empty
    if (path.extname(sidebarsFilename) === "") {
        sidebarsFilename += ".js";
    }

    // Render the sidebars template with the sidebars data array as a JSON string
    let sidebarsContent = hbsr.render_template(sidebarsTemplate, {
        sidebars: JSON.stringify(sidebars, null, 4),
    });
    sidebarsContent = beautify(sidebarsContent, { format: "js", indent_size: 4 });
    saveDocument(sidebarsFilename, sidebarsContent);
}

