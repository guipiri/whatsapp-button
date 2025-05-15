import formConfig from './settings.js'

const { callToActionText, firstMessage, phoneNumber, webhookUrl } = formConfig

function replaceFirstMsgVars(name, email, phone, msg) {
  return msg
    .replace('{name}', name)
    .replace('{email}', email)
    .replace('{phone}', phone)
}

function toggleShowForm() {
  const formContainer = document.getElementById('form-container')
  formContainer.classList.toggle('none')
}

async function fetchWebhookUrl(name, email, phone) {
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

  await fetchWebhookUrl(name, email, phone)

  formButton.removeAttribute('disabled')
  formButton.innerText = callToActionText
  form.reset()

  toggleShowForm()

  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${replaceFirstMsgVars(
    name,
    email,
    phone,
    firstMessage
  )}`

  window.open(whatsappUrl, '_blank')
}

const whatsappButton = document.getElementsByClassName('whatsapp-button')[0]
const closeXButton = document.getElementsByClassName('close-icon')[0]
const form = document.getElementById('whatsapp-form')

form.addEventListener('submit', (e) => formSubmit(e, this))

whatsappButton.addEventListener('click', toggleShowForm)
closeXButton.addEventListener('click', toggleShowForm)
