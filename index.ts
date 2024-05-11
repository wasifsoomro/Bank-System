#!/usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
//Create a User class with properties that required
class User {
    firstName: string;
    lastName: string;
    username: string;
    age: number;
    password: string;
    mobNumber: number;
    accountNumber: number;
    identityCard: number;
    balance: number

//create a constructor to initialize user object with provided data
    constructor(firstName: string, lastName: string, username:string, age: number, password:string, mobNumber:number, accountNumber: number, balance: number, identityCard: number){
        this.firstName= firstName;
        this.lastName = lastName;
        this.username = username;
        this.password = password;
        this.age = age;
        this.mobNumber = mobNumber;
        this.accountNumber = accountNumber;
        this.balance = balance
        this.identityCard = identityCard
    }

    // create a function that return user information
    userInformation(){
        return chalk.cyan(`${this.firstName} ${this.lastName}
        Age: ${this.age}
        username:${this.username}
        Mobile Number: ${this.mobNumber}
        Account Number: ${this.accountNumber}
        Balance: ${this.balance}`)
    }

    // create a deposite function that add amount in the user's balance
    deposite(amount: number){
        this.balance += amount
    }
    
    //withdraw function that checks balance and then subtract it from user balance
    withdraw(amount: number){
        if(this.balance >= amount){
            this.balance -= amount
        }else{
            console.log(chalk.red("Insuficient Balance"))
        }
    }
}

//Create a Bank Class  with properties that need and managaes registration login and banking operations
class Bank {
    users: User[];  //store registered user in array
    balance: number;   //Balance that in the bank
    logedInUser: User| null  //checks currentlty user logged in or not
    constructor(){
        this.users = [];
        this.balance = 0;
        this.logedInUser = null

    }

    //Generate a bank account number that is different for every user
    generateAccountNumber(){
        return Math.floor(Math.random()* 9000000000 + 1000000000)
    }

    // give a prompt login, register or exit the app
    async options(){
        let chooseOption = await inquirer.prompt([{
            type: 'list',
            name: "Perform",
            message: "Choose option",
            choices: ["Register", "Login", "Exit"]
        }])
        if(chooseOption.Perform === "Register" ){
           return await this.promptRegisterUser()
        }
        if(chooseOption.Perform == "Login" ){
            return await this.userlogin()
        }
        if(chooseOption.perform == "Exit"){
            process.exit()
        }
    }    
    
    // Ask for details to register new user
    async promptRegisterUser(){
        let user = await inquirer.prompt([{
            type: "input",
            name: "fname",
            message: "What is your First Name?"
        },
        {
            type: "input",
            name: "lname",
            message: "What is your last Name?"
        },
        {
            type: "input",
            name: "NIC",
            message: "Enter Your National ID card Number",
            validate: (input: string)=>{
                if(input.length ==13 ){
                    return true
                }
                return chalk.red("Enter NIC")
            }
        },
        {
            type: "input",
            name: "age",
            message: "What is your age?",
            validate: (input: string) => {
                const age = parseInt(input)
                if(!Number.isNaN(age) && age >= 18){
                    return true
                }
                return chalk.red("Age must be a valid number greater than 18.");
            },
        },
        {
            type: "input",
            name: "username",
            message: "Create your username?",
            validate: (input: string)=>{
                let exixtingUser = this.users.find(u => u.username === input)
                if(exixtingUser){
                    return chalk.red("Username already exists, Please choose a unique username")
                }
                return true
            }
        },
        {
            
            type: "password",
            name: "password",
            message: "Create your password?",
            validate: (input:string)=>{
                if(input.length >= 8){
                    return true
                }
                return chalk.red("Password must be at least 8 characters long.")
            }
        },
        {
            
            type: "input",
            name: "mobileNumber",
            message: "Give Your Mobile Number?",
            validate: (input: string)=>{
                if(input.length === 11){
                    return true
                } 
                return chalk.red("Mobile number must be 11 digits long ")
            }               
        }
        
        ])
        const { fname, lname, age, username, password, mobileNumber } = user;
        const accountNumber = this.generateAccountNumber();
        const newUser = new User(fname, lname, username, parseInt(age), password, parseInt(mobileNumber), accountNumber, this.balance, 0);
        
        this.users.push(newUser)
        console.log(chalk.green(`registration Succesful, Your account Number is ${chalk.red(accountNumber)}`))
        await this.userlogin()
    }

    async userlogin(){
        let login = await inquirer.prompt([{
            type: "input",
            name: "uname",
            message: "Enter username"
        },
        {
            type: "password",
            name: "Password",
            message: "Enter Password"
        }
        ])
        const {uname, Password} = login
        const user = this.users.find(u => u.username === uname )

        if (user) {
            if (user.password === Password) {
                this.logedInUser = user; // Assign the found user object
                console.log(chalk.green(`Login Successful`));
                await this.bankAccount();
            } else {
                console.log(chalk.red('Incorrect password. Please try again.'));
                await this.userlogin(); // Prompt user to login again
            }
        } else {
            console.log(chalk.red.bold('User not registered. Please register first.'));
            await this.options(); // Prompt user to register or login again
        }
    }

    //This function handles bank operation like view account, deposite, withdaraw and logout
    async bankAccount(){
        while(this.logedInUser){
            let { BankOption } = await inquirer.prompt([{
                type: "list",
                name: "BankOption",
                message: "Choose an action",
                choices: ["View Account", "Balance", "Deposite", "Withdraw", "Logout"]
            }])

            //Switch statement switch the opertion on the basis of user action
            switch( BankOption ){
                case "View Account":
                    console.log(this.logedInUser.userInformation())
                    break;  
                case "Balance":
                    console.log(`Your current balance is ${chalk.green.bold(this.logedInUser.balance)}`)
                    break;
                case "Deposite":
                    let depositeMoney = await inquirer.prompt({
                        type: "input",
                        name: "amount",
                        message: "Enter amount to deposite"
                    })     
                    let depositeAmount = parseFloat(depositeMoney.amount)
                    if(isNaN(depositeAmount)  || depositeAmount <= 0){
                        console.log(chalk.red("Invalid Amount"))
                    }else{
                        this.logedInUser.deposite(depositeAmount)
                        console.log(chalk.green("Deposite succesful"))
                    }   
                    break;
                case "Withdraw":
                    let withdrawMoney = await inquirer.prompt({
                        type: "input",
                        name: "amount",
                        message: "Enter amount to withdraw"
                    })     
                    let withdrawAmount = parseFloat(withdrawMoney.amount)
                    if(isNaN(withdrawAmount)  || withdrawAmount <= 0 || withdrawAmount > this.logedInUser.balance){
                        console.log(chalk.red.bold("Invalid Amount or Insufficient Balance"))
                    }else{
                        this.logedInUser.withdraw(withdrawAmount)
                        console.log(chalk.green.bold.italic("Withdraw succesful"))
                    }   
                    break;
                case "Logout":
                    this.logedInUser = null;
                    console.log(chalk.blueBright("Logout Succesfully"))
                    await this.options()
                    break;
                default:
                    console.log(chalk.red.bold('Invalid action.'));
                    break;    
            }
        }
    }
}

// Main function create a new bank object and start banking operations by calling options() method
async function main(){
    const bank = new Bank()
    await bank.options()
}
main()