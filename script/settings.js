import {
  callToActionTextDefault,
  firstMessageDefault,
  phoneNumberDefault,
  primaryColorDefault,
  titleDefault,
  webhookUrlDefault,
} from './constants.js'

const formConfig = {
  phoneNumber: phoneNumberDefault,
  title: titleDefault,
  primaryColor: primaryColorDefault,
  firstMessage: firstMessageDefault,
  webhookUrl: webhookUrlDefault,
  callToActionText: callToActionTextDefault,
}

function setFormConfig(e) {
  const { name: fieldName, value } = e.target
  formConfig[fieldName] = value
}

function addListenersToFormConfigFields() {
  const formConfigFields = document.querySelectorAll('.form-config')
  for (const field of formConfigFields) {
    const fieldName = field.getAttribute('name')

    field.addEventListener('input', (e) => setFormConfig(e))

    // Change primary color on preview
    if (fieldName === 'primaryColor') {
      const wpButtonStyleSheet = Array.from(document.styleSheets).filter(
        (ss) => ss.title === 'wp-button-style'
      )[0]
      field.addEventListener('input', (e) => {
        const newColor = e.target.value
        wpButtonStyleSheet.cssRules[1].style.setProperty(
          '--primary-color',
          newColor
        )
      })
    }

    // Change form title on preview
    if (fieldName === 'title') {
      const formTitle = document.querySelector('.form-header h4')
      field.addEventListener('input', (e) => {
        const newTitle = e.target.value
        formTitle.innerText = newTitle
      })
    }

    // Change call to action text on preview
    if (fieldName === 'callToActionText') {
      const submitButton = document.getElementById('form-button')
      field.addEventListener('input', (e) => {
        const newCtaText = e.target.value
        submitButton.innerText = newCtaText
      })
    }
  }
}

function resetWpButtonStyles(e) {
  e.preventDefault()
  e.stopPropagation()

  // Primary color
  styleSheet.cssRules[1].style.setProperty(
    '--primary-color',
    primaryColorDefault
  )
  primaryColorInput.value = primaryColorDefault

  // Form title
  formTitleInput.value = titleDefault
  formTitle.innerText = titleDefault

  // Form (To) Number
  wpNumber.value = phoneNumberDefault
  whatsAppPhoneNumber = phoneNumberDefault

  // First message
  firstMessage.value = firstMessageDefault
  whatsAppFirstMessage = firstMessageDefault

  // Webhook URL
  webhookUrlInput.value = webhookUrlDefault
  webhookUrl = webhookUrlDefault

  // Call to Action Text
  ctaInput.value = callToActionTextDefault
  submitButton.innerText = callToActionTextDefault
  callToActionText = callToActionTextDefault
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
  } = formConfig

  const htmlContent =
    document.getElementsByClassName('whatsapp-container')[0].outerHTML

  const cssContent = Array.from(document.styleSheets[0].cssRules).reduce(
    (prev, curr) => `${prev} ${curr.cssText}\n`,
    ''
  )

  const code = `
    <script type='text/javascript' src="https://pub-850de9adf9bd40ce951ccd70ed288808.r2.dev/wormhole/WhatsAppButton.js"></script>
    <script type='text/javascript'>
      var cssContent1 = '${cssContent
        .replaceAll('\n', '')
        .substring(0, cssContent.replaceAll('\n', '').length / 2)}'
      var cssContent2 = '${cssContent
        .replaceAll('\n', '')
        .substring(
          cssContent.replaceAll('\n', '').length / 2,
          cssContent.replaceAll('\n', '').length
        )}'
      var whatsAppButton = new WhatsAppButton({
        phoneNumber: '${phoneNumber}',
        title: '${title}',
        primaryColor: '${primaryColor}',
        firstMessage: '${firstMessage}',
        webhookUrl: '${webhookUrl}',
        ctaText: '${callToActionText}',
        htmlContent: '${htmlContent.replaceAll('\n', '')}',
        cssContent: cssContent1 + cssContent2,
      })
      whatsAppButton.init()
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
})()

export default formConfig
