const {connect, Contract, WalletAccount, keyStores} = require('near-api-js');

const ROBOT_ANIMATION = require("./robot_animation");

const robot_animation = new ROBOT_ANIMATION();

function getNearConfig(networkId) {
    return {
        networkId: networkId,
        nodeUrl: `https://rpc.${networkId}.near.org`,
        contractName: `dev-1649797487666-31565074981571`,
        walletUrl: `https://wallet.${networkId}.near.org`,
        helperUrl: `https://helper.${networkId}.near.org`,
    }
}
window.nearConfig = getNearConfig('testnet');

async function initContract() {
    window.near = await connect(Object.assign({ deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } }, window.nearConfig));
  
    window.walletAccount = new WalletAccount(window.near);
  
    window.accountId = window.walletAccount.getAccountId();
  
    window.contract = await window.near.loadContract(window.nearConfig.contractName, {
        viewMethods: ['get_answer'],
        changeMethods: [],
        sender: window.accountId,
    });
}


async function doWork() {
    if (!window.walletAccount.isSignedIn()) {
        signedOutFlow();
    } else {
        signedInFlow();
    }
}

function signedOutFlow() {
    setRobotMessage("login to your account");

    Array.from(document.querySelectorAll('.hide-signed-out')).forEach(el => el.style.visibility = 'hidden');

    document.getElementById('sign-in').addEventListener('click', () => {
        window.walletAccount.requestSignIn(window.nearConfig.contractName);
    });
}
  

function signedInFlow() {
    setRobotMessage("What's your name?");

    Array.from(document.querySelectorAll('.hide-signed-out')).forEach(el => el.style.visibility = 'visible');

    document.getElementById('sign-in').innerText = window.accountId;
  

    send_answer_button.innerHTML = 'Submit';
    send_answer_button.disabled = false;


    document.getElementById('sign-in').addEventListener('click', e => {
        e.preventDefault();
        window.walletAccount.signOut();
        window.location.replace(window.location.origin + window.location.pathname);
    });
}


function setRobotMessage(message) {
    const robot_message = document.getElementById('robot_message');

    robot_message.classList.remove('border_animation');
    robot_message.classList.add('border_r');
    let i = 0;
    robot_message.innerHTML = '';
    clearInterval(robot_message?.interval)

    robot_message.interval = setInterval(() => {
        if(message.length <= i) {
            clearInterval(robot_message?.interval)
            robot_message.classList.add('border_animation');
            robot_message.classList.remove('border_r');
        } else {
            robot_message.innerHTML += message[i];
            i++;
        }
    }, 50);
}




const send_answer_button = document.getElementById('send_answer_button');

send_answer_button.onclick = () => {
    send_answer_button.innerHTML = '<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true" style="margin-right: 5px"></span>Sending...';
    send_answer_button.disabled = true;

    window.contract.get_answer({name: document.getElementById('input_answer').value}).then(result => {
        setRobotMessage(result)

        send_answer_button.innerHTML = 'Submit';
        send_answer_button.disabled = false;
    });
}



window.onmousemove = (e) => {
    robot_animation.calculateRadian(e);
    robot_animation.draw();
}

window.onload = async () => {
    await robot_animation.load();
    await initContract();
    doWork();

    robot_animation.draw();
}