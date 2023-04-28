import inquirer from "inquirer"
import { existsSync, mkdirSync } from "node:fs"

const MODULES_ROOT = './modules'

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
      message: "Specified root directory does not exist. Would you like to create one?"
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

  mkdirSync(`${root}/${moduleName}`)
}

export default createNewModule
