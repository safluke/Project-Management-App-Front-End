var dict = {};
var userid = 0
var encode = ''
var menu = 1

const heroku= "https://codejava-app-spring.herokuapp.com"
const local="http://localhost:8080"

const getTableActions = (data) => {

$("#action-table tbody tr").remove();

  //map current listing to action id's
  for (let i = 0; i < data.length; i++) {
    dict[i + 1] = data[i]['actionid']
    //console.log(dict)
  }

  //create table

  for (let i = 0; i < data.length; i++) {
    let counter = 0

    const tabdata = data[i] // any json data or array of objects
    const tableData = data.map(function(value) {
      counter++

      return (
        `<tr>
            <td>${counter}</td>
            <td>${value.datecreated}</td>
            <td>${value.content}</td>
            <td>${value.deadline}</td>
            <td>${value.deadline1}</td>
            <td>${value.deadline2}</td>
            <td>${value.status}</td>
        </tr>`
      );
    }).join('');
    const tableBody = document.querySelector("#Table-body");
    tableBody.innerHTML = tableData;
  }
}


const verify = async () => {

  let email = document.getElementById("loginEmailtext").value
  var password = document.getElementById("loginPasswordtext").value


  encode = 'Basic ' + window.btoa(email + ':' + password);

  console.log(encode)

  let status0 = 0
  let data0 = ''
  let status = 0
  let data = ''

  //Check to see if account exists
  const checkEmail = async () => {
    let response = await fetch(`https://codejava-app-spring.herokuapp.com/checkUser?email=${email}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(response =>
        response.json().then(data => ({
          data: data,
          status: response.status
        })).then(res => {
          console.log(res.status, res.data)
          status0 = res.status
          data0 = res.data
          userid = res.data['userid']
          console.log(userid)
        }))
  }

  await checkEmail()

  if (status0!=200) {
    document.querySelector('#AccountExist').classList.remove("hide")
  }
  else{
      document.querySelector('#AccountExist').classList.add("hide")


  const postLogin = async () => {
    console.log("logging")
    let response = await fetch('https://codejava-app-spring.herokuapp.com/createLogin', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': encode
      },

      body: JSON.stringify({
        userid: userid
      })
    })
  }


  const authenticate = async () => {
    document.querySelector('#WrongPass').classList.remove("hide")
    // ensure that the email/password match and then retrieve user info
    let response = await fetch(`https://codejava-app-spring.herokuapp.com/getUserActions?userid=${userid}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': encode
        }
      })
      .then(response =>
        response.json().then(data => ({
          data: data,
          status: response.status
        })).then(res => {
          console.log(res.status, res.data)
          status = res.status
          data = res.data

        }))

    if (status == 200) {
      document.querySelector('#WrongPass').classList.add("hide")
      document.querySelector('#loginEmailtext').value = ''
      document.querySelector('#loginPasswordtext').value = ''
      document.querySelector('#Register-box').classList.add("hide")
      document.querySelector('#Sign-in-box').classList.add("hide")
      await document.querySelector('#Action-box').classList.remove("hide")


    getTableActions(data)
  }else {
    document.querySelector('#WrongPass').classList.remove("hide")

  }
  }



  if (status0  == '200 ') {
    await postLogin()
    try {await authenticate()} catch (SyntaxError)
    {console.log("Incorrect Password")
    document.querySelector('#WrongPass').classList.remove("hide")}
    }
}}


