let whatsAppPhoneNumber = '5516999999999'
let whatsAppFirstMessage = 'Olá, meu nome é {{name}} e gostaria de informações!'
let webhookUrl =
  'https://script.google.com/macros/s/AKfycby1E9BQCd5Qh-luovTfTsJk7_zYimoRNHPj4ASW61uyzSMYmbOWywW7j0frPXso1j96/exec'

function replaceFirstMsgVars(name, email, phone, msg) {
  return msg
    .replace('{{name}}', name)
    .replace('{{email}}', email)
    .replace('{{phone}}', phone)
}

function toggleShowForm() {
  const formContainer = document.getElementById('form-container')
  formContainer.classList.toggle('none')
}

async function saveDataOnSpreadsheet(name, email, phone) {
  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        name,
        email,
        phone,
      }),
    })
    const json = await res.json()
    return json
  } catch (error) {
    console.error('Error on fetching webhook URL.', error)
    return null
  }
}

async function formSubmit(e) {
  e.preventDefault()

  const formButton = document.getElementById('form-button')
  formButton.setAttribute('disabled', true)
  formButton.innerText = 'Enviando...'

  const form = document.getElementById('whatsapp-form')
  const name = form.name.value
  const email = form.email.value
  const phone = form.phone.value

  await saveDataOnSpreadsheet(name, email, phone)

  formButton.removeAttribute('disabled')
  formButton.innerText = 'Conversar'
  form.reset()

  toggleShowForm()

  const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsAppPhoneNumber}&text=${replaceFirstMsgVars(
    name,
    email,
    phone,
    whatsAppFirstMessage
  )}`

  window.open(whatsappUrl, '_blank')
}

const style = document.createElement('style')
style.textContent = this.cssContent
document.head.appendChild(style)

const whatsappButton = document.getElementsByClassName('whatsapp-button')[0]
const closeXButton = document.getElementsByClassName('close-icon')[0]
const form = document.getElementById('whatsapp-form')

form.addEventListener('submit', (e) => formSubmit(e, this))

whatsappButton.addEventListener('click', toggleShowForm)
closeXButton.addEventListener('click', toggleShowForm)

// Change primary color
const primaryColorInput = document.getElementById('primary-color')
const styleSheet = document.styleSheets[0]
primaryColorInput.addEventListener('input', (e) => {
  const color = e.target.value
  styleSheet.cssRules[1].style.setProperty('--primary-color', color)
})

// Change form title
const formTitleInput = document.getElementById('title')
const formTitle = document.querySelector('.form-header h4')
formTitleInput.addEventListener('input', (e) => {
  const title = e.target.value
  formTitle.innerText = title
})

// Change form (To) Number
const wpNumber = document.getElementById('wp-number')
wpNumber.addEventListener('input', (e) => {
  const number = e.target.value
  whatsAppPhoneNumber = number
})

// Change first message
const firstMessage = document.getElementById('first-message')
firstMessage.addEventListener('input', (e) => {
  const message = e.target.value
  whatsAppFirstMessage = message
})

// Change Webhook URL
const webhookUrlInput = document.getElementById('webhook-url')
webhookUrlInput.addEventListener('input', (e) => {
  const url = e.target.value
  webhookUrl = url
})

// Reset default styes feature
function resetWpButtonStyles() {
  // Primary color
  const primaryColorDefault = '#075f55'
  styleSheet.cssRules[1].style.setProperty(
    '--primary-color',
    primaryColorDefault
  )
  primaryColorInput.value = primaryColorDefault

  // Form title
  const formTitleDefault = 'Fale Conosco'
  formTitleInput.value = formTitleDefault
  formTitle.innerText = formTitleDefault

  // Form (To) Number
  const wpNumberDefault = '5516999999999'
  wpNumber.value = wpNumberDefault
  whatsAppPhoneNumber = wpNumberDefault

  // First message
  const firstMessageDefault =
    'Olá, meu nome é {{name}} e gostaria de informações!'
  firstMessage.value = firstMessageDefault
  whatsAppFirstMessage = firstMessageDefault

  // Webhook URL
  const webhookUrlDefault =
    'https://script.google.com/macros/s/AKfycby1E9BQCd5Qh-luovTfTsJk7_zYimoRNHPj4ASW61uyzSMYmbOWywW7j0frPXso1j96/exec'
  webhookUrlInput.value = webhookUrlDefault
  webhookUrl = webhookUrlDefault
}

document
  .getElementById('reset-styles')
  .addEventListener('click', resetWpButtonStyles)
