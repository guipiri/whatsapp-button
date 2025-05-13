let whatsAppPhoneNumber = '5516999999999'
let whatsAppFirstMessage = 'Olá, meu nome é {{name}} e gostaria de informações!'
let webhookUrl =
  'https://script.google.com/macros/s/AKfycby1E9BQCd5Qh-luovTfTsJk7_zYimoRNHPj4ASW61uyzSMYmbOWywW7j0frPXso1j96/exec'
let callToActionText = 'Conversar'
let title = 'Fale Conosco'
let primaryColor = '#075f55'

// Change primary color
const primaryColorInput = document.getElementById('primary-color')
const styleSheet = document.styleSheets[0]
primaryColorInput.addEventListener('input', (e) => {
  const newColor = e.target.value
  styleSheet.cssRules[1].style.setProperty('--primary-color', newColor)
  primaryColor = newColor
})

// Change form title
const formTitleInput = document.getElementById('title')
const formTitle = document.querySelector('.form-header h4')
formTitleInput.addEventListener('input', (e) => {
  const newTitle = e.target.value
  formTitle.innerText = newTitle
  title = newTitle
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

// Change Call to Action Text
const ctaInput = document.getElementById('cta')
const submitButton = document.getElementById('form-button')
ctaInput.addEventListener('input', (e) => {
  const ctaText = e.target.value
  callToActionText = ctaText
  submitButton.innerText = ctaText
})

// Reset default styes feature
function resetWpButtonStyles(e) {
  e.preventDefault()
  e.stopPropagation()
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

  // Call to Action Text
  const ctaTextDefault = 'Conversar'
  ctaInput.value = ctaTextDefault
  submitButton.innerText = ctaTextDefault
  callToActionText = ctaTextDefault
}

document
  .getElementById('reset-styles')
  .addEventListener('click', resetWpButtonStyles)

async function generateWidgetCode(e) {
  e.preventDefault()
  e.stopPropagation()

  const htmlContent =
    document.getElementsByClassName('whatsapp-container')[0].outerHTML

  let cssContent = ''
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        cssContent += `${rule.cssText}\n`
      }
    } catch (e) {
      // Some stylesheets (like from other domains) may be restricted due to CORS
      console.warn('Cannot access stylesheet:', sheet.href, e)
    }
  }

  const code = `
    <script src="https://pub-850de9adf9bd40ce951ccd70ed288808.r2.dev/wormhole/WhatsAppButton.js"></script>
    <script>
      const whatsAppButton = new WhatsAppButton(
        '${whatsAppPhoneNumber}',
        '${whatsAppFirstMessage}',
        '${webhookUrl}',
        '${callToActionText}',
        '${primaryColor}',
        '${title}',
        '${htmlContent}',
        '${cssContent}'
      )
      whatsAppButton.init()
    </script>
  `

  document.getElementById('widget-code').textContent = code
  document.getElementsByClassName('code-block')[0].classList.remove('none')
}

document
  .getElementById('generate-code')
  .addEventListener('click', generateWidgetCode)

export {
  whatsAppPhoneNumber,
  whatsAppFirstMessage,
  webhookUrl,
  callToActionText,
  title,
  primaryColor,
}