const registerClick = async () => {

  let status = 0
  let data = ''
  let status1 = 0
  let status2 = 0
  let data1 = ''
  let data2 = ''
  userid = 0
  let email = document.getElementById("inputemail").value
  let firstName = document.getElementById("inputName").value
  let lastName = document.getElementById("inputName2").value
  let password = document.getElementById("inputpassword").value
  document.querySelector('#AccountExist').classList.add("hide")

  if (email=='' | firstName=='' | lastName=='' | password==''){
    console.log('user details not entered')
    document.querySelector('#UserDetailsNot').classList.remove("hide")}
else
  {
  document.querySelector('#UserDetailsNot').classList.add("hide")
  //Check if account created, if so then route to sign in
  const checkRegisterSaved = async () => {
    let response = await fetch(`https://codejava-app-spring.herokuapp.com/checkUser?email=${email}`, {
        method: 'GET',
        //crossOrigin: null,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(response =>
        response.json().then(data => ({
          data: data,
          status: response.status
        })).then(res => {
          console.log(res.status, res.data)
          status2 = res.status
          data2 = res.data[0]
        }))


  }

  await checkRegisterSaved()

  if (status2==200) {
    document.querySelector("#Userindb").classList.remove("hide")
  }else{
    console.log("adding")
    document.querySelector("#Userindb").classList.add("hide")
  let response = await fetch('https://codejava-app-spring.herokuapp.com/createUser', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        firstname: firstName,
        lastname: lastName,
        email: email,
        password: password
      })
    })
    .then(response =>
      response.json().then(data => ({
        data: data,
        status: response.status
      })).then(res => {
        console.log(res.status, res.data[0])
        status1 = res.status
        data1 = res.data[0]
      }))

  await checkRegisterSaved()

  if (status2 ==200) {
    document.querySelector('#dberror').classList.add("hide")
    document.querySelector('#Register-box').classList.add("hide")
    document.querySelector('#Sign-in-box').classList.remove("hide")

    document.getElementById("loginEmailtext").value = document.getElementById("inputemail").value
    document.getElementById("inputemail").value = ''
    document.getElementById("inputName").value = ''
    document.getElementById("inputName2").value = ''
    document.getElementById("inputpassword").value = ''
    document.getElementById("inputpassword").value = ''
  }else{
    document.querySelector('#dberror').classList.remove("hide")
  }

}
}
}

const gotoRegister = () => {
  document.querySelector('#Register-box').classList.remove("hide")
  document.querySelector('#Sign-in-box').classList.add("hide")

}


const addNewEntry = async () => {
  document.querySelector('#Add-box').classList.remove("hide")
  document.querySelector('#Action-box').classList.add("hide")
}

const submitNewEntry = async () => {

  let status3 = 0
  let data3 = ''
  const content = document.getElementById("inputContent").value
  const deadline = document.getElementById("inputDeadline").value

  let response = await fetch(`https://codejava-app-spring.herokuapp.com/createActionList`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': encode
      },
      body: JSON.stringify({
        deadline: deadline,
        content: content,
        userid: userid
      })
    })
    .then(response =>
      response.json().then(data => ({
        data: data,
        status: response.status
      })).then(res => {
        console.log(res.status, res.data)
        status3 = res.status
        data3 = res.data
      }))

    document.querySelector('#inputContent').value=''
    document.querySelector('#inputDeadline').value=''

}

const submitNewEntryBack = () => {
  console.log('got pressed')

  data4 = ''
  status4 = 0
  const getUserActions = async () => {
    console.log('hey')
    // ensure that the email/password match and then retrieve user info
    let response = await fetch(`https://codejava-app-spring.herokuapp.com/getUserActions?userid=${userid}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': encode
        }
      })
      .then(response =>
        response.json().then(data => ({
          data: data,
          status: response.status
        })).then(res => {
          console.log(res.status, res.data)
          status4 = res.status
          data4 = res.data
          console.log('got pressed2')
        }))


    if (status4 == 200) {

      document.querySelector('#Add-box').classList.add("hide")
      document.querySelector('#Action-box').classList.remove("hide")
    }
    getTableActions(data4)

  }
  getUserActions()
}



const deleteExistingEntry = async () => {

  const deleteNo = document.getElementById("delete-entry").value

  const deleteid = dict[deleteNo]
  console.log(deleteNo, deleteid)
  let response = await fetch(`https://codejava-app-spring.herokuapp.com/deleteaction/${deleteid}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': encode
    }
  })

  await submitNewEntryBack()
}

const openUpdateMenu = () => {
  if (menu == 1) {
    menu += 1
    document.querySelector('#update-box').classList.remove("hide")
  } else {
    menu -= 1
    document.querySelector('#update-box').classList.add("hide")
  }
}

