import {
  ctaTextDefault,
  firstMessageDefault,
  phoneNumberDefault,
  primaryColorDefault,
  titleDefault,
  webhookUrlDefault,
  startOpenedDefault,
} from './constants.js'
import WhatsAppButton from './WhatsAppButton.js'

const formConfig = {
  phoneNumber: phoneNumberDefault,
  title: titleDefault,
  primaryColor: primaryColorDefault,
  firstMessage: firstMessageDefault,
  webhookUrl: webhookUrlDefault,
  ctaText: ctaTextDefault,
  startOpened: startOpenedDefault,
}

function setFormConfig(e) {
  const { name: fieldName, value, type } = e.target

  if (type === 'checkbox') {
    formConfig.startOpened = e.target.checked
    return
  }

  formConfig[fieldName] = value
}

function createNewButton(formConfig) {
  new WhatsAppButton(formConfig)
}

function deleteButton() {
  document.querySelector('#whatsapp-button-iframe').remove()
}

function addListenersToFormConfigFields() {
  const formConfigFields = document.querySelectorAll('.form-config')
  for (const field of formConfigFields) {
    field.addEventListener('input', (e) => {
      setFormConfig(e)
      deleteButton()
      createNewButton(formConfig)
    })
  }
}

function resetWpButtonStyles(e) {
  e.preventDefault()
  e.stopPropagation()

  deleteButton()
  createNewButton()

  document.getElementById('settings-form').reset()
}

function addListenerToResetStylesButton() {
  document
    .getElementById('reset-styles')
    .addEventListener('click', resetWpButtonStyles)
}

async function generateWidgetCode(e) {
  e.preventDefault()
  e.stopPropagation()

  const {
    callToActionText,
    firstMessage,
    phoneNumber,
    primaryColor,
    title,
    webhookUrl,
    startOpened,
  } = formConfig

  const code = `
    <script type='text/javascript' src="./script/WhatsAppButton.js"></script>
    <script type='text/javascript'>
      var whatsAppButton = new WhatsAppButton({
        phoneNumber: '${phoneNumber}',
        title: '${title}',
        primaryColor: '${primaryColor}',
        firstMessage: '${firstMessage}',
        webhookUrl: '${webhookUrl}',
        ctaText: '${callToActionText}',
        startOpened: ${startOpened},
      })
    </script>
  `

  insertCode(code)
}

function insertCode(code) {
  document.getElementById('widget-code').textContent = code
  document.getElementsByClassName('code-block')[0].classList.remove('none')
}

function addListenerToGenerateCodeButton() {
  document
    .getElementById('generate-code')
    .addEventListener('click', generateWidgetCode)
}

;(function addListeners() {
  addListenersToFormConfigFields()

  addListenerToResetStylesButton()

  addListenerToGenerateCodeButton()

  new WhatsAppButton(formConfig)
})()
