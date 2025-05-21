import { formFields } from './formFields.js'
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

class WidgetConfig {
  constructor(widgetConfig) {
    this.phoneNumber = widgetConfig?.phoneNumber ?? phoneNumberDefault
    this.title = widgetConfig?.title ?? titleDefault
    this.primaryColor = widgetConfig?.primaryColor ?? primaryColorDefault
    this.firstMessage = widgetConfig?.firstMessage ?? firstMessageDefault
    this.webhookUrl = widgetConfig?.webhookUrl ?? webhookUrlDefault
    this.ctaText = widgetConfig?.ctaText ?? ctaTextDefault
    this.startOpened = widgetConfig?.startOpened ?? startOpenedDefault
    this.fields = widgetConfig?.fields ?? fieldsDefault
  }

  addField(field, placeholder) {
    if (!this.fields) {
      this.fields = []
    }

    if (!formFields[field]) {
      throw new Error('This field does not exist')
    }

    if (this.fields.length === 5) {
      throw new Error('You can only add 5 fields')
    }

    if (this.fields.find((f) => f.name === field)) {
      throw new Error('This field already exists')
    }

    this.fields.push({ ...formFields[field], placeholder })
    this.callListeners()
  }

  removeField(field) {
    if (!this.fields || this.fields.length === 1)
      throw new Error('You need at least one field')

    this.fields = this.fields.filter((f) => f.name !== field)
    this.callListeners()
  }

  set(fieldName, value) {
    this[fieldName] = value
    this.callListeners()
  }

  setListener(callback) {
    if (!this.globalListener) {
      this.globalListener = []
    }
    this.globalListener.push(callback)
  }

  callListeners() {
    console.log('listeners called')

    if (!this.globalListener) {
      return
    }

    for (const listener of this.globalListener) {
      listener()
    }
  }
}

const widgetConfig = new WidgetConfig()

widgetConfig.setListener(() => {
  deleteWidget()
  createNewWidget(widgetConfig)
})

function createNewWidget(widgetConfig) {
  console.log(widgetConfig)

  new WhatsAppButton(widgetConfig)
}

function deleteWidget() {
  document.querySelector('#whatsapp-button-iframe').remove()
}

function setWidgetConfig(e) {
  const { name: fieldName, value, type } = e.target

  if (type === 'checkbox') {
    widgetConfig.set('startOpened', e.target.checked)
    return
  }

  widgetConfig.set(fieldName, value)
}

function addListenersToWidgetConfigFields() {
  const widgetConfigFields = document.querySelectorAll('.form-config')
  for (const field of widgetConfigFields) {
    field.addEventListener('input', setWidgetConfig)
  }
}

async function generateWidgetCode(e) {
  e.preventDefault()
  e.stopPropagation()

  const {
    ctaText,
    firstMessage,
    phoneNumber,
    primaryColor,
    title,
    webhookUrl,
    startOpened,
  } = widgetConfig

  const code = `
    <script type='text/javascript' src="./script/WhatsAppButton.js"></script>
    <script type='text/javascript'>
      var whatsAppButton = new WhatsAppButton({
        phoneNumber: '${phoneNumber}',
        title: '${title}',
        primaryColor: '${primaryColor}',
        firstMessage: '${firstMessage}',
        webhookUrl: '${webhookUrl}',
        ctaText: '${ctaText}',
        startOpened: ${startOpened},
        fields: ${JSON.stringify(widgetConfig.fields)},
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

function resetDefaults() {
  window.location.reload()
}

function addListenerToResetDefaultButton() {
  document
    .getElementById('reset-defaults')
    .addEventListener('click', resetDefaults)
}

function addListenerToRemoveFieldBtn(fieldName) {
  if (!fieldName) {
    const customFields = document.querySelectorAll('[class^="remove-field-"]')

    for (const field of customFields) {
      field.addEventListener('click', () => {
        const fieldName = field.classList[0].split('-')[2]
        try {
          widgetConfig.removeField(fieldName)
          field.parentElement.remove()
        } catch (error) {
          alert(error.message)
        }
      })
    }
    return
  }

  const removeFieldBtn = document.querySelector(`.remove-field-${fieldName}`)

  removeFieldBtn.addEventListener('click', () => {
    try {
      widgetConfig.removeField(fieldName)
      removeFieldBtn.parentElement.remove()
    } catch (error) {
      alert(error.message)
    }
  })
}

function resetPLaceholderInput() {
  document.getElementById('field-placeholder').value = ''
}

function addField() {
  const fieldType = document.getElementById('field-type')
  const fieldName = fieldType.value
  const fieldText =
    document.getElementById('field-type').options[fieldType.selectedIndex].text
  const fieldPlaceholder = document.getElementById('field-placeholder').value

  try {
    widgetConfig.addField(fieldName, fieldPlaceholder)
    addFieldHtml(fieldName, fieldText, fieldPlaceholder)
    resetPLaceholderInput()
  } catch (error) {
    alert(error.message)
  }
}

function addFieldHtml(fieldName, fieldText, fieldPlaceholder) {
  const fieldItem = document.createElement('li')
  fieldItem.classList.add(`custom-field-${fieldName}`)

  fieldItem.innerHTML = `
            <span><strong>${fieldText}</strong></span>
            <span>${fieldPlaceholder}</span>
              <span class="remove-field-${fieldName}">
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

  document.getElementById('custom-fields-list').appendChild(fieldItem)

  addListenerToRemoveFieldBtn(fieldName)
}

function addListenerToAddFieldBtn() {
  const addFieldBtn = document.getElementById('add-field')

  addFieldBtn.addEventListener('click', addField)
}

;(function addListeners() {
  addListenersToWidgetConfigFields()

  addListenerToGenerateCodeButton()

  addListenerToResetDefaultButton()

  addListenerToRemoveFieldBtn()

  addListenerToAddFieldBtn()

  new WhatsAppButton(widgetConfig)
})()