const updateExistingEntry = async () => {

  document.querySelector('#update-box').classList.remove("hide")

  //document.querySelector('#Action-box').classList.remove("hide")
  const updatedContent = document.getElementById("inputUpdatedContent").value
  const updatedStatus = document.getElementById("inputUpdatedStatus").value
  const updatedDeadline = document.getElementById("inputUpdatedDeadline").value
  const updatedDeadline1 = document.getElementById("inputUpdatedDeadline1").value
  const updatedDeadline2 = document.getElementById("inputUpdatedDeadline2").value

  const fieldEntries = [updatedContent, updatedDeadline, updatedDeadline1, updatedDeadline2, updatedStatus]
  const fields = ['content', 'deadline', 'deadline1', 'deadline2', 'status']

  const updateNum = document.getElementById("update-entry").value
  const updateid = dict[updateNum]

  for (var i = 0; i < fieldEntries.length; i++) {

    if (fieldEntries[i] == '') {
      let currentText = document.getElementById("action-table").rows[updateNum].cells[i + 2].textContent
      fieldEntries[i] = currentText

    }
  }

  console.log('test field' + fieldEntries)

  let response = await fetch(`https://codejava-app-spring.herokuapp.com/updateAction?actionid=${updateid}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': encode
    },

    body: JSON.stringify({
      content: fieldEntries[0],
      deadline: fieldEntries[1],
      deadline1: fieldEntries[2],
      deadline2: fieldEntries[3],
      status: fieldEntries[4]

    })

  })
  await submitNewEntryBack()

}


const gotoSigninNav = () => {
  document.querySelector('#Register-box').classList.add("hide")
  document.querySelector('#update-box').classList.add("hide")
  document.querySelector('#Action-box').classList.add("hide")
  document.querySelector('#Add-box').classList.add("hide")
  document.querySelector('#Sign-in-box').classList.remove("hide")
  document.querySelector('#about-box').classList.add("hide")
}
const gotoRegisterNav = () => {
  document.querySelector('#Register-box').classList.remove("hide")
  document.querySelector('#update-box').classList.add("hide")
  document.querySelector('#Action-box').classList.add("hide")
  document.querySelector('#Add-box').classList.add("hide")
  document.querySelector('#Sign-in-box').classList.add("hide")
  document.querySelector('#about-box').classList.add("hide")

}
const gotosignOutNav = () => {
  document.querySelector('#Register-box').classList.add("hide")
  document.querySelector('#update-box').classList.add("hide")
  document.querySelector('#Action-box').classList.add("hide")
  document.querySelector('#Add-box').classList.add("hide")
  document.querySelector('#Sign-in-box').classList.remove("hide")
  document.querySelector('#about-box').classList.add("hide")

  dict = {};
  userid = 0
  encode = ''

}
const gotoHomeNav = () => {
  console.log(userid, encode)
  if (userid != 0 || encode != '') {

    document.querySelector('#Register-box').classList.add("hide")
    document.querySelector('#update-box').classList.add("hide")
    document.querySelector('#Action-box').classList.remove("hide")
    document.querySelector('#Add-box').classList.add("hide")
    document.querySelector('#Sign-in-box').classList.add("hide")
    document.querySelector('#about-box').classList.add("hide")
  } else {
    gotoSigninNav()

  }
}


const gotoAboutNav = () => {
  console.log("about")

  document.querySelector('#Register-box').classList.add("hide")
  document.querySelector('#update-box').classList.add("hide")
  document.querySelector('#Action-box').classList.add("hide")
  document.querySelector('#Add-box').classList.add("hide")
  document.querySelector('#Sign-in-box').classList.add("hide")
  document.querySelector('#about-box').classList.remove("hide")
}

const closeMenu = () => {
   $('.navbar-collapse').collapse('hide')}

const register = document.querySelector("#register-button")
const login = document.querySelector("#login-button")
const notregistered = document.querySelector("#not-registered")
const addEntry = document.querySelector("#add-button")
const addEntrySubmit = document.querySelector("#add-submit-button")
const addEntryBack = document.querySelector("#add-entry-back")
const updateEntry = document.querySelector("#update-button")
const updateSubmitEntry = document.querySelector("#update-submit-button")
const deleteEntry = document.querySelector("#delete-button")
const signInNav = document.querySelector("#sign-in-nav")
const registerNav = document.querySelector("#register-nav")
const signOutNav = document.querySelector("#sign-out-nav")
const homeNav = document.querySelector("#home-nav")
const logoTitleNav = document.querySelector("#logo-title")
const aboutNav = document.querySelector("#about")
const boxes = document.querySelectorAll('.nav-link')

register.addEventListener('click', registerClick)
login.addEventListener('click', verify)
notregistered.addEventListener('click', gotoRegister)
addEntry.addEventListener('click', addNewEntry)
addEntrySubmit.addEventListener('click', submitNewEntry)
addEntryBack.addEventListener('click', submitNewEntryBack)
updateEntry.addEventListener('click', openUpdateMenu)
updateSubmitEntry.addEventListener('click', updateExistingEntry)
deleteEntry.addEventListener('click', deleteExistingEntry)
signInNav.addEventListener('click', gotoSigninNav)
registerNav.addEventListener('click', gotoRegisterNav)
signOutNav.addEventListener('click', gotosignOutNav)
homeNav.addEventListener('click', gotoHomeNav)
logoTitleNav.addEventListener('click', gotoHomeNav)
aboutNav.addEventListener('click', gotoAboutNav)
boxes.forEach(box => { box.addEventListener('click', closeMenu)})
