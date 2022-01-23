let username, email, downloadUrl
let file = {}
const initials = () => {

    username = document.querySelector('#name')
    email = document.querySelector('#email')
}

const firebaseConfig = {

    apiKey: "AIzaSyDXPbkOjWe19GJFqdJLVqTs6-m0Jxm7IyI",
    authDomain: "kiddopia-backend-demo.firebaseapp.com",
    projectId: "kiddopia-backend-demo",
    storageBucket: "kiddopia-backend-demo.appspot.com",
    messagingSenderId: "110915835100",
    appId: "1:110915835100:web:8d70b84b2a4702febad019",
    measurementId: "G-06C90NVEKS",
    databaseURL: "https://kiddopia-backend-demo-default-rtdb.firebaseio.com"
}

firebase.initializeApp(firebaseConfig)

const cleardata = () => {
    document.querySelector('.table table tbody').innerHTML = ""
}

const viewdata = () => {

    firebase.database().ref('users').on('value', (snapshot) => {
        const rawData = snapshot.val()

        cleardata()

        for (arr in rawData) {

            values = rawData[arr]

            let tabledata = `
            <tr>
            <td>${values.name}</td>
            <td>${values.email}</td>`

            if (values.file != null) {
                tabledata += `<td><a href="${values.file}" target="_blank" download>Download</a></td>`
            } else {
                tabledata += `<td>No attachment</td>`
            }

            tabledata += `<td>
            <button data-id=${arr} onclick='editview(this)'>Edit</button>
            <button data-id=${arr} onclick='deletedata(this)'>Delete</button>
            </td>
            </tr>`

            document.querySelector('.table table tbody').innerHTML += tabledata
        }
    })
}
viewdata()

const choosefile = (e) => {
    file = e.target.files[0]
}

const postdata = () => {

    initials()
    const id = Date.now()
    const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

    if (email.value.toLowerCase().match(regex) && username.value != null) {

        if (file.name != null) {

            firebase.storage().ref(`users/${username.value}_${id}_${file.name}`).put(file).then(() => {

                firebase.storage().ref(`users/${username.value}_${id}_${file.name}`).getDownloadURL().then((fileUrl) => {

                    downloadUrl = fileUrl
                    firebase.database().ref('users/' + id).set({

                        name: username.value,
                        email: email.value,
                        file: downloadUrl
                    })

                    cleardata()
                    viewdata()

                }).catch(err => {
                    console.log(err.message)
                })
            }).catch(err => {
                console.log(err.message)
            })

        } else {

            firebase.database().ref('users/' + id).set({
                name: username.value,
                email: email.value,
                file: null
            })

            cleardata()
            viewdata()
        }
    } else {
        alert('invalid data or email')
    }
}

const deletedata = (del) => {

    if (confirm('do you really want to delete?')) {

        firebase.database().ref('users/' + del.getAttribute('data-id')).remove()
        cleardata()
        viewdata()
    }
}

const editview = (view) => {

    const viewid = view.getAttribute('data-id')
    initials()

    document.getElementById('update').setAttribute('data-id', viewid)

    firebase.database().ref('users/' + viewid).on('value', (snapshot) => {
        const obj = snapshot.val()
        username.value = obj.name
        email.value = obj.email
    })
}

const updatedata = (dataid) => {

    initials()

    const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

    if (email.value.toLowerCase().match(regex) && username.value != null && dataid.getAttribute('data-id') != null) {

        if (file.name != null) {

            firebase.storage().ref(`users/${username.value}_${dataid.getAttribute('data-id')}_${file.name}`).put(file).then(() => {

                firebase.storage().ref(`users/${username.value}_${dataid.getAttribute('data-id')}_${file.name}`).getDownloadURL().then((fileUrl) => {

                    downloadUrl = fileUrl
                    firebase.database().ref('users/' + dataid.getAttribute('data-id')).update({

                        name: username.value,
                        email: email.value,
                        file: downloadUrl
                    })

                    cleardata()
                    viewdata()

                }).catch(err => {
                    console.log(err.message)
                })
            }).catch(err => {
                console.log(err.message)
            })

        } else {

            firebase.database().ref('users/' + dataid.getAttribute('data-id')).update({
                name: username.value,
                email: email.value,
                file: null
            })

            cleardata()
            viewdata()
        }
    } else {
        alert('invalid data or email could not update')
    }
}