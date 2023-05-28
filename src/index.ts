import inquirer from "inquirer"
import createNewModule from "./actions/createNewModule.ts"
import inquirerFuzzyPath from "inquirer-fuzzy-path"

inquirer.registerPrompt('fuzzypath', inquirerFuzzyPath as any)

enum Actions {
  CREATE_NEW_MODULE = 'Create new module',
  EXTEND_EXISTING_MODULE = 'Extend existing module'
}

const actionToHandlerMap: Record<Actions, () => void> = {
  [Actions.CREATE_NEW_MODULE]: createNewModule,
  [Actions.EXTEND_EXISTING_MODULE]: process.exit
}

console.clear()

const { action } = await inquirer.prompt<{ action: Actions }>([
  {
    type: 'list',
    name: 'action',
    message: 'What do you want to do?',
    choices: [
      Actions.CREATE_NEW_MODULE,
      Actions.EXTEND_EXISTING_MODULE,
    ],
  },
])

actionToHandlerMap[action]()
