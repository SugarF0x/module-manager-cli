import inquirer from "inquirer"
import { existsSync, mkdirSync, cpSync, readdirSync, statSync, readFileSync, writeFileSync } from "node:fs"
import { join, dirname, basename } from "node:path"
import { getAllFilePathsInDirectory } from "../utils/getAllFilePathsInDirectory.ts"
import { capitalize } from "../utils/capitalize.ts"

async function createNewModule(): Promise<void> {
  const { path } = await inquirer.prompt<{ path: string }>([
    {
      type: 'fuzzypath',
      name: 'path',
      excludePath: (nodePath: string) => nodePath.startsWith('node_modules'),
      excludeFilter: (nodePath: string) => nodePath == '.',
      itemType: 'directory',
      rootPath: 'modules',
      message: 'Select a target directory for your new block:',
      suggestOnly: true
    }
  ])

  if (!existsSync(path)) {
    const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
      {
        name: "confirm",
        type: "confirm",
        default: true,
        message: "Specified directory does not exist. A new one will be created. Do you want to proceed?"
      }
    ])

    if (!confirm) process.exit()
    mkdirSync(path)
  }

  const newModuleName = capitalize(basename(path))

  process.exit()

  // enum Internals {
  //   API = 'API',
  //   STORE = 'Store',
  //   UI = 'UI'
  // }
  //
  // const { internals } = await inquirer.prompt<{ internals: Internals[] }>([{
  //   name: 'internals',
  //   type: 'checkbox',
  //   message: 'Select internals',
  //   choices: [
  //     { name: Internals.API, checked: true, disabled: true },
  //     { name: Internals.STORE, checked: true, disabled: true },
  //     { name: Internals.UI, checked: true },
  //   ],
  //   validate: (input: Internals[]) => !!input.length || 'Must choose at least one option'
  // }])
  //
  // enum Content {
  //   TESTS = 'Test template',
  //   MOCKS = 'Mock template',
  //   SCREEN = 'Screen template'
  // }
  //
  // const { content } = await inquirer.prompt<{ content: Content[] }>([{
  //   name: 'content',
  //   type: 'checkbox',
  //   message: 'Select contents',
  //   choices: [
  //     { name: Content.TESTS, checked: true, disabled: true },
  //     { name: Content.MOCKS, checked: true, disabled: true },
  //     { name: Content.SCREEN, checked: true, disabled: !internals.includes(Internals.UI) },
  //   ]
  // }])
  //
  // const newModulePath = `${root}/${moduleName}`
  // const capitalizedModuleName = capitalize(moduleName)
  //
  // if (internals.includes(Internals.UI)) {
  //   const ModuleNamePlaceholder = 'Template'
  //   const uiPath = newModulePath + '/ui'
  //   const baseTemplatePath = 'src/templates/module/ui'
  //
  //   const allTemplateFiles = getAllFilePathsInDirectory(baseTemplatePath)
  //   const templateFileToNewPathMap = Object.fromEntries(allTemplateFiles.map(path => [path, path.replaceAll(ModuleNamePlaceholder, capitalizedModuleName).replaceAll(baseTemplatePath, uiPath)]))
  //
  //   for (const template of allTemplateFiles) {
  //     const target = templateFileToNewPathMap[template]
  //
  //     const parentDir = dirname(target)
  //     if (!existsSync(parentDir)) mkdirSync(parentDir, { recursive: true })
  //
  //     const fileContents = !content.includes(Content.SCREEN) ? '' : readFileSync(template, { encoding: 'utf8' }).replaceAll(ModuleNamePlaceholder, capitalizedModuleName)
  //     writeFileSync(target, fileContents)
  //   }
  // }
}

export default createNewModule
