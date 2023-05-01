import inquirer from "inquirer"
import { existsSync, mkdirSync, cpSync, readdirSync, statSync, readFileSync, writeFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { getAllFilePathsInDirectory } from "../utils/getAllFilePathsInDirectory.js"
import { capitalize } from "../utils/capitalize.js"

const MODULES_ROOT = 'modules'

async function createNewModule(): Promise<void> {
  const { root } = await inquirer.prompt<{ root: string }>([{
    name: "root",
    type: "input",
    default: MODULES_ROOT,
    message: "Specify modules root directory",
  }])

  if (!existsSync(root)) {
    const { shouldCreateRoot } = await inquirer.prompt<{ shouldCreateRoot: boolean }>([{
      name: "shouldCreateRoot",
      type: "confirm",
      default: false,
      message: "Specified root directory does not exist. A new one will be created. Do you want to proceed?"
    }])

    if (!shouldCreateRoot) return createNewModule()
    mkdirSync(root)
  }

  const { moduleName } = await inquirer.prompt<{ moduleName: string }>([{
    name: 'moduleName',
    type: 'input',
    default: 'newModule',
    message: 'Specify new module name',
    validate(input: string): boolean | string {
      if (existsSync(`${root}/${input}`)) return `Module ${input} already exists`
      return true
    }
  }])

  enum Internals {
    API = 'API',
    STORE = 'Store',
    UI = 'UI'
  }

  const { internals } = await inquirer.prompt<{ internals: Internals[] }>([{
    name: 'internals',
    type: 'checkbox',
    message: 'Select internals',
    choices: [
      { name: Internals.API, checked: true, disabled: true },
      { name: Internals.STORE, checked: true, disabled: true },
      { name: Internals.UI, checked: true },
    ],
    validate: (input: Internals[]) => !!input.length || 'Must choose at least one option'
  }])

  enum Content {
    TESTS = 'Test template',
    MOCKS = 'Mock template',
    SCREEN = 'Screen template'
  }

  const { content } = await inquirer.prompt<{ content: Content[] }>([{
    name: 'content',
    type: 'checkbox',
    message: 'Select contents',
    choices: [
      { name: Content.TESTS, checked: true, disabled: true },
      { name: Content.MOCKS, checked: true, disabled: true },
      { name: Content.SCREEN, checked: true, disabled: !internals.includes(Internals.UI) },
    ]
  }])

  const newModulePath = `${root}/${moduleName}`
  const capitalizedModuleName = capitalize(moduleName)

  if (internals.includes(Internals.UI)) {
    const ModuleNamePlaceholder = 'Template'
    const uiPath = newModulePath + '/ui'
    const baseTemplatePath = 'src/templates/module/ui'

    const allTemplateFiles = getAllFilePathsInDirectory(baseTemplatePath)
    const templateFileToNewPathMap = Object.fromEntries(allTemplateFiles.map(path => [path, path.replaceAll(ModuleNamePlaceholder, capitalizedModuleName).replaceAll(baseTemplatePath, uiPath)]))

    for (const template of allTemplateFiles) {
      const target = templateFileToNewPathMap[template]

      const parentDir = dirname(target)
      if (!existsSync(parentDir)) mkdirSync(parentDir, { recursive: true })

      const fileContents = !content.includes(Content.SCREEN) ? '' : readFileSync(template, { encoding: 'utf8' }).replaceAll(ModuleNamePlaceholder, capitalizedModuleName)
      writeFileSync(target, fileContents)
    }
  }
}

export default createNewModule
