import {
  ctaTextDefault,
  firstMessageDefault,
  phoneNumberDefault,
  primaryColorDefault,
  titleDefault,
  webhookUrlDefault,
  startOpenedDefault,
  fieldsDefault,
} from './WhatsAppButton.js'
import WhatsAppButton from './WhatsAppButton.js'
import { formFields } from './formFields.js'

const formConfig = {
  phoneNumber: phoneNumberDefault,
  title: titleDefault,
  primaryColor: primaryColorDefault,
  firstMessage: firstMessageDefault,
  webhookUrl: webhookUrlDefault,
  ctaText: ctaTextDefault,
  startOpened: startOpenedDefault,
  fields: fieldsDefault,
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

const addFieldBtn = document.getElementById('add-field')
const fieldType = document.getElementById('field-type')
const fieldPlaceholder = document.getElementById('field-placeholder')
const fieldList = document.getElementById('custom-fields-list')

let fieldsCounter = 2

addFieldBtn.addEventListener('click', () => {
  addField()
  fieldPlaceholder.value = ''
})

function addField() {
  fieldsCounter++

  const type = fieldType.options[fieldType.selectedIndex].text

  const name = fieldType.value

  const placeholder = fieldPlaceholder.value.trim()

  if (!placeholder) {
    alert('Por favor, preencha o placeholder.')
    return
  }

  const li = document.createElement('li')

  li.innerHTML = `
      <span><strong>${type}</strong></span>
      <span>${placeholder}</span>
      <span class="custom-field-item-${fieldsCounter}">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="1.5rem"
          height="1.5rem"
          viewBox="0 0 24 24"
        >
          <path
            d="M 10 2 L 9 3 L 3 3 L 3 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 4.3652344 7 L 6.0683594 22 L 17.931641 22 L 19.634766 7 L 4.3652344 7 z"
          ></path>
        </svg>
      </span>
    `

  fieldList.appendChild(li)
  console.log(
    document.getElementsByClassName(`custom-field-item-${fieldsCounter}`)[0]
  )

  document
    .getElementsByClassName(`custom-field-item-${fieldsCounter}`)[0]
    .addEventListener('click', removeField)

  addFieldToFormConfig({
    name,
    placeholder,
  })
}

function addFieldToFormConfig(field) {
  const fieldToAdd = formFields[field.name]
  fieldToAdd.placeholder = field.placeholder
  formConfig.fields.push(fieldToAdd)
}

function removeField(e) {
  console.log(e)

  const span = e.target.parentElement.parentElement
  const liToRemove = span.parentElement
  liToRemove.remove()

  const index = span.classList[0]

  console.log(index)

  const newFields = formConfig.fields.filter((_, i) => i !== index)
  formConfig.fields = newFields
  fieldsCounter--
}

// biome-ignore lint/complexity/noForEach: <explanation>
document.querySelectorAll('[class^=custom-field-item]').forEach((item) => {
  item.addEventListener('click', removeField)
})
