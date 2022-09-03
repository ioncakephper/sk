/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-nocheck

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
    ...{
        // By default, Docusaurus generates a sidebar from the docs folder structure
        /*
        tutorialSidebar: [{type: 'autogenerated', dirName: '.'}],
        */

        // But you can create a sidebar manually
        /*
        tutorialSidebar: [
          {
            type: 'category',
            label: 'Tutorial',
            items: ['hello'],
          },
        ],
         */
    },
    ...{
        "skelo-docs": [
            "intro",
            "getting-started",
            "outline-file",
            "category-content"
        ],
        "sample-ftos-studio": [{
                "label": "Getting started",
                "type": "category",
                "items": [
                    "samples/studio/user-guide/getting-started/overview",
                    "samples/studio/user-guide/getting-started/evolutive-data-core",
                    "samples/studio/user-guide/getting-started/digital-experience",
                    "samples/studio/user-guide/getting-started/automation-processors",
                    "samples/studio/user-guide/getting-started/ecosystem",
                    "samples/studio/user-guide/getting-started/analytics",
                    "samples/studio/user-guide/getting-started/configuration-management",
                    "samples/studio/user-guide/getting-started/advanced-development-tools",
                    "samples/studio/user-guide/getting-started/security",
                    "samples/studio/user-guide/getting-started/admin-configuration"
                ]
            },
            {
                "label": "Evolutive data core",
                "type": "category",
                "items": [
                    "samples/studio/user-guide/evolutive-data-core/overview",
                    "samples/studio/user-guide/evolutive-data-core/data-model-designer",
                    {
                        "label": "Data model explorer",
                        "type": "category",
                        "items": [
                            "samples/studio/user-guide/evolutive-data-core/data-model-explorer/overview",
                            "samples/studio/user-guide/evolutive-data-core/data-model-explorer/browse-entities",
                            "samples/studio/user-guide/evolutive-data-core/data-model-explorer/create-entity",
                            "samples/studio/user-guide/evolutive-data-core/data-model-explorer/modify-entity-properties",
                            "samples/studio/user-guide/evolutive-data-core/data-model-explorer/delete-entity",
                            "samples/studio/user-guide/evolutive-data-core/data-model-explorer/export-selected-rows",
                            "samples/studio/user-guide/evolutive-data-core/data-model-explorer/advanced-search",
                            "samples/studio/user-guide/evolutive-data-core/data-model-explorer/entity-attributes",
                            "samples/studio/user-guide/evolutive-data-core/data-model-explorer/entity-data-forms",
                            "samples/studio/user-guide/evolutive-data-core/data-model-explorer/entity-views",
                            "samples/studio/user-guide/evolutive-data-core/data-model-explorer/entity-data-api",
                            "samples/studio/user-guide/evolutive-data-core/data-model-explorer/extend-data-model",
                            "samples/studio/user-guide/evolutive-data-core/data-model-explorer/entity-unique-constraints",
                            "samples/studio/user-guide/evolutive-data-core/data-model-explorer/referenced-entities",
                            "samples/studio/user-guide/evolutive-data-core/data-model-explorer/referencing-entities"
                        ]
                    },
                    "samples/studio/user-guide/evolutive-data-core/data-import-templates",
                    "samples/studio/user-guide/evolutive-data-core/data-governance",
                    "samples/studio/user-guide/evolutive-data-core/data-pipes"
                ]
            },
            {
                "label": "Digital experience",
                "type": "category",
                "items": [
                    "samples/studio/user-guide/digital-experience/overview",
                    {
                        "label": "Digital journeys",
                        "type": "category",
                        "items": [
                            "samples/studio/user-guide/digital-experience/digital-journeys/overview",
                            "samples/studio/user-guide/digital-experience/digital-journeys/digital-journey",
                            "samples/studio/user-guide/digital-experience/digital-journeys/form-driven-flow",
                            "samples/studio/user-guide/digital-experience/digital-journeys/form-driven-flow-mockup",
                            "samples/studio/user-guide/digital-experience/digital-journeys/custom-flows",
                            "samples/studio/user-guide/digital-experience/digital-journeys/code-locations",
                            "samples/studio/user-guide/digital-experience/digital-journeys/digital-journey-map",
                            "samples/studio/user-guide/digital-experience/digital-journeys/digital-journey-context",
                            "samples/studio/user-guide/digital-experience/digital-journeys/ui-designer",
                            "samples/studio/user-guide/digital-experience/digital-journeys/using-custom-css",
                            "samples/studio/user-guide/digital-experience/digital-journeys/localization",
                            "samples/studio/user-guide/digital-experience/digital-journeys/code-snippets-support"
                        ]
                    },
                    "samples/studio/user-guide/digital-experience/digital-frontends"
                ]
            }
        ]
    },
};

module.exports = sidebars;