import inquirer from "inquirer"

async function main() {
  console.clear()
  const answers1 = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What do you want to do?',
      choices: [
        'Create new module',
        'Extend existing module',
      ],
    },
  ])
const answer2 = await inquirer.prompt([
  {
    type: 'list',
    name: 'action2',
    message: 'poop piss?',
    choices: [
      'poop',
      'piss'
    ],
  },
])
}

main()
