import inquirer from "inquirer"
import { existsSync, mkdirSync } from "node:fs"

async function createNewModule(): Promise<void> {
  const { root } = await inquirer.prompt([{
    name: "root",
    type: "input",
    default: "./modules",
    message: "Specify modules root directory",
  }])

  if (!existsSync(root)) {
    const { createRoot } = await inquirer.prompt([{
      name: "createRoot",
      type: "confirm",
      default: false,
      message: "Specified root directory does not exist. Would you like to create one?"
    }])

    if (!createRoot) return createNewModule()
    mkdirSync(root)
  }


}

export default createNewModule
